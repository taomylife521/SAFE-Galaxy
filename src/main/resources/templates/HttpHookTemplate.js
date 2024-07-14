var ByteUtil = Java.type("org.m2sec.core.utils.ByteUtil")
var CodeUtil = Java.type("org.m2sec.core.utils.CodeUtil")
var CryptoUtil = Java.type("org.m2sec.core.utils.CryptoUtil")
var HashUtil = Java.type("org.m2sec.core.utils.HashUtil")
var HttpUtil = Java.type("org.m2sec.core.utils.HttpUtil")
var JsonUtil = Java.type("org.m2sec.core.utils.JsonUtil")
var MacUtil = Java.type("org.m2sec.core.utils.MacUtil")
var YamlUtil = Java.type("org.m2sec.core.utils.YamlUtil")
var Request = Java.type("org.m2sec.core.models.Request")
var Response = Java.type("org.m2sec.core.models.Response")
var String = Java.type("java.lang.String")

ALGORITHM = "AES/CBC/PKCS5Padding"
secret = "32byteslongsecretkeyforaes256!aa".getBytes()
iv = "16byteslongiv456".getBytes()
paramMap = {"iv": iv}
jsonKey = "data"
log = void 0

/**
 * HTTP请求从Burp将要发送到Server时被调用。在此处完成请求加密的代码就可以将加密后的请求报文发送到Server。
 * @param {Request} request 请求对象，https://github1s.com/outlaws-bai/Galaxy/blob/main/src/main/java/org/m2sec/core/models/Request.java
 * @returns 经过处理后的request对象，返回null代表不需要处理
 */
function hook_request_to_burp(request){
}


/**
 * HTTP请求从Burp将要发送到Server时被调用。在此处完成请求加密的代码就可以将加密后的请求报文发送到Server。
 * @param {Request} request 请求对象，https://github1s.com/outlaws-bai/Galaxy/blob/main/src/main/java/org/m2sec/core/models/Request.java
 * @returns 经过处理后的request对象，返回null代表不需要处理
 */
function hook_request_to_server(request){
}


/**
 * HTTP请求从Server到达Burp时被调用。在此处完成响应解密的代码就可以在Burp中看到明文的响应报文。
 * @param {Response} response 响应对象，https://github1s.com/outlaws-bai/Galaxy/blob/main/src/main/java/org/m2sec/core/models/Response.java
 * @returns 经过处理后的response对象，返回null代表不需要处理
 */
function hook_response_to_burp(response){
}


/**
 * HTTP请求从Burp将要发送到Client时被调用。在此处完成响应加密的代码就可以将加密后的响应报文返回给Client。
 * @param {Response} response 响应对象，https://github1s.com/outlaws-bai/Galaxy/blob/main/src/main/java/org/m2sec/core/models/Response.java
 * @returns 经过处理后的response对象，返回null代表不需要处理
 */
function hook_response_to_client(response){
}


function set_log(log1){
    log = log1
}