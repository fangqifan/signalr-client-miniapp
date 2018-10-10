import { HttpClient, HttpRequest, HttpResponse } from "./HttpClient";
export declare class MiniAppHttpClient extends HttpClient {
    constructor();
    /** @inheritDoc */
    send(request: HttpRequest): Promise<HttpResponse>;
}
