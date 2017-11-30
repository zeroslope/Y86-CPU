var Constant = require('./constant');
var Util = require('./utils')

moudle.exports = {
    Register:       Register,
    PipeRegister:   PipeRegister
};

function PipeRegister() {
    this.F_predPc = 0;

    this.D_stat  = Constant.S_BUB;
    this.D_icode = Constant.I_NOP;
    this.D_ifun  = 0;
    this.D_rA    = Constant.R_NONE;
    this.D_rB    = Constant.R_NONE;
    this.D_valC  = 0;
    this.D_valP  = 0;

    this.E_stat  = Constant.S_BUB;
    this.E_icode = Constant.I_NOP;
    this.E_ifun  = 0;
    this.E_valC  = 0;
    this.E_valA  = 0;
    this.E_valB  = 0;
    this.E_dstE  = Constant.R_NONE;
    this.E_dstM  = Constant.R_NONE;
    this.E_srcA  = Constant.R_NONE;
    this.E_srcB  = Constant.R_NONE;

    this.M_stat  = Constant.S_BUB;
    this.M_icode = Constant.I_NOP;
    this.M_Cnd   = false;
    this.M_valE  = 0;
    this.M_valA  = 0;
    this.M_dstE  = Constant.R_NONE;
    this.M_dstM  = Constant.R_NONE;

    this.W_stat  = Constant.S_BUB;
    this.W_icode = Constant.I_NOP;
    this.W_valE  = 0;
    this.W_valM  = 0;
    this.W_dstE  = Constant.R_NONE;
    this.W_dstM  = Constant.R_NONE;

    this.get = function(name) {
        if(typeof name === 'undefined') {
            throw new Error('Register error undefined name: ' + name);
        }
        return this[name];
    }

    this.set = function(name, value) {
        if(typeof name === 'object') {
            /*修改多个寄存器的值*/
            for(key in name) {
                if(name.hasOwnProperty(key)) {
                    if(Util.isInt(name[key])) {
                        this[key] = name[key];
                    }
                }
            }
        } else {
            /*修改单个寄存器的值*/
            assert(!Util.isInt(value));
            this[name] = value;
        }
    };
};

function Register() {
    /*初始化寄存器*/
    this.R_EAX = 0;
    this.R_ECX = 0;
    this.R_EDX = 0;
    this.R_EBX = 0;
    this.R_ESP = 0;
    this.R_EBP = 0;
    this.R_ESI = 0;
    this.R_EDI = 0;

    /*Register不存在返回０*/
    this.get = function (id) {
        if(typeof id === 'undefined') {
            return 0;
        }
        if(id >= 0 && id < Constant[REGISTERS].length) {
            return this[Constant[REGISTERS][id]];
        }
        return 0;
    };

    this.set = function (id, value) {
        assert(Util.isInt(id));
        if(id == Constant.R_NONE) return ;
        assert(id >= 0 && id < Constant[REGISTERS].length);
        this[Constant[REGISTERS][id]] = value;
    };

};
