export default Util;

Util();
function Util() {
    Util.isInt = function (data) {
        data = +data;
        return !isNaN(data) && data === parseInt(data);
    };
    Util.checkByte = function (data) {
        data = +data;
        if (!Util.isInt(data))
            return 0;
        return 0 <= data && data < 256;
    };
    Util.isSigned = function (data) {
        return isInt(data) && data >= -2147483648 && data < 2147483648;
    };
    Util.isUnSigned = function (data) {
        return isInt(data) && data >= 0 && data < 4294967296;
    };
    Util.assert = function (flag) {
        if (typeof flag === 'undefined')
            throw new Error("Assertion failed. Result is undefined.");
        if (flag == false)
            throw new Error("Assertion failed. Result is false.");
        if (flag == null)
            throw new Error("Assertion failed. Result is null.");
        if (!flag)
            throw new Error("The result is regarded as false.");
    };
}

