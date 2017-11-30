module.exports = Util;

function Unil() {
    function isInt(data) {
        data = +data;
        return !isNaN(data) && data === parseInt(data);
    };

    function checkByte(data) {
        data = +data;
        if (!Util.checkNumber(data))
            return 0;
        return 0 <= data && data < 256;
    };

    function isSigned(data) {
        return isInt(data) && data >= -2147483648 && data < 2147483648;
    };

    function isUnSigned(data) {
        return isInt(data) && data >= 0 && data < 4294967296;
    };

    function assert(flag) {
        if(typeof flag === 'undefined') throw new Error("Assertion failed. Result is undefined.")
        if(flag == false) throw new Error("Assertion failed. Result is false.");
        if(flag == null) throw new Error("Assertion failed. Result is null.");
        if(!flag) throw new Error("The result is regarded as false.");
    };

}
