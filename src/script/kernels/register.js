import Constant from './constant';

import Utils from './utils';

export default {
    Register:       Register,
    PipeRegister:   PipeRegister
};

function Register() {

    function init(register) {
        Constant.REGISTERS.forEach(function (name) {
            register[Constant[name]] = 0;
        });
    }

    init(this);

    this.get = function (name) {
        if (!Utils.isInt(name)) {
            if (typeof this[Constant[name]] === 'undefined') {
                throw new Error('Register error undefined name: ' + name);
            }
            return this[Constant[name]];
        }
        return this[name];
    }

    this.set = function (name, value) {
        if (!Utils.isInt(name)) {
            if (typeof Constant[name] !== 'undefined' && name !== 'R_NONE') {
                this[Constant[name]] = value;
            } else {
                return false;
            }
        }
        if (!(0 <= name && name < 8))
            return false;
        this[name] = value;
        return true;
    };
}

function PipeRegister() {
    this.F_predPC = 0;
    this.F_stat   = Constant.S_AOK,

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

    this.get = function (name) {
        if (typeof this[name] === 'undefined') {
            throw new Error('Register error undefined name: ' + name);
        }
        return this[name];
    };

    this.set = function (name, value) {
        if (typeof name == 'object') {
            for (var key in name) {
                if (name.hasOwnProperty(key)) {
                    if (Utils.isInt(name[key])) {
                        this[key] = name[key];
                    }
                }
            }
        } else {
            if (!Utils.isInt(value)) {
                return false;
            }
            this[name] = value;
        }
        return true;
    };
}
