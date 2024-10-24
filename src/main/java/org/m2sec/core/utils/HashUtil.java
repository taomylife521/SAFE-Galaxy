package org.m2sec.core.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * @author: outlaws-bai
 * @date: 2024/6/21 20:23
 * @description:
 */

public class HashUtil {

    public static final String SHA_256 = "SHA256";
    public static final String SHA_1 = "SHA1";

    public static final String MD_5 = "MD5";

    public static byte[] calc(String algorithm, byte[] data) {
        try {
            MessageDigest md = MessageDigest.getInstance(algorithm);
            return md.digest(data);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public static String calcToHex(String algorithm, byte[] data) {
        return CodeUtil.hexEncodeToString(calc(algorithm, data));
    }

    public static String calcToBase64(String algorithm, byte[] data) {
        return CodeUtil.b64encodeToString(calc(algorithm, data));
    }
}
