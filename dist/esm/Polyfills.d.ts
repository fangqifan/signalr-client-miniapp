export interface WebSocketConstructor {
    new (url: string, protocols?: string | string[]): WXSocketTaskAPI;
    readonly CLOSED: number;
    readonly CLOSING: number;
    readonly CONNECTING: number;
    readonly OPEN: number;
}
