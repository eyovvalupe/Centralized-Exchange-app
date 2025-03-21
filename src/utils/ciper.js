class SimpleCipher {
    constructor() {
    }
    // 加密方法
    encrypt(plainText) {
        if (!plainText) return ''
        // console.error('加密', plainText, btoa(plainText))
        return btoa(plainText);
    }
    // 解密方法
    decrypt(cipherText) {
        if (!cipherText) return ''
        // console.error('解密', cipherText, atob(cipherText))
        return atob(cipherText);
    }
}

// 使用示例
export default new SimpleCipher(); // 使用位移3进行加密