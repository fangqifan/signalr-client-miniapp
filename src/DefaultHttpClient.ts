// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

import { AbortError } from "./Errors";
import { HttpClient, HttpRequest, HttpResponse } from "./HttpClient";
import { MiniAppHttpClient } from "./MiniAppHttpClient";

/** Default implementation of {@link @aspnet/signalr.HttpClient}. */
export class DefaultHttpClient extends HttpClient {
    private readonly httpClient: HttpClient;

    /** Creates a new instance of the {@link @aspnet/signalr.DefaultHttpClient}, using the provided {@link @aspnet/signalr.ILogger} to log messages. */
    public constructor() {
        super();

        this.httpClient = new MiniAppHttpClient();
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

        return this.httpClient.send(request);
    }
}
