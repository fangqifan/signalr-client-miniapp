type WXCommonCallback = (data: any) => void;
type WXMergedAPI = WXNetAPI &  WXStorageAPI;

interface WXCommonObj {
	success?: WXCommonCallback;
	fail?: WXCommonCallback;
	complete?: WXCommonCallback;
}

interface WXNetAPIRequestObj extends WXCommonObj {
	url: string;
	data?: Object|string;
	header?: Object;
	method?: string;
}

interface WXNetAPIConnectSocketObj extends WXCommonObj {
	url: string;
	data?: Object;
	header?: Object;
	method?: string;
}

interface WXNetAPI {
	request(obj: WXNetAPIRequestObj):WXRequestTaskObj;
	connectSocket(obj: WXNetAPIConnectSocketObj):WXSocketTaskAPI;
	onSocketOpen(cb: WXCommonCallback):void;
	onSocketError(cb: WXCommonCallback):void;
	sendSocketMessage(obj: {data: string|ArrayBuffer} & WXCommonObj):void;
	onSocketMessage(callback: (data: string|ArrayBuffer) => void):void;
	closeSocket():void;
	onSocketClose(cb: WXCommonCallback):void;
}

interface WXRequestTaskObj{
	abort():void;
}

interface WXSocketTaskSendObj extends WXCommonObj{
	data: number;
}

interface WXSocketTaskCloseObj extends WXCommonObj{
	code?: number;
	reason?: string;
}

interface WXSocketTaskAPI{
	send(obj:WXSocketTaskSendObj):void;
	close(obj:WXSocketTaskCloseObj):void;
	onOpen(callback:WXCommonCallback):void;
	onClose(callback:WXCommonCallback):void;
	onError(callback:WXCommonCallback):void;
	onMessage(callback:WXCommonCallback):void;
}

interface WXGetStorageObj {
	key: string;
	success: (res: { data: any, [propName: string]: any }) => void;
	fail?: WXCommonCallback;
	complete?: WXCommonCallback;
}

interface WXGetStorageInfoObj {
	success: (res: { keys: string[], currentSize: number, limitSize: number, [propName: string]: any }) => void;
	fail?: WXCommonCallback;
	complete?: WXCommonCallback;
}

interface WXStorageAPI {
	setStorage(obj: { key: string, data: Object|string } & WXCommonObj):void;
	setStorageSync(key: string, data: Object|string):void;
	getStorage(obj: WXGetStorageObj):void;
	getStorageSync(key: string): Object|string;
	getStorageInfo(obj: WXGetStorageInfoObj):void;
	getStorageInfoSync(): { keys: string[], currentSize: number, limitSize: number };
	removeStorage(obj: WXGetStorageObj):void;
	removeStorageSync(key: string):void;
	clearStorage():void;
	clearStorageSync():void;
}

declare let wx: WXMergedAPI;

declare module "WXAPI" {
	export let wx: WXMergedAPI;
}
