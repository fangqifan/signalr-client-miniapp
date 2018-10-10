// Copyright (c) fangqifan@kirinsoft.cn. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { AbortError, HttpError } from "./Errors";
import { HttpClient, HttpResponse } from "./HttpClient";
var MiniAppHttpClient = /** @class */ (function (_super) {
    __extends(MiniAppHttpClient, _super);
    function MiniAppHttpClient() {
        return _super.call(this) || this;
    }
    /** @inheritDoc */
    MiniAppHttpClient.prototype.send = function (request) {
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
        return new Promise(function (resolve, reject) {
            var requestObj = {};
            var task = null;
            requestObj.url = request.url;
            requestObj.method = request.method;
            requestObj.dataType = "text";
            requestObj.header = {
                "content-type": "text/plain;charset=UTF-8",
            };
            requestObj.data = request.content || "";
            var headers = request.headers;
            if (headers) {
                Object.keys(headers)
                    .forEach(function (header) {
                    requestObj.header[header] = headers[header];
                });
            }
            if (request.responseType) {
                requestObj.responseType = request.responseType;
            }
            if (request.abortSignal) {
                request.abortSignal.onabort = function () {
                    if (task != null) {
                        task.abort();
                    }
                    reject(new AbortError());
                };
            }
            requestObj.success = function (res) {
                if (request.abortSignal) {
                    request.abortSignal.onabort = null;
                }
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(new HttpResponse(res.statusCode, res.statusCode.toString(), res.data));
                }
                else {
                    reject(new HttpError("request failed.", res.statusCode));
                }
            };
            requestObj.fail = function () {
                reject(new HttpError("request failed.", 0));
            };
            task = wx.request(requestObj);
        });
    };
    return MiniAppHttpClient;
}(HttpClient));
export { MiniAppHttpClient };
//# sourceMappingURL=MiniAppHttpClient.js.map