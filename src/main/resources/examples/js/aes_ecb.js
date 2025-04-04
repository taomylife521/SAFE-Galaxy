var CodeUtil = Java.type("org.m2sec.core.utils.CodeUtil")
var CryptoUtil = Java.type("org.m2sec.core.utils.CryptoUtil")
var HashUtil = Java.type("org.m2sec.core.utils.HashUtil")
var JsonUtil = Java.type("org.m2sec.core.utils.JsonUtil")
var MacUtil = Java.type("org.m2sec.core.utils.MacUtil")
var FactorUtil = Java.type("org.m2sec.core.utils.FactorUtil")
var Request = Java.type("org.m2sec.core.models.Request")
var Response = Java.type("org.m2sec.core.models.Response")

ALGORITHM = "AES/ECB/PKCS5Padding"
secret = stringToByteArray("32byteslongsecretkeyforaes256!aa")
jsonKey = "data"
log = void 0

/**
 * 跨语言能力来自于graaljs
 * 按 Ctrl（command） + ` 可查看内置函数
 */

/**
 * HTTP请求从Burp将要发送到Server时被调用。在此处完成请求加密的代码就可以将加密后的请求报文发送到Server。
 * @param {Request} request 请求对象
 * @returns 经过处理后的request对象，返回null代表从当前节点开始流量不再需要处理
 */
function hook_request_to_burp(request) {
    // 获取需要解密的数据
    encryptedData = get_data(request.getContent());
    // 调用内置函数解密
    data = decrypt(encryptedData);
    // 更新body为已解密的数据
    request.setContent(data);
    return request;
}


/**
 * HTTP请求从Burp将要发送到Server时被调用。在此处完成请求加密的代码就可以将加密后的请求报文发送到Server。
 * @param {Request} request 请求对象
 * @returns 经过处理后的request对象，返回null代表从当前节点开始流量不再需要处理
 */
function hook_request_to_server(request) {
    // 获取被解密的数据
    data = request.getContent();
    // 调用内置函数加密回去
    encryptedData = encrypt(data);
    // 将已加密的数据转换为Server可识别的格式
    body = to_data(encryptedData);
    // 更新body
    request.setContent(body);
    return request;
}


/**
 * HTTP响应从Server到达Burp时被调用。在此处完成响应解密的代码就可以在Burp中看到明文的响应报文。
 * @param {Response} response 响应对象
 * @returns 经过处理后的response对象，返回null代表从当前节点开始流量不再需要处理
 */
function hook_response_to_burp(response) {
    // 获取需要解密的数据
    encryptedData = get_data(response.getContent());
    // 调用内置函数解密
    data = decrypt(encryptedData);
    // 更新body
    response.setContent(data);
    return response;
}


/**
 * HTTP响应从Burp将要发送到Client时被调用。在此处完成响应加密的代码就可以将加密后的响应报文返回给Client。
 * @param {Response} response 响应对象
 * @returns 经过处理后的response对象，返回null代表从当前节点开始流量不再需要处理
 */
function hook_response_to_client(response) {
    // 获取被解密的数据
    data = response.getContent();
    // 调用内置函数加密回去
    encryptedData = encrypt(data);
    // 更新body
    // 将已加密的数据转换为Server可识别的格式
    body = to_data(encryptedData);
    // 更新body
    response.setContent(body);
    return response;
}

function decrypt(content) {
    return CryptoUtil.aesDecrypt(ALGORITHM, content, secret, null);
}

function encrypt(content) {
    return CryptoUtil.aesEncrypt(ALGORITHM, content, secret, null);
}

function get_data(content) {
    return CodeUtil.b64decode(JsonUtil.jsonStrToMap(byteArrayToString(content)).get(jsonKey))
}


function to_data(content) {
    jsonBody = {}
    jsonBody[jsonKey] = CodeUtil.b64encodeToString(content)
    return stringToByteArray(JsonUtil.toJsonStr(jsonBody))
}

/**
 * 程序在最开始会自动调用该函数，在上方函数可以放心使用log对象
 */
function set_log(log1) {
    log = log1
}

/**
 * 字符串转字节数组
 */
function stringToByteArray(str) {
    let byteArray = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        byteArray[i] = str.charCodeAt(i);
    }
    return byteArray;
}

/**
 * 字节数组转字符串
 */
function byteArrayToString(byteArray) {
    return String.fromCharCode.apply(null, byteArray);
}