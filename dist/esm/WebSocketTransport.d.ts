import { ILogger } from "./ILogger";
import { ITransport, TransferFormat } from "./ITransport";
/** @private */
export declare class WebSocketTransport implements ITransport {
    private readonly logger;
    private readonly accessTokenFactory;
    private readonly logMessageContent;
    private webSocket?;
    private state;
    onreceive: ((data: string | ArrayBuffer) => void) | null;
    onclose: ((error?: Error) => void) | null;
    constructor(accessTokenFactory: (() => string | Promise<string>) | undefined, logger: ILogger, logMessageContent: boolean);
    connect(url: string, transferFormat: TransferFormat): Promise<void>;
    send(data: any): Promise<void>;
    stop(): Promise<void>;
    private close;
}
