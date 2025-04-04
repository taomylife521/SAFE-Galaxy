import json
import base64
from java.org.m2sec.core.utils import (
    CodeUtil,
    CryptoUtil,
    HashUtil,
    MacUtil,
    FactorUtil,
)
from java.org.m2sec.core.models import Request, Response
from java.lang import Byte

"""
跨语言能力来自于graalpy (对应python3.11)
按 Ctrl（command） + ` 可查看内置函数
"""

ALGORITHM = "SM2"
MODE = "c1c2c3"
publicKey1Base64 = "MFkwEwYHKoZIzj0CAQYIKoEcz1UBgi0DQgAEBv9Z+xbmSOH3W/V9UEpU1yUiJKNGh/I8EiENTPYxX3GujsZyKhuEUzxloKCATcNaKWi7w/yK3PxGONM4xvMlIQ=="
privateKey1Base64 = "MIGTAgEAMBMGByqGSM49AgEGCCqBHM9VAYItBHkwdwIBAQQgWmIprZ5a6TsqRUgy32J+F22AYIKl+14P4qlw/LPPCcagCgYIKoEcz1UBgi2hRANCAAQG/1n7FuZI4fdb9X1QSlTXJSIko0aH8jwSIQ1M9jFfca6OxnIqG4RTPGWgoIBNw1opaLvD/Irc/EY40zjG8yUh"

publicKey2Base64="MFkwEwYHKoZIzj0CAQYIKoEcz1UBgi0DQgAE/1kmIjlOfsqG9hN4b/O3hiSI91ErgVDeqB9YOgCFiUiFyPo32pCHh691zGnoAj0l/P132CyLgBeH6TUa/TrLUg=="
privateKey2Base64 = "MIGTAgEAMBMGByqGSM49AgEGCCqBHM9VAYItBHkwdwIBAQQgP8vW9tEh0dMP5gJNsol5Gyc6jvvgK1NRqOVg8VaLYVygCgYIKoEcz1UBgi2hRANCAAT/WSYiOU5+yob2E3hv87eGJIj3USuBUN6oH1g6AIWJSIXI+jfakIeHr3XMaegCPSX8/XfYLIuAF4fpNRr9OstS"

publicKey1 = CodeUtil.b64decode(publicKey1Base64)
privateKey1 = CodeUtil.b64decode(privateKey1Base64)

publicKey2 = CodeUtil.b64decode(publicKey2Base64)
privateKey2 = CodeUtil.b64decode(privateKey2Base64)
jsonKey = "data"
log = None

def hook_request_to_burp(request: Request) -> Request:
    """HTTP请求从客户端到达Burp时被调用。在此处完成请求解密的代码就可以在Burp中看到明文的请求报文。

    Args:
        request (Request): 请求对象

    Returns:
        Request: 经过处理后的request对象，返回null代表从当前节点开始流量不再需要处理
    """
    # 获取需要解密的数据
    encryptedData: bytes = get_data(request.getContent())
    # 调用内置函数解密
    data: bytes = decrypt(encryptedData, privateKey1)
    # 更新body为已解密的数据
    request.setContent(data)
    return request


def hook_request_to_server(request: Request) -> Request:
    """HTTP请求从Burp将要发送到Server时被调用。在此处完成请求加密的代码就可以将加密后的请求报文发送到Server。

    Args:
        request (Request): 请求对象

    Returns:
        Request: 经过处理后的request对象，返回null代表从当前节点开始流量不再需要处理
    """
    # 获取被解密的数据
    data: bytes = request.getContent()
    # 调用内置函数加密回去
    encryptedData: bytes = encrypt(data, publicKey1)
    # 将已加密的数据转换为Server可识别的格式
    body: bytes = to_data(encryptedData)
    # 更新body
    request.setContent(body)
    return request


def hook_response_to_burp(response: Response) -> Response:
    """HTTP响应从Server到达Burp时被调用。在此处完成响应解密的代码就可以在Burp中看到明文的响应报文。

    Args:
        response (Response): 响应对象

    Returns:
        Response: 经过处理后的response对象，返回null代表从当前节点开始流量不再需要处理
    """
    # 获取需要解密的数据
    encryptedData: bytes = get_data(response.getContent())
    # 调用内置函数解密
    data: bytes = decrypt(encryptedData, privateKey2)
    # 更新body
    response.setContent(data)
    return response


def hook_response_to_client(response: Response) -> Response:
    """HTTP响应从Burp将要发送到Client时被调用。在此处完成响应加密的代码就可以将加密后的响应报文返回给Client。

    Args:
        response (Response): 响应对象

    Returns:
        Response: 经过处理后的response对象，返回null代表从当前节点开始流量不再需要处理
    """
    # 获取被解密的数据
    data = response.getContent()
    # 调用内置函数加密回去
    encryptedData = encrypt(data, publicKey2)
    # 更新body
    # 将已加密的数据转换为Server可识别的格式
    body = to_data(encryptedData)
    # 更新body
    response.setContent(body)
    return response

def decrypt(content: bytes, secret: bytes) -> bytes:
    return CryptoUtil.sm2Decrypt(MODE, content, secret)

def encrypt(content: bytes, secret: bytes) -> bytes:
    return CryptoUtil.sm2Encrypt(MODE, content, secret)

def get_data(content: bytes) -> bytes:
    return CodeUtil.b64decode(json.loads(convert_bytes(content))[jsonKey])

def to_data(content: bytes) -> bytes:
    jsonBody = {}
    jsonBody[jsonKey] = CodeUtil.b64encodeToString(content)
    return json.dumps(jsonBody).encode()


def convert_bytes(java_byte_array: bytes) -> bytes:
    """将java的字节数组转为graalpy的字节数组, java的字节数组对应到graalpy中的类型是foreign对象, 如果想要用graalpy处理java的字节数组，最好先调用该函数"""
    return bytes([Byte.toUnsignedInt(b) for b in java_byte_array])


def set_log(log1):
    """程序在最开始会自动调用该函数，在上方函数可以放心使用log对象"""
    global log
    log = log1
    import sys
    log.info("python version: {}", sys.version)
