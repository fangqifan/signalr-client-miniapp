import { HttpClient, HttpRequest, HttpResponse } from "./HttpClient";
/** Default implementation of {@link @aspnet/signalr.HttpClient}. */
export declare class DefaultHttpClient extends HttpClient {
    private readonly httpClient;
    /** Creates a new instance of the {@link @aspnet/signalr.DefaultHttpClient}, using the provided {@link @aspnet/signalr.ILogger} to log messages. */
    constructor();
    /** @inheritDoc */
    send(request: HttpRequest): Promise<HttpResponse>;
}
