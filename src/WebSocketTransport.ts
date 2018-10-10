// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

import { ILogger, LogLevel } from "./ILogger";
import { ITransport, TransferFormat } from "./ITransport";
import { Arg, getDataDetail } from "./Utils";

/** @private */
export class WebSocketTransport implements ITransport {
    private readonly logger: ILogger;
    private readonly accessTokenFactory: (() => string | Promise<string>) | undefined;
    private readonly logMessageContent: boolean;
    private webSocket?: WXSocketTaskAPI;
    private state: boolean;

    public onreceive: ((data: string | ArrayBuffer) => void) | null;
    public onclose: ((error?: Error) => void) | null;

    constructor(accessTokenFactory: (() => string | Promise<string>) | undefined, logger: ILogger, logMessageContent: boolean) {
        this.logger = logger;
        this.accessTokenFactory = accessTokenFactory;
        this.logMessageContent = logMessageContent;
        this.state = false;

        this.onreceive = null;
        this.onclose = null;
    }

    public async connect(url: string, transferFormat: TransferFormat): Promise<void> {
        Arg.isRequired(url, "url");
        Arg.isRequired(transferFormat, "transferFormat");
        Arg.isIn(transferFormat, TransferFormat, "transferFormat");

        this.logger.log(LogLevel.Trace, "(WebSockets transport) Connecting");

        if (this.accessTokenFactory) {
            const token = await this.accessTokenFactory();
            if (token) {
                url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(token)}`;
            }
        }

        return new Promise<void>((resolve, reject) => {
            url = url.replace(/^http/, "ws");
            const webSocket = wx.connectSocket({ url });
            // wx not suppert binaryType
            // if (transferFormat === TransferFormat.Binary) {
            //     webSocket.binaryType = "arraybuffer";
            // }

            // tslint:disable-next-line:variable-name
            webSocket.onOpen(() => {
                // webSocket.onOpen = () => {
                this.logger.log(LogLevel.Information, `WebSocket connected to ${url}`);
                this.webSocket = webSocket;
                this.state = true;
                resolve();
            });

            webSocket.onError((error: any) => {
                // webSocket.onError = (error: any) => {
                reject(error);
            });

            webSocket.onMessage((data: any) => {
                this.logger.log(LogLevel.Trace, `(WebSockets transport) data received. ${getDataDetail(data, this.logMessageContent)}.`);
                if (this.onreceive) {
                    this.onreceive(data.data);
                }
            });

            webSocket.onClose(() => this.close());
        });
    }

    public send(data: any): Promise<void> {
        if (this.webSocket && this.state) {
            this.logger.log(LogLevel.Trace, `(WebSockets transport) sending data. ${getDataDetail(data, this.logMessageContent)}.`);
            const ws = this.webSocket;
            return new Promise((resolve, reject) => {
                ws.send({
                    data,
                    fail: reject,
                    success: resolve,
                });
            });
        }

        return Promise.reject("WebSocket is not in the OPEN state");
    }

    public stop(): Promise<void> {
        if (this.webSocket) {
            // Clear websocket handlers because we are considering the socket closed now
            this.webSocket.onClose = () => { };
            this.webSocket.onMessage = () => { };
            this.webSocket.onError = () => { };
            this.webSocket.close({});
            this.webSocket = undefined;

            // Manually invoke onclose callback inline so we know the HttpConnection was closed properly before returning
            // This also solves an issue where websocket.onclose could take 18+ seconds to trigger during network disconnects
            this.close(undefined);
        }

        return Promise.resolve();
    }

    private close(event?: CloseEvent): void {
        // webSocket will be null if the transport did not start successfully
        this.state = false;
        this.logger.log(LogLevel.Trace, "(WebSockets transport) socket closed.");
        if (this.onclose) {
            if (event && (event.wasClean === false || event.code !== 1000)) {
                this.onclose(new Error(`Websocket closed with status code: ${event.code} (${event.reason})`));
            } else {
                this.onclose();
            }
        }
    }
}
