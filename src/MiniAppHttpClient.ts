// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

import { AbortError, HttpError } from "./Errors";
import { HttpClient, HttpRequest, HttpResponse } from "./HttpClient";

export class MiniAppHttpClient extends HttpClient {

    public constructor() {
        super();
    }

    /** @inheritDoc */
    public send(request: HttpRequest): Promise<HttpResponse> {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            return Promise.reject(new AbortError());
        }

        if (!request.method) {
            return Promise.reject(new Error("No method defined."));
        }
        if (!request.url) {
            return Promise.reject(new Error("No url defined."));
        }

        return new Promise<HttpResponse>((resolve, reject) => {
            const requestObj: any = {};
            let task: any = null;

            requestObj.url = request.url;
            requestObj.method = request.method;
            requestObj.dataType = "text";
            requestObj.header = {
                "content-type": "text/plain;charset=UTF-8",
            };
            requestObj.data = request.content || "";

            const headers = request.headers;
            if (headers) {
                Object.keys(headers)
                    .forEach((header) => {
                        requestObj.header[header] = headers[header];
                    });
            }

            if (request.responseType) {
                requestObj.responseType = request.responseType;
            }

            if (request.abortSignal) {
                request.abortSignal.onabort = () => {
                    if (task != null) {
                        task.abort();
                    }
                    reject(new AbortError());
                };
            }

            requestObj.success = (res: any) => {
                if (request.abortSignal) {
                    request.abortSignal.onabort = null;
                }

                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(new HttpResponse(res.statusCode, res.statusCode.toString(), res.data));
                } else {
                    reject(new HttpError("request failed.", res.statusCode));
                }
            };

            requestObj.fail = () => {
                reject(new HttpError("request failed.", 0));
            };

            task = wx.request(requestObj);
        });
    }
}
