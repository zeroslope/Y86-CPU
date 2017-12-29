<template>
  <v-app style="height: 100%; background-color: #73ABC2">
    <div id="dropZone" @dragover.stop.prevent="handleDragOver" @drop.stop.prevent="handleFileSelect">
    <v-card app>
      <v-layout row wrap>
          <v-flex xs12 md6>
            <v-card>
              <v-toolbar light dense app class="mb-0">
                  <v-spacer></v-spacer>
                  <v-toolbar-title >Y86 Simulators</v-toolbar-title>
                  <v-btn icon>
                    <v-icon>memory</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
              </v-toolbar>
            </v-card>
          </v-flex>
          <v-flex xs12 md6>
            <v-toolbar dark dense app>
              <v-spacer></v-spacer>
              <v-toolbar-title>By 55242</v-toolbar-title>
              <v-btn icon href="https://github.com/55242/Y86-CPU" target="_blank">
                <v-icon>mdi-github-circle</v-icon>
              </v-btn>
            </v-toolbar>
          </v-flex>
      </v-layout>
    </v-card>

    <v-content style="font-family: 'Ubuntu Mono', monospace;">
      <v-container fluid grid-list-lg fill-height >

      <v-layout row class="mt-2">
        <v-flex>
          <v-layout column fixed>
            <v-flex>
              <v-layout row wrap align-start>
                <v-flex xs12 md5>
                  <v-layout column wrap>
                    <v-flex style="background-color: #424341" class="ml-2 mr-2" elevation-2>
                          <v-layout row>
                            <v-spacer></v-spacer>
                            <v-btn icon @click="backward">
                              <v-icon large color="teal">skip_previous</v-icon>
                            </v-btn>
                            <v-btn icon @click="pause">
                              <v-icon large style="color: #6BB6D3">pause</v-icon>
                            </v-btn>
                            <v-btn icon @click="start">
                              <v-icon large color="green">play_arrow</v-icon>
                            </v-btn>
                            <v-btn icon @click="forward">
                              <v-icon large color="teal">skip_next</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn icon @click="reset">
                              <v-icon large color="red">replay</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                          </v-layout>
                    </v-flex>

                    <v-flex>
                      <v-layout row wrap>
                        <v-flex class="mt-1 mb-1" style="height:60px;">
                          <clock style="background-color: #F25F5C" elevation-5 v-bind:clock="getCycle"></clock>
                        </v-flex>
                        <v-flex class="mt-1 mb-1" style="height:60px;">
                          <condition style="background-color: #FFE885" elevation-5 v-bind:cond="getCond"></condition>
                        </v-flex>
                        <v-flex class="mt-1 mb-1" style="height:60px;">
                          <cpi style="background-color: #66CCFF" elevation-5 v-bind:cpi="getCpi"></cpi>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                  <v-flex>
                    <v-layout row wrap>
                      <v-flex xs5 md4>
                        <v-layout class="ma-0 pa-0" elevation-4>
                          <v-flex  class="scroll ma-0" style="height:269px;">
                              <registers  class="md-1" v-bind:reg="getRegister"></registers>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex xs7 md8>
                        <v-layout class="ma-0 pa-0" elevation-5>
                          <v-flex class="scroll ma-0" style="height:269px; overflow: scroll;">
                              <stack v-bind:stack="getStack"></stack>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                  </v-layout>
                </v-flex>
                <v-flex md7>
                    <v-card class="elevation-10" style="font-family: 'Ubuntu Mono', monospace;">
                      <v-layout style="background-color: #252524;">
                        <!-- style="background-color: #424242" -->
                        <v-tabs v-model="activeTab" centered class="pl-0">
                          <v-tabs-bar dark class="mb-1 elevation-5" style="background-color: #424341;">
                            <v-tabs-item
                              v-for="tab in tabs"
                              :key="tab"
                              :href="'#' + tab"
                              ripple
                              class="white--text"
                            >
                              {{tab}}
                            </v-tabs-item>
                            <v-tabs-slider color="yellow"></v-tabs-slider>
                          </v-tabs-bar>

                          <v-tabs-items style="height:341px; overflow: scroll; overflow-x: hidden;" class="mt-1">
                            <v-tabs-content
                              v-for="(tab,index) in tabs"
                              :key="tab"
                              :id="tab"
                            >
                              <v-card dark flat hover v-for="(line,num) in tabData[index].split('\n')" :key='num'>
                                  <pre style="color: #C6C6C6; font-family: 'PT Mono', monospace;"> {{(num+1) + '\t' + line}}　</pre>
                              </v-card>
                            </v-tabs-content>
                          </v-tabs-items>
                        </v-tabs>
                      </v-layout>
                    </v-card>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex class="mt-3 ml-1" elevation-5 style="background-color: #3787A8">
              <pipe-line :fetch="getFetch" :decode="getDecode" :execute="getExecute" :memory="getMemory" :writeback="getWriteBack">
              </pipe-line>
            </v-flex>

          </v-layout>
        </v-flex>

          <v-flex md1 class="scroll" style="height:700px; overflow: scroll; overflow-x: hidden;">
            <div v-for="n in P.CPU.history.length" :key="n"  @click="comeTo(n)">
              <v-btn>
                {{n}}
              </v-btn>
            </div>
          </v-flex>

      </v-layout>
      </v-container>
    </v-content>

      <v-footer app fixed>
        <v-spacer></v-spacer>
        <span>&copy; 55242 2017</span>
      </v-footer>
    </div>
  </v-app>
</template>

<script>
import Control from './components/Control'
import CodeBoard from './components/CodeBoard'
import PipeLine from './components/Pipe'
import Stack from './components/Memory'
import Registers from './components/Registers'
import Clock from './components/Clock'
import Condition from './components/Condition'
import Cpi from './components/Cpi'

import Constant from './script/kernels/constant'
import Parser from './script/kernels/parser'

var code1 = '                      | /* $begin code-yso */\n                      | /* $begin code-ysa */\n                      | # Execution begins at address 0\n  0x000:              | 	.pos 0\n  0x000: 308400010000 | init:	irmovl Stack, %esp  	# Set up Stack pointer\n  0x006: 308500010000 | 	irmovl Stack, %ebp  	# Set up base pointer\n  0x00c: 7024000000   | 	jmp Main		# Execute main program\n                      |\n                      | # Array of 4 elements\n  0x014:              | 	.align 4\n  0x014: 0d000000     | array:	.long 0xd\n  0x018: c0000000     | 	.long 0xc0\n  0x01c: 000b0000     | 	.long 0xb00\n  0x020: 00a00000     | 	.long 0xa000\n                      |\n  0x024: 308004000000 | Main:	irmovl $4,%eax\n  0x02a: a008         | 	pushl %eax	# Push 4\n  0x02c: 308214000000 | 	irmovl array,%edx\n  0x032: a028         | 	pushl %edx      # Push array\n  0x034: 803a000000   | 	call Sum	# Sum(array, 4)\n  0x039: 10           | 	halt\n                      |\n                      | /* $begin sum-ys 0 */\n                      | 	# int Sum(int *Start, int Count)\n  0x03a: a058         | Sum:	pushl %ebp\n  0x03c: 2045         | 	rrmovl %esp,%ebp\n  0x03e: 501508000000 | 	mrmovl 8(%ebp),%ecx 	# ecx = Start\n  0x044: 50250c000000 | 	mrmovl 12(%ebp),%edx	# edx = Count\n  0x04a: 308000000000 | 	irmovl $0, %eax		# sum = 0\n  0x050: 6222         | 	andl   %edx,%edx\n  0x052: 7374000000   | 	je     End\n  0x057: 506100000000 | Loop:	mrmovl (%ecx),%esi      # get *Start\n  0x05d: 6060         | 	addl %esi,%eax          # add to sum\n  0x05f: 308304000000 | 	irmovl $4,%ebx          #\n  0x065: 6031         | 	addl %ebx,%ecx          # Start++\n  0x067: 3083ffffffff | 	irmovl $-1,%ebx	        #\n  0x06d: 6032         | 	addl %ebx,%edx          # Count--\n  0x06f: 7457000000   | 	jne    Loop             # Stop when 0\n  0x074:              | End:\n  0x074: b058         | 	popl %ebp\n  0x076: 90           | 	ret\n                      | /* $end sum-ys 0 */\n  0x100:              | 	.pos 0x100\n  0x100:              | Stack:	# The stack goes here\n                      | /* $end code-ysa */\n                      | /* $end code-yso */\n';
var code2 = "  0x0000: 308400020000 | irmovl Stack, %esp\n  0x0006: 308500020000 | irmovl Stack, %ebp\n  0x000c: 702c000000   | jmp main\n  0x0011:              | .align 4\n                       | \n  0x0014:              | ele1:\n  0x0014: 0a000000     | .long 0x00a\n  0x0018: 1c000000     | .long ele2\n  0x001c:              | ele2:\n  0x001c: b0000000     | .long 0x0b0\n  0x0020: 24000000     | .long ele3\n  0x0024:              | ele3:\n  0x0024: 000c0000     | .long 0xc00\n  0x0028: 00000000     | .long 0\n                       | \n  0x002c:              | main:\n  0x002c: 308214000000 | irmovl ele1,%edx\n  0x0032: a028         | pushl %edx\n  0x0034: 803a000000   | call sum_list\n  0x0039: 10           | halt\n                       | \n  0x003a:              | sum_list:\n  0x003a: a058         | pushl %ebp\n  0x003c: 2045         | rrmovl %esp,%ebp\n  0x003e: 6300         | xorl %eax,%eax\n  0x0040: 502508000000 | mrmovl 8(%ebp),%edx\n  0x0046: 6222         | andl %edx,%edx\n  0x0048: 7362000000   | je L3\n  0x004d:              | L6:\n  0x004d: 501200000000 | mrmovl (%edx),%ecx\n  0x0053: 6010         | addl %ecx,%eax\n  0x0055: 502204000000 | mrmovl 4(%edx),%edx\n  0x005b: 6222         | andl %edx,%edx\n  0x005d: 744d000000   | jne L6\n  0x0062:              | L3:\n  0x0062: 2054         | rrmovl %ebp,%esp\n  0x0064: b058         | popl %ebp\n  0x0066: 90           | ret\n  0x0067:              | .pos 0x200\n  0x0200:              | Stack:\n                       | ";
var code3 = '  0x0000: 30820a000000 | irmovl $10,%edx\n  0x0006: 308203000000 | irmovl $3,%edx\n  0x000c: 2020         | rrmovl %edx,%eax\n  0x000e: 10           | halt\n                       | ';
var Par = new Parser(code1);

export default {
  name: 'app',
  data: function () {
    return {
      P : {},
      freq: 4,
      run: false,
      tabs: ['asum','List_Sum','Forward'],
      activeTab: 'asum',
      tabData: [code1, code2, code3],
    }
  },
  watch: {
    activeTab: function(newValue, oldValue) {
      this.reset();
    }
  },
  components: {
    Clock,
    Control,
    CodeBoard,
    Stack,
    Registers,
    Condition,
    PipeLine,
    Cpi
  },
  created: function () {
    this.initParser(this.tabData[this.tabs.indexOf(this.activeTab)]);
  },
  computed: {
    getCycle: function () {
      return this.P.CPU.cycle;
    },
    getCond: function () {
      return {
        'ZF': this.P.CPU.ALU.ZF(),
        'SF': this.P.CPU.ALU.SF(),
        'OF': this.P.CPU.ALU.OF()
      }
    },
    getCode: function () {
      return this.P.syntaxs;
    },
    getRegister: function () {
      var _this = this;
      var R = {};
      Constant.REGISTERS.forEach( function(name) {
        R[name] = _this.P.CPU.Register.get(name);
      });
      return R;
    },
    getStack: function () {
      return this.P.CPU.Memory.data;
    },
    getFetch: function () {
      return {
        F_PredPC: this.P.CPU.Input.F_predPC,
      };
    },
    getDecode: function () {
      return {
        D_stat:    this.P.CPU.Input.D_stat,
        D_icode:   this.P.CPU.Input.D_icode,
        D_ifun:    this.P.CPU.Input.D_ifun,
        D_rA:      this.P.CPU.Input.D_rA,
        D_rB:      this.P.CPU.Input.D_rB,
        D_valC:    this.P.CPU.Input.D_valC,
        D_valP:    this.P.CPU.Input.D_valP
      };
    },
    getExecute: function () {
      return {
        E_stat:    this.P.CPU.Input.E_stat,
        E_icode:   this.P.CPU.Input.E_icode,
        E_ifun:    this.P.CPU.Input.E_ifun,
        E_valC:    this.P.CPU.Input.E_valC,
        E_valA:    this.P.CPU.Input.E_valA,
        E_valB:    this.P.CPU.Input.E_valB,
        E_dstE:    this.P.CPU.Input.E_dstE,
        E_dstM:    this.P.CPU.Input.E_dstM,
        E_srcA:    this.P.CPU.Input.E_srcA,
        E_srcB:    this.P.CPU.Input.E_srcB
      };
    },
    getMemory: function () {
      return {
        M_stat:    this.P.CPU.Input.M_stat,
        M_icode:   this.P.CPU.Input.M_icode,
        M_valE:    this.P.CPU.Input.M_valE,
        M_valA:    this.P.CPU.Input.M_valA,
        M_dstE:    this.P.CPU.Input.M_dstE,
        M_dstM:    this.P.CPU.Input.M_dstM,
        M_Cnd:     this.P.CPU.Input.M_Cnd
      };
    },
    getWriteBack: function () {
      return {
        W_stat:  this.P.CPU.Input.W_stat,
        W_icode: this.P.CPU.Input.W_icode,
        W_valE:  this.P.CPU.Input.W_valE,
        W_valM:  this.P.CPU.Input.W_valM,
        W_dstE:  this.P.CPU.Input.W_dstE,
        W_dstM:  this.P.CPU.Input.W_dstM
      }
    },
    getCpi: function () {
      return this.P.CPU.cpi[this.P.CPU.cycle].toFixed(2);
    },
    nowCode: function () {
      return this.tabData[this.tabs.indexOf(this.activeTab)];
    }
  },
  methods: {
    initParser: function () {
      this.P = new Parser(code1);
    },
    forward: function () {
      try {
        this.P.CPU.forward();
      } catch (err) {
          return false;
      }
      return true;
    },
    backward: function () {
      this.run = false;
      try {
        this.P.CPU.backward();
      } catch (err) {
        return false;
      }
      return true;
    },
    reset: function () {
      console.log(this.activeTab);
      this.run = false;
      this.P = new Parser(this.nowCode);
    },
    pause: function () {
      this.run = false;
    },
    setInterval: function () {
      if(!this.run) return false;
      if(!this.forward()) {
        this.run = false;
        return false;
      }
      setTimeout(this.setInterval, 1000 / this.freq);
      return true;
    },
    start: function () {
      if(this.run === true) return;
      this.run = true;
      if(!this.P) {
        this.P = new Parser(this.nowCode);
        this.setInterval();
      } else {
        this.setInterval();
      }
    },
    comeTo: function (n) {
      console.log(n);
      this.P.CPU.goto(n);
    },
    handleDragOver: function (evt) {
        evt.dataTransfer.dropEffect = 'copy';
    },
    handleFileSelect: function (evt) {
        var that = this;
        var files = evt.dataTransfer.files[0];
        var reader = new FileReader();
        reader.readAsText(files);
        reader.onload = function (e) {
          var output = reader.result.slice(0);
          var name = files.name;
          var type = files.name.split('.')[1];
          console.log(type);
          if(type !== 'yo') {
            alert('文件类型错误，仅支持.yo文件');
          } else {
            that.tabData.push(output);
            that.tabs.push(name+that.tabData.length);
            that.activeTab = name+that.tabData.length;
            console.log(typeof output);
            console.log(files.name.split('.')[0]);
          }
        };
    }
  }
}
/*
<input type="file" ref='updatefile' style="display: none"/>
<v-btn icon @click="getFile">
  <v-icon>backup</v-icon>
</v-btn>
*/
</script>

<style>
.scroll::-webkit-scrollbar {
  display: none;
}
pre {
  font-family: 'Ubuntu Mono', monospace;
  background-color: #252524;
}
body {
  font-family: 'Ubuntu Mono', monospace;
}
</style>
