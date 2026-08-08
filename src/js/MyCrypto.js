export default {
    strToBytes: function (str) {
        return new TextEncoder().encode(str);
    },
    bytesToStr: function (bytes) {
        return new TextDecoder().decode(bytes);
    },
    bytesToBase64: function (bytes) {
        return btoa(String.fromCharCode(...bytes));
    },
    base64ToBytes: function (base64) {
        const binary = atob(base64);
        return Uint8Array.from([...binary].map(char => char.charCodeAt(0)));
    },
    encrypt: function (input) {
        const keyBytes = this.strToBytes(import.meta.env.MY_KEY);
        const inputBytes = this.strToBytes(input);
        const result = inputBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
        return this.bytesToBase64(result);
    },
    decrypt: function (base64Input) {
        const keyBytes = this.strToBytes(import.meta.env.MY_KEY);
        const inputBytes = this.base64ToBytes(base64Input);
        const result = inputBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
        return this.bytesToStr(result);
    }
}