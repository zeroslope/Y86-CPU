import Constant from './constant';
import Memory from './memory';
import _ from './register';
import ALU from './alu';
import async from 'async'
import applyEach from 'async/applyEach'; 
import asyncify from 'async/asyncify';

var Register = _.Register;
var PIPERegister = _.PipeRegister;

export default CPU;

function clone(obj) {
    if (null == obj || "object" != typeof obj) {
        return obj;
    }
    var constructor = obj.constructor || obj.__proto__.constructor;
    var copy        = new constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            copy[attr] = obj[attr];
        }
    }
    return copy;
}

function saveHistory(cpu, cycle) {
    cpu.history[cycle] = {
        Memory: clone(cpu.Memory),
        Register: clone(cpu.Register),
        Input: clone(cpu.Input),
        Output: clone(cpu.Output),
        ALU: clone(cpu.ALU),
        cycle: cpu.cycle,
        instruction: cpu.instruction,
        state: cpu.state,
        halt: cpu.halt,
        mrmovl: cpu.mrmovl,
        popl: cpu.popl,
        ret: cpu.ret,
        cond: cpu.cond,
        mispredict: cpu.mispredict,
        use: cpu.use
    }
}

function returnHistory(cpu, cycle) {
    //console.log('CPU --> cycle: ' + cpu.cycle);
    cpu.Memory      = cpu.history[cycle].Memory;
    cpu.Register    = cpu.history[cycle].Register;
    cpu.Input       = cpu.history[cycle].Input;
    cpu.Output      = cpu.history[cycle].Output;
    cpu.ALU         = cpu.history[cycle].ALU;
    cpu.instruction = cpu.history[cycle].instruction;
    cpu.cycle       = cpu.history[cycle].cycle;
    cpu.state       = cpu.history[cycle].state;
    cpu.halt        = cpu.history[cycle].halt;
    cpu.mrmovl      = cpu.history[cycle].mrmovl;
    cpu.popl        = cpu.history[cycle].popl;
    cpu.cond        = cpu.history[cycle].cond;
    cpu.ret         = cpu.history[cycle].ret;
    cpu.use         = cpu.history[cycle].use;
    cpu.mispredict  = cpu.history[cycle].mispredict;
    //console.log('CPU --> cycle: ' + cpu.cycle);
}

function saveCPI (cpu, cycle, cpi) {
    cpu.cpi[cycle] = cpi;
}

function CPU() {
    /*input 表示当前周期始的流水线寄存器状态*/
    /*output 表示当前周期末的流水线寄存器状态*/
    this.Memory     = new Memory();
    this.Register   = new Register();
    this.Input      = new PIPERegister();
    this.Output     = new PIPERegister();
    this.ALU        = new ALU();

    this.history    = [];
    this.cpi        = [0];

    function init(cpu) {
        cpu.cycle = 0;
        cpu.instruction = 0;
        cpu.state = Constant.S_AOK;
        cpu.halt = false;
        cpu.mrmovl = 0;
        cpu.popl = 0;
        cpu.ret = 0;
        cpu.cond = 0;
        cpu.mispredict = 0;
        cpu.use = 0;

        saveHistory(cpu, 0);
    }

    init(this);

}

CPU.prototype.goto = function (dest) {
    if(dest < this.history.length) {
        returnHistory(this, dest);
    }
};

CPU.prototype.backward = function () {
    if(this.history[this.cycle - 1]) {
        returnHistory(this, this.cycle-1);
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
};

CPU.prototype.forward = function () {
    if(this.cycle + 1 < this.history.length) {
        returnHistory(this, this.cycle+1);
        return ;
    }

    var input = this.Input;
    var output = this.Output;

    if(input.W_icode === Constant.I_HALT) {
        this.state = Constant.S_HLT;
    }

    if(this.state !== Constant.S_AOK && this.state !== Constant.S_BUB) {
        throw new Error('State Error　' + this.state);
    }

    // async.applyEach([
    //     async.asyncify(this.writeBack()), 
    //     async.asyncify(this.memory()), 
    //     async.asyncify(this.execute()), 
    //     async.asyncify(this.fetch())
    //     ], 
    //     null, 
    //     this.decode())

    /*
        串行
    */
    // this.writeBack();
    // this.memory();
    // this.execute();
    // this.decode();
    // this.fetch();

    var that = this;

    // async.applyEach([
    //     async.asyncify(writeBack), 
    //     async.asyncify(memory), 
    //     async.asyncify(execute),
    //     async.asyncify(fetch)
    //     ], 
    //     that,
    //     function (err) {
    //         decode(that);
    //     }
    // )

    /*
    * 并行
    * 采用async的Control Flow
    * Run the `tasks` collection of functions in parallel, without waiting until
    * the previous function has completed. If any of the functions pass an error to
    * its callback, the main `callback` is immediately called with the value of the
    * error. Once the `tasks` have completed, the results are passed to the final
    * `callback` as an array.
    *
    * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
    * parallel execution of code.  If your tasks do not use any timers or perform
    * any I/O, they will actually be executed in series.  Any synchronous setup
    * sections for each task will happen one after the other.  JavaScript remains
    * single-threaded.
    *
    * **Hint:** Use [`reflect`]{@link module:Utils.reflect} to continue the
    * execution of other tasks when a task fails.
    *
    * It is also possible to use an object instead of an array. Each property will
    * be run as a function and the results will be passed to the final `callback`
    * as an object instead of an array. This can be a more readable way of handling
    * results from {@link async.parallel}.
    *
    * @name parallel
    * @static
    * @memberOf module:ControlFlow
    * @method
    * @category Control Flow
    * @param {Array|Iterable|Object} tasks - A collection of
    * [async functions]{@link AsyncFunction} to run.
    * Each async function can complete with any number of optional `result` values.
    * @param {Function} [callback] - An optional callback to run once all the
    * functions have completed successfully. This function gets a results array
    * (or object) containing all the result arguments passed to the task callbacks.
    * Invoked with (err, results).
    *
    * @example
    * async.parallel([
    *     function(callback) {
    *         setTimeout(function() {
    *             callback(null, 'one');
    *         }, 200);
    *     },
    *     function(callback) {
    *         setTimeout(function() {
    *             callback(null, 'two');
    *         }, 100);
    *     }
    * ],
    * // optional callback
    * function(err, results) {
    *     // the results array will equal ['one','two'] even though
    *     // the second function had a shorter timeout.
    * });
    *
    * // an example using an object instead of an array
    * async.parallel({
    *     one: function(callback) {
    *         setTimeout(function() {
    *             callback(null, 1);
    *         }, 200);
    *     },
    *     two: function(callback) {
    *         setTimeout(function() {
    *             callback(null, 2);
    *         }, 100);
    *     }
    * }, function(err, results) {
    *     // results is now equals to: {one: 1, two: 2}
    * });
    */

    console.log('--------------------------');

    async.parallel([
        async.asyncify(async function f1() {
            await sleep(Math.random() * 200);
            writeBack(that);
        }),
        async.asyncify(async function f2() {
            await sleep(Math.random() * 200);
            memory(that);
        }),
        async.asyncify(async function f3() {
            await sleep(Math.random() * 200);
            execute(that);
        }),
        async.asyncify(async function f4() {
            await sleep(Math.random() * 200);
            fetch(that);
        }),
    ], function(err, res) {
        decode(that);
    })

    console.log('--------------------------');

    // console.log('input');
    // for(var name in input) {
    //     if(input.hasOwnProperty(name) && typeof(input[name]) !== 'function') {
    //         console.log(name, input[name]);
    //     }
    // }

    // console.log('\noutput');
    // for(var name in output) {
    //     if(output.hasOwnProperty(name) && typeof(output[name]) !== 'function') {
    //         console.log(name, output[name]);
    //     }
    // }

    this.cycle ++;

    if(this.state !== Constant.S_BUB) {
        this.instruction ++;
    }

    this.pipelineControl();

    saveCPI(this, this.cycle, this.updateCPI());
    saveHistory(this, this.cycle);
};

CPU.prototype.updateCPI = function () {
    var lp = (this.mrmovl + this.popl) * this.use;
    var mp = this.cond * this.mispredict;
    var rp = this.ret;

    if (!this.instruction)
        lp = mp = rp = 0;
    if (!this.mrmovl && !this.popl)
        lp = 0;
    if (!this.cond)
        mp = 0;

    if (lp)
        lp /= this.instruction * (this.mrmovl + this.popl);
    if (mp)
        mp /= this.instruction * this.cond;
    if (rp)
        rp /= this.instruction;

    return lp + mp * 2 + rp * 3 + 1;
};
/*
##### Intermediate Values in Fetch Stage ###########################
intsig imem_icode ’imem_icode’ # icode field from instruction memory
intsig imem_ifun ’imem_ifun’ # ifun field from instruction memory
intsig f_icode ’if_id_next->icode’ # (Possibly modified) instruction code
intsig f_ifun ’if_id_next->ifun’ # Fetched instruction function
intsig f_valC ’if_id_next->valc’ # Constant data of fetched instruction
intsig f_valP ’if_id_next->valp’ # Address of following instruction
boolsig imem_error ’imem_error’ # Error signal from instruction memory
boolsig instr_valid ’instr_valid’ # Is fetched instruction valid?
 */
// CPU.prototype.fetch = function () {
//     if(this.halt) return;

//     var input = this.Input;
//     var output = this.Output;

//     var nextPC;
//     if(input.M_icode == Constant.I_JXX && !input.M_Cnd) {
//         nextPC = input.M_valA;
//         //条件跳转不成立
//     } else if(input.W_icode == Constant.I_RET) {
//         nextPC = input.W_valM;
//     } else {
//         nextPC = input.F_predPC;
//     }

//     var byte0 = this.Memory.readByte(nextPC ++);
//     output.D_icode  = byte0 >> 4;
//     output.D_ifun   = byte0 & 15;

//     /* INSTRUCTION内部都是字符串，而不是对应的指令序号*/
//     if( [Constant.I_NOP,Constant.I_HALT,Constant.I_RRMOVL,Constant.I_IRMOVL,Constant.I_RMMOVL,Constant.I_MRMOVL,Constant.I_OPL,Constant.I_JXX,Constant.I_CALL,Constant.I_RET,Constant.I_PUSHL,Constant.I_POPL].indexOf(output.D_icode) == -1 ) {
//         output.D_stat = output.F_stat = Constant.S_INS;
//         return ;
//     } else if( output.D_icode == Constant.I_HALT) {
//         output.D_stat = output.F_stat = Constant.S_HLT;
//         return ;
//     } else {
//         output.D_stat = output.F_stat = Constant.S_AOK;
//     }

//     /* D_icode 忘记加　output... */
//     //var need_regids = ;
//     //Constant.I_POPL 写成 Constant.IPOPL
//     if([Constant.I_RRMOVL,Constant.I_IRMOVL,Constant.I_RMMOVL,Constant.I_MRMOVL,Constant.I_OPL,Constant.I_PUSHL,Constant.I_POPL].indexOf(output.D_icode) !== -1) {
//         var byte1   = this.Memory.readByte(nextPC ++);
//         output.D_rA = byte1 >> 4;
//         output.D_rB = byte1 & 15;
//     } else {
//         output.D_rA = output.D_rB = Constant.R_NONE;
//     }

//     if([Constant.I_IRMOVL,Constant.I_RMMOVL,Constant.I_MRMOVL,Constant.I_JXX,Constant.I_CALL].indexOf(output.D_icode) !== -1) {
//         output.D_valC = this.Memory.readInt(nextPC);
//         nextPC += 4;
//     }

//     output.F_predPC = nextPC;
//     if([Constant.I_JXX, Constant.I_CALL].indexOf(output.D_icode) !== -1) {
//         output.F_predPC = output.D_valC;
//     }
//     output.D_valP = nextPC;
// };

// CPU.prototype.decode = function () {
//     var input = this.Input;
//     var output = this.Output;

//     //output.E_stat   = input.D_ifun; 我怕是个傻子
//     output.E_stat   = input.D_stat;
//     output.E_icode  = input.D_icode;
//     output.E_ifun   = input.D_ifun;
//     output.E_valC   = input.D_valC;

//     /*output.E_srcA*/
//     if([Constant.I_RRMOVL,Constant.I_RMMOVL,Constant.I_OPL,Constant.I_PUSHL].indexOf(input.D_icode) !== -1) {
//         output.E_srcA = input.D_rA;
//     } else if([Constant.I_POPL,Constant.I_RET].indexOf(input.D_icode) !== -1) {
//         output.E_srcA = Constant.R_ESP;
//     } else {
//         output.E_srcA = Constant.R_NONE;
//     }

//     /*output.E_srcB ? I_IADDL */
//     if([Constant.I_MRMOVL,Constant.I_OPL,Constant.I_IRMOVL].indexOf(input.D_icode) !== -1) {
//         output.E_srcB = input.D_rB;
//     } else if([Constant.I_POPL,Constant.I_PUSHL,Constant.I_CALL,Constant.I_RET].indexOf(input.D_icode) !== -1) {
//         output.E_srcB = Constant.R_ESP;
//     } else {
//         output.E_srcB = Constant.R_NONE;
//     }

//     /* output.E_dstE */
//     if([Constant.I_RRMOVL,Constant.I_IRMOVL,Constant.I_OPL].indexOf(input.D_icode) !== -1) {
//         output.E_dstE = input.D_rB;
//     } else if([Constant.I_PUSHL,Constant.I_POPL,Constant.I_RET,Constant.I_CALL].indexOf(input.D_icode) !== -1) {
//         output.E_dstE = Constant.R_ESP;
//     } else {
//         output.E_dstE = Constant.R_NONE;
//     }

//     /* output.E_dstM 需要注意mrmovel的输入的寄存器的顺序*/
//     if([Constant.I_MRMOVL,Constant.I_POPL].indexOf(input.D_icode) !== -1) {
//         output.E_dstM = input.D_rA;
//     } else {
//         output.E_dstM = Constant.R_NONE;
//     }

//     //E_srcA 写成了　D_srcA
//     if([Constant.I_CALL,Constant.I_JXX].indexOf(input.D_icode) !== -1) {
//         output.E_valA = input.D_valP;
//     } else if(output.E_srcA === output.M_dstE) {
//         output.E_valA = output.M_valE;
//     } else if(output.E_srcA === input.M_dstM) {
//         output.E_valA = output.W_valM;
//     } else if(output.E_srcA === input.M_dstE) {
//         output.E_valA = input.M_valE;
//     } else if(output.E_srcA === input.W_dstM) {
//         output.E_valA = input.W_valM;
//     } else if(output.E_srcA === input.W_dstE) {
//         output.E_valA = input.W_valE;
//     } else {
//         output.E_valA = this.Register.get(output.E_srcA);
//     }

//     if (output.E_srcB == output.M_dstE) {
//         output.E_valB = output.M_valE;
//     } else if (output.E_srcB == input.M_dstM) {
//         output.E_valB = output.W_valM;
//     } else if (output.E_srcB == input.M_dstE) {
//         output.E_valB = input.M_valE;
//     } else if (output.E_srcB == input.W_dstM) {
//         output.E_valB = input.W_valM;
//     } else if (output.E_srcB == input.W_dstE) {
//         output.E_valB = input.W_valE;
//     } else {
//         output.E_valB = this.Register.get(output.E_srcB);
//     }

// };


// CPU.prototype.execute = function() {

//     var input   = this.Input;
//     var output  = this.Output;
//     var alu     = this.ALU;

//     output.M_stat  = input.E_stat;
//     output.M_icode = input.E_icode;
//     output.M_valA  = input.E_valA;
//     output.M_dstM  = input.E_dstM;

//     if (input.E_icode == Constant.I_MRMOVL) {
//         this.mrmovl ++;
//     }
//     if (input.E_icode == Constant.I_POPL) {
//         this.popl ++;
//     }
//     if (input.E_icode == Constant.I_JXX) {
//         this.cond ++;
//     }
//     if (input.E_icode == Constant.I_RET) {
//         this.ret ++;
//     }

//     if(input.E_icode === Constant.I_HALT && input.E_stat !== Constant.S_BUB) {
//         this.halt = true;
//         output.M_stat = Constant.S_HLT;
//     }

//     /* aluA*/
//     if([Constant.I_RRMOVL,Constant.I_OPL].indexOf(input.E_icode) !== -1) {
//         alu.config.setInA(input.E_valA);
//     } else if([Constant.I_IRMOVL,Constant.I_RMMOVL,Constant.I_MRMOVL].indexOf(input.E_icode) !== -1) {
//         alu.config.setInA(input.E_valC);
//     } else if([Constant.I_CALL,Constant.I_PUSHL].indexOf(input.E_icode) !== -1) {
//         alu.config.setInA(-4);
//         // 把　input.E_icode 写成了　input.D_icode 反思
//     } else if([Constant.I_RET,Constant.I_POPL].indexOf(input.E_icode) !== -1) {
//         alu.config.setInA( 4);
//     } else {
//         alu.config.setInA( 0);
//     }

//     /* aluB */
//     if([Constant.I_OPL,Constant.I_RMMOVL,Constant.I_MRMOVL,Constant.I_CALL,Constant.I_PUSHL,Constant.I_RET,Constant.I_POPL].indexOf(input.E_icode) !== -1) {
//         alu.config.setInB(input.E_valB);
//     } else {
//         alu.config.setInB(0);
//     }
//     //else ???

//     /*alu-FCode 默认为加法*/
//     if(input.E_icode === Constant.I_OPL) {
//         alu.config.setFCode(input.E_ifun);
//     } else {
//         alu.config.setFCode(0);
//     }

//     /* alu-update I_IADDL m_stat = output.W_stat*/
//     if ([Constant.I_OPL].indexOf(input.E_icode) !== -1 && [Constant.S_ADR, Constant.S_INS, Constant.S_HLT].indexOf(output.W_stat) === -1 && [Constant.S_ADR, Constant.S_INS, Constant.S_HLT].indexOf(input.W_stat) === -1) {
//         alu.config.setUpdate(1);
//     } else {
//         alu.config.setUpdate(0);
//     }

//     output.M_valE   = alu.execute();
//     output.M_Cnd    = alu.condition(input.E_ifun);
//     /* ? */
//     output.M_valA   = input.E_valA;

//     /* ? */
//     if(input.E_icode === Constant.I_RRMOVL && !output.M_Cnd) {
//         output.M_dstE = Constant.R_NONE;
//     } else {
//         output.M_dstE = input.E_dstE;
//     }
// };


// CPU.prototype.memory = function () {

//     var input  = this.Input;
//     var output = this.Output;

//     var readMem = false, writeMem = false, mAddr = 0;

//     output.W_stat = input.M_stat;
//     output.W_icode = input.M_icode;
//     output.W_valE  = input.M_valE;
//     output.W_dstE  = input.M_dstE;
//     output.W_dstM  = input.M_dstM;

//     if ([Constant.I_RMMOVL, Constant.I_PUSHL, Constant.I_CALL, Constant.I_MRMOVL].indexOf(input.M_icode) !== -1) {
//         mAddr = input.M_valE;
//     } else if ([Constant.I_POPL, Constant.I_RET].indexOf(input.M_icode) !== -1) {
//         mAddr = input.M_valA;
//     }

//     if([Constant.I_MRMOVL,Constant.I_POPL,Constant.I_RET].indexOf(input.M_icode) !== -1) {
//         readMem = true;
//     }

//     if([Constant.I_RMMOVL,Constant.I_PUSHL,Constant.I_CALL].indexOf(input.M_icode) !== -1) {
//         writeMem = true;
//     }

//     if(readMem) {
//         output.W_valM = this.Memory.readInt(mAddr);
//     }
//     /* 内存地址非法的判断 */
//     if(writeMem) {
//         this.Memory.writeInt(mAddr, input.M_valA);
//     }
// };

// CPU.prototype.writeBack = function () {

//     var input = this.Input;

//     this.state = input.W_stat;
//     if(input.W_icode === Constant.I_RMMOVL) {
//         return ;
//     }

//     this.Register.set(input.W_dstE, input.W_valE);
//     this.Register.set(input.W_dstM, input.W_valM);
// };

var fetch = function (CPU) {
    console.log('fetch');
    if(CPU.halt) return;

    var input = CPU.Input;
    var output = CPU.Output;

    var nextPC;
    if(input.M_icode == Constant.I_JXX && !input.M_Cnd) {
        nextPC = input.M_valA;
        //条件跳转不成立
    } else if(input.W_icode == Constant.I_RET) {
        nextPC = input.W_valM;
    } else {
        nextPC = input.F_predPC;
    }

    var byte0 = CPU.Memory.readByte(nextPC ++);
    output.D_icode  = byte0 >> 4;
    output.D_ifun   = byte0 & 15;

    /* INSTRUCTION内部都是字符串，而不是对应的指令序号*/
    if( [Constant.I_NOP,Constant.I_HALT,Constant.I_RRMOVL,Constant.I_IRMOVL,Constant.I_RMMOVL,Constant.I_MRMOVL,Constant.I_OPL,Constant.I_JXX,Constant.I_CALL,Constant.I_RET,Constant.I_PUSHL,Constant.I_POPL].indexOf(output.D_icode) == -1 ) {
        output.D_stat = output.F_stat = Constant.S_INS;
        return ;
    } else if( output.D_icode == Constant.I_HALT) {
        output.D_stat = output.F_stat = Constant.S_HLT;
        return ;
    } else {
        output.D_stat = output.F_stat = Constant.S_AOK;
    }

    /* D_icode 忘记加　output... */
    //var need_regids = ;
    //Constant.I_POPL 写成 Constant.IPOPL
    if([Constant.I_RRMOVL,Constant.I_IRMOVL,Constant.I_RMMOVL,Constant.I_MRMOVL,Constant.I_OPL,Constant.I_PUSHL,Constant.I_POPL].indexOf(output.D_icode) !== -1) {
        var byte1   = CPU.Memory.readByte(nextPC ++);
        output.D_rA = byte1 >> 4;
        output.D_rB = byte1 & 15;
    } else {
        output.D_rA = output.D_rB = Constant.R_NONE;
    }

    if([Constant.I_IRMOVL,Constant.I_RMMOVL,Constant.I_MRMOVL,Constant.I_JXX,Constant.I_CALL].indexOf(output.D_icode) !== -1) {
        output.D_valC = CPU.Memory.readInt(nextPC);
        nextPC += 4;
    }

    output.F_predPC = nextPC;
    if([Constant.I_JXX, Constant.I_CALL].indexOf(output.D_icode) !== -1) {
        output.F_predPC = output.D_valC;
    }
    output.D_valP = nextPC;
};

var decode = function (CPU) {
    console.log('decode');
    var input = CPU.Input;
    var output = CPU.Output;

    //output.E_stat   = input.D_ifun; 我怕是个傻子
    output.E_stat   = input.D_stat;
    output.E_icode  = input.D_icode;
    output.E_ifun   = input.D_ifun;
    output.E_valC   = input.D_valC;

    /*output.E_srcA*/
    if([Constant.I_RRMOVL,Constant.I_RMMOVL,Constant.I_OPL,Constant.I_PUSHL].indexOf(input.D_icode) !== -1) {
        output.E_srcA = input.D_rA;
    } else if([Constant.I_POPL,Constant.I_RET].indexOf(input.D_icode) !== -1) {
        output.E_srcA = Constant.R_ESP;
    } else {
        output.E_srcA = Constant.R_NONE;
    }

    /*output.E_srcB ? I_IADDL */
    if([Constant.I_MRMOVL,Constant.I_OPL,Constant.I_IRMOVL].indexOf(input.D_icode) !== -1) {
        output.E_srcB = input.D_rB;
    } else if([Constant.I_POPL,Constant.I_PUSHL,Constant.I_CALL,Constant.I_RET].indexOf(input.D_icode) !== -1) {
        output.E_srcB = Constant.R_ESP;
    } else {
        output.E_srcB = Constant.R_NONE;
    }

    /* output.E_dstE */
    if([Constant.I_RRMOVL,Constant.I_IRMOVL,Constant.I_OPL].indexOf(input.D_icode) !== -1) {
        output.E_dstE = input.D_rB;
    } else if([Constant.I_PUSHL,Constant.I_POPL,Constant.I_RET,Constant.I_CALL].indexOf(input.D_icode) !== -1) {
        output.E_dstE = Constant.R_ESP;
    } else {
        output.E_dstE = Constant.R_NONE;
    }

    /* output.E_dstM 需要注意mrmovel的输入的寄存器的顺序*/
    if([Constant.I_MRMOVL,Constant.I_POPL].indexOf(input.D_icode) !== -1) {
        output.E_dstM = input.D_rA;
    } else {
        output.E_dstM = Constant.R_NONE;
    }

    //E_srcA 写成了　D_srcA
    if([Constant.I_CALL,Constant.I_JXX].indexOf(input.D_icode) !== -1) {
        output.E_valA = input.D_valP;
    } else if(output.E_srcA === output.M_dstE) {
        output.E_valA = output.M_valE;
    } else if(output.E_srcA === input.M_dstM) {
        output.E_valA = output.W_valM;
    } else if(output.E_srcA === input.M_dstE) {
        output.E_valA = input.M_valE;
    } else if(output.E_srcA === input.W_dstM) {
        output.E_valA = input.W_valM;
    } else if(output.E_srcA === input.W_dstE) {
        output.E_valA = input.W_valE;
    } else {
        output.E_valA = CPU.Register.get(output.E_srcA);
    }

    if (output.E_srcB == output.M_dstE) {
        output.E_valB = output.M_valE;
    } else if (output.E_srcB == input.M_dstM) {
        output.E_valB = output.W_valM;
    } else if (output.E_srcB == input.M_dstE) {
        output.E_valB = input.M_valE;
    } else if (output.E_srcB == input.W_dstM) {
        output.E_valB = input.W_valM;
    } else if (output.E_srcB == input.W_dstE) {
        output.E_valB = input.W_valE;
    } else {
        output.E_valB = CPU.Register.get(output.E_srcB);
    }

};



var execute = function(CPU) {
    console.log('execute');
    var input   = CPU.Input;
    var output  = CPU.Output;
    var alu     = CPU.ALU;

    output.M_stat  = input.E_stat;
    output.M_icode = input.E_icode;
    output.M_valA  = input.E_valA;
    output.M_dstM  = input.E_dstM;

    if (input.E_icode == Constant.I_MRMOVL) {
        CPU.mrmovl ++;
    }
    if (input.E_icode == Constant.I_POPL) {
        CPU.popl ++;
    }
    if (input.E_icode == Constant.I_JXX) {
        CPU.cond ++;
    }
    if (input.E_icode == Constant.I_RET) {
        CPU.ret ++;
    }

    if(input.E_icode === Constant.I_HALT && input.E_stat !== Constant.S_BUB) {
        CPU.halt = true;
        output.M_stat = Constant.S_HLT;
    }

    /* aluA*/
    if([Constant.I_RRMOVL,Constant.I_OPL].indexOf(input.E_icode) !== -1) {
        alu.config.setInA(input.E_valA);
    } else if([Constant.I_IRMOVL,Constant.I_RMMOVL,Constant.I_MRMOVL].indexOf(input.E_icode) !== -1) {
        alu.config.setInA(input.E_valC);
    } else if([Constant.I_CALL,Constant.I_PUSHL].indexOf(input.E_icode) !== -1) {
        alu.config.setInA(-4);
        // 把　input.E_icode 写成了　input.D_icode 反思
    } else if([Constant.I_RET,Constant.I_POPL].indexOf(input.E_icode) !== -1) {
        alu.config.setInA( 4);
    } else {
        alu.config.setInA( 0);
    }

    /* aluB */
    if([Constant.I_OPL,Constant.I_RMMOVL,Constant.I_MRMOVL,Constant.I_CALL,Constant.I_PUSHL,Constant.I_RET,Constant.I_POPL].indexOf(input.E_icode) !== -1) {
        alu.config.setInB(input.E_valB);
    } else {
        alu.config.setInB(0);
    }
    //else ???

    /*alu-FCode 默认为加法*/
    if(input.E_icode === Constant.I_OPL) {
        alu.config.setFCode(input.E_ifun);
    } else {
        alu.config.setFCode(0);
    }

    /* alu-update I_IADDL m_stat = output.W_stat*/
    if ([Constant.I_OPL].indexOf(input.E_icode) !== -1 && [Constant.S_ADR, Constant.S_INS, Constant.S_HLT].indexOf(output.W_stat) === -1 && [Constant.S_ADR, Constant.S_INS, Constant.S_HLT].indexOf(input.W_stat) === -1) {
        alu.config.setUpdate(1);
    } else {
        alu.config.setUpdate(0);
    }

    output.M_valE   = alu.execute();
    output.M_Cnd    = alu.condition(input.E_ifun);
    /* ? */
    output.M_valA   = input.E_valA;

    /* ? */
    if(input.E_icode === Constant.I_RRMOVL && !output.M_Cnd) {
        output.M_dstE = Constant.R_NONE;
    } else {
        output.M_dstE = input.E_dstE;
    }
};


var memory = function (CPU) {
    console.log('memory');
    var input  = CPU.Input;
    var output = CPU.Output;

    var readMem = false, writeMem = false, mAddr = 0;

    output.W_stat = input.M_stat;
    output.W_icode = input.M_icode;
    output.W_valE  = input.M_valE;
    output.W_dstE  = input.M_dstE;
    output.W_dstM  = input.M_dstM;

    if ([Constant.I_RMMOVL, Constant.I_PUSHL, Constant.I_CALL, Constant.I_MRMOVL].indexOf(input.M_icode) !== -1) {
        mAddr = input.M_valE;
    } else if ([Constant.I_POPL, Constant.I_RET].indexOf(input.M_icode) !== -1) {
        mAddr = input.M_valA;
    }

    if([Constant.I_MRMOVL,Constant.I_POPL,Constant.I_RET].indexOf(input.M_icode) !== -1) {
        readMem = true;
    }

    if([Constant.I_RMMOVL,Constant.I_PUSHL,Constant.I_CALL].indexOf(input.M_icode) !== -1) {
        writeMem = true;
    }

    if(readMem) {
        output.W_valM = CPU.Memory.readInt(mAddr);
    }
    /* 内存地址非法的判断 */
    if(writeMem) {
        CPU.Memory.writeInt(mAddr, input.M_valA);
    }
};

var writeBack = function (CPU) {
    console.log('writeBack');
    var input = CPU.Input;

    CPU.state = input.W_stat;
    if(input.W_icode === Constant.I_RMMOVL) {
        return ;
    }

    CPU.Register.set(input.W_dstE, input.W_valE);
    CPU.Register.set(input.W_dstM, input.W_valM);
};


CPU.prototype.pipelineControl = function () {
    var input   = this.Input;
    var output  = this.Output;

    var F_bubble = 0;
    var F_stall = (([Constant.I_MRMOVL,Constant.I_POPL].indexOf(input.E_icode) !== -1) && ([output.E_srcA,output.E_srcB].indexOf(input.E_dstM) !== -1) ) || ([input.D_icode,input.E_icode,input.M_icode].indexOf(Constant.I_RET) !== -1);

    var D_stall = (([Constant.I_MRMOVL,Constant.I_POPL].indexOf(input.E_icode) !== -1) && ([output.E_srcA,output.E_srcB].indexOf(input.E_dstM) !== -1) );
    var D_bubble = (input.E_icode === Constant.I_JXX && !output.M_Cnd) || ((!D_stall) && ! ([input.D_icode,input.E_icode,input.M_icode].indexOf(Constant.I_RET)));

    var E_stall = 0;
    var E_bubble = (input.E_icode === Constant.I_JXX && !output.M_Cnd) || (([Constant.I_MRMOVL, Constant.I_POPL].indexOf(input.E_icode) !== -1 && [output.E_srcA, output.E_srcB].indexOf(input.E_dstM) !== -1));

    var M_bubble = [Constant.S_ADR, Constant.S_INS,Constant.S_HLT].indexOf(output.W_stat) != -1 || [Constant.S_ADR, Constant.S_INS,Constant.S_HLT].indexOf(input.W_stat) !== -1;

    if (([Constant.I_MRMOVL, Constant.I_POPL].indexOf(input.E_icode) != -1) && (input.E_dstM == input.E_srcA || input.E_dstM == input.E_srcB)) {
        this.use++;
    }

    if (input.E_icode == Constant.I_JXX && !input.M_Cnd) {
        this.mispredict++;
    }

    var reg = new PIPERegister();
    for(var name in output) {
        if(output.hasOwnProperty(name)) {
            reg.set(name, output[name]);
        }
    }

    if(M_bubble) {
        reg.set({
            M_icode:    Constant.I_NOP,
            M_stat:     Constant.S_BUB,
            M_dstE:     Constant.R_NONE,
            M_dstM:     Constant.R_NONE,
            M_Cnd:      false
        });
    }

    if(E_bubble) {
        reg.set({
            E_icode:    Constant.I_NOP,
            E_ifun:     0,
            E_stat:     Constant.S_BUB,
            E_srcA:     Constant.R_NONE,
            E_srcB:     Constant.R_NONE,
            E_dstE:     Constant.R_NONE,
            E_dstM:     Constant.R_NONE
        });
    }

    if(D_stall) {
        reg.set({
            D_icode:    input.D_icode,
            D_ifun:     input.D_ifun,
            D_rA:       input.D_rA,
            D_rB:       input.D_rB,
            D_valC:     input.D_valC,
            D_valP:     input.D_valP
        });
    }

    if(D_bubble) {
        reg.set({
            D_icode:    Constant.I_NOP,
            D_ifun:     0,
            D_stat:     Constant.S_BUB
        })
    }

    if(F_stall) {
        reg.set('F_predPC', input.F_predPC);
    }

    /* 又搞错了大小写…… */
    this.Input = reg;
};
