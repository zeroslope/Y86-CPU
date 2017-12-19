import Constant from './constant';
import CPU from './cpu';

export default Parser;

function Parser(text) {
    if (typeof text !== 'string' && !(text instanceof String)) {
        throw new Error('Type error at `new Parser`');
    }

    function init(parser) {
        parser.raw     = text;
        parser.syntaxs = [];
        parser.map     = {};
        parser.lines   = [];
        parser.regLine = /^\s*0[xX]([0-9a-fA-F]+)\s*:\s*([0-9a-fA-F]*)\s*\|.*$/;

        parser.Constant = Constant;
        parser.CPU      = new CPU();

        text = text.replace(/\r\n/g, '\n'); 
        text = text.replace(/\r/g, '\n');

        text.split('\n').forEach(function (rawLine, index) {
            parser.syntaxs.push(rawLine);
            //console.log(rawLine);
            //console.log(index);
            var parts = rawLine.match(parser.regLine);
            //console.log(parts);
            if (parts != null) {
                if (parts[2].length % 2) {
                    throw new Error('Address error at `Parse init`: ' + (index + 1));
                }

                try {
                    var address     = parseInt(parts[1], 16);
                    var instruction = parts[2];
                    //console.log('address + ' + address);
                    //console.log('instruction + ' + instruction);
                    parser.map[address] = index;
                    storeInstruction(parser, address, instruction);
                } catch (err) {
                    throw new Error('Format error at `Parse init`: ' + (index + 1));
                }
            }
        });
    }

    function storeInstruction(parser, address, instruction) {
        parser.lines.push([address, instruction]);
        //console.log('1---1');
        for (var offset = 0; offset < instruction.length; offset += 2, address += 1) {
            parser.CPU.Memory.writeByte(address, parseInt(instruction.substr(offset, 2), 16));
        }
    }

    init(this);
}
