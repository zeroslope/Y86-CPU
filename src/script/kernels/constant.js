export default {

    STATE: [
        'S_BUB',
        'S_AOK',
        'S_HLT',
        'S_ADR',
        'S_INS',
        'S_PIP'
    ],

    INSTRUCTION: [
        'I_NOP',
        'I_HALT',
        'I_RRMOVL',
        'I_IRMOVL',
        'I_RMMOVL',
        'I_MRMOVL',
        'I_OPL',
        'I_JXX',
        'I_CALL',
        'I_RET',
        'I_PUSHL',
        'I_POPL',
        'I_IADDL'
    ],

    REGISTERS: [
        'R_EAX',
        'R_ECX',
        'R_EDX',
        'R_EBX',
        'R_ESP',
        'R_EBP',
        'R_ESI',
        'R_EDI'
    ],

    P_LOAD:   0,
    P_STALL:  1,
    P_BUBBLE: 2,
    P_ERROR:  3,

    /*指令集*/
    I_NOP:      0,
    I_HALT:     1,
    I_RRMOVL:   2,
    I_IRMOVL:   3,
    I_RMMOVL:   4,
    I_MRMOVL:   5,
    I_OPL:      6,
    I_JXX:      7,
    I_CALL:     8,
    I_RET:      9,
    I_PUSHL:    0xa,
    I_POPL:     0xb,
    I_IADDL:    0xc,

    /*整数操作指令*/
    A_ADD:  0,
    A_SUB:  1,
    A_AND:  2,
    A_XOR:  3,
    A_NONE: 4,

    /*Condition*/
    F_OF: 1, // OF at bit 0
    F_SF: 2, // SF at bit 1
    F_ZF: 4, // ZF at bit 2

    /*分支指令*/
    C_TRUE: 0,
    C_LE:   1,
    C_L:    2,
    C_E:    3,
    C_NE:   4,
    C_GE:   5,
    C_G:    6,

    /**
     * Bubble
     * 正常操作
     * 处理器执行halt指令
     * 遇到非法地址
     * 遇到非法指令
     */
    S_BUB: 0,
    S_AOK: 1,
    S_HLT: 2,
    S_ADR: 3,
    S_INS: 4,
    S_PIP: 5,

    /*Register Name*/
    R_EAX: 0,
    R_ECX: 1,
    R_EDX: 2,
    R_EBX: 3,
    R_ESP: 4,
    R_EBP: 5,
    R_ESI: 6,
    R_EDI: 7,
    R_NONE: 0xf
};
