<template>
  <v-container flat fluid class="ma-0 pa-0" style="font-family: 'PT Mono', monospace;">
  <v-layout column dark class="pt-2">
    <v-flex>
      <v-layout row wrap>
        <v-flex xs2 md1 class="pipe">
          <v-card flat class="pipe">
            <h3>FETCH</h3>
          </v-card>
        </v-flex>
        <v-flex xs2 md1 class="high box F_PredPC" v-for="(val,key) in fetch" :key="key">
            <v-card flat hover :id="key">
              <h5 class="ma-0">{{key}}</h5>
              <h3 class="ma-0">{{numtoStr(key, val)}}</h3>
            </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

   <v-flex>
      <v-layout row wrap>
        <v-flex xs2 md1 class="pipe mt-1">
          <v-card flat class="pipe">
            <h3>DECODE</h3>
          </v-card>
        </v-flex>
        <v-flex xs2 md1 class="high mt-1"  v-for="(val,key) in decode" :key="key" :id="key">
          <v-card hover flat >
            <h5 class="mx-0">{{key}}</h5>
            <h3 class="ma-0">{{numtoStr(key, val)}}</h3>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex>
      <v-layout row wrap>
        <v-flex md1 class="pipe mt-1">
          <v-card flat class="pipe">
            <h3>EXECUTE</h3>
          </v-card>
        </v-flex>
        <v-flex md1 class="high mt-1" v-for="(val,key) in execute" :key="key" :id="key">
          <v-card flat hover>
            <h5 class="ma-0">{{key}}</h5>
            <h3 class="ma-0">{{numtoStr(key, val)}}</h3>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex>
      <v-layout row wrap>
        <v-flex md1 class="pipe mt-1">
          <v-card flat class="pipe">
            <h3>MEMORY</h3>
          </v-card>
        </v-flex>
        <v-flex md1 class="high mt-1" v-for="(val,key) in memory" :key="key" :id="key">
          <v-card flat hover>
            <h5 class="ma-0">{{key}}</h5>
            <h3 class="ma-0">{{numtoStr(key, val)}}</h3>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex>
      <v-layout row wrap>
        <v-flex md1 class="pipe mt-1 mb-1">
          <v-card flat class="pipe">
            <h3>WRITEBACK</h3>
          </v-card>
        </v-flex>
        <v-flex md1 class="high mt-1 mb-2" v-for="(val,key) in writeback" :key="key" :id="key">
          <v-card flat hover>
            <h5 class="ma-0">{{key}}</h5>
            <h3 class="ma-0">{{numtoStr(key, val)}}</h3>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
require('../assets/move.min.js')
require('../assets/jquery-3.2.1.min.js')
require('../assets/animate.min.css')

$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
              callback();
            }
        });
        return this;
    }
});

var STATE       = [ 'S_BUB', 'S_AOK', 'S_HLT', 'S_ADR', 'S_INS', 'S_PIP'];
var INSTRUCTION = [ 'I_NOP', 'I_HALT', 'I_RRMOVL', 'I_IRMOVL', 'I_RMMOVL', 'I_MRMOVL', 'I_OPL', 'I_JXX', 'I_CALL', 'I_RET', 'I_PUSHL', 'I_POPL', 'I_IADDL'];
var REGISTERS   = [ 'R_EAX', 'R_ECX', 'R_EDX', 'R_EBX', 'R_ESP', 'R_EBP', 'R_ESI', 'R_EDI'];

  export default {
    name: 'Pipe',
    props: ['fetch', 'decode', 'execute', 'memory', 'writeback'],
    data () {
      return {
      };
    },
    directives: {
      change: {
        update: function (el) {
          var ID = el.getAttribute('id');
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
          console.log(ID);
        }
      }
    },
    watch: {
      'fetch.F_PredPC': function (newValue, oldValue) {
          var ID = 'F_PredPC';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'decode.D_stat': function (newValue, oldValue) {
          var ID = 'D_stat';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'decode.D_icode': function (newValue, oldValue) {
          var ID = 'D_icode';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'decode.D_ifun': function (newValue, oldValue) {
          var ID = 'D_ifun';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'decode.D_rA': function (newValue, oldValue) {
          var ID = 'D_rA';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'decode.D_rB': function (newValue, oldValue) {
          var ID = 'D_rB';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'decode.D_valC': function (newValue, oldValue) {
          var ID = 'D_valC';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'decode.D_valP': function (newValue, oldValue) {
          var ID = 'D_valP';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'execute.E_stat': function (newValue, oldValue) {
          var ID = 'E_stat';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'execute.E_icode': function (newValue, oldValue) {
          var ID = 'E_icode';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'execute.E_ifun': function (newValue, oldValue) {
          var ID = 'E_ifun';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'execute.E_valC': function (newValue, oldValue) {
          var ID = 'E_valC';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'execute.E_valA': function (newValue, oldValue) {
          var ID = 'E_valA';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'execute.E_valB': function (newValue, oldValue) {
          var ID = 'E_valB';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'execute.E_dstE': function (newValue, oldValue) {
          var ID = 'E_dstE';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'execute.E_dstM': function (newValue, oldValue) {
          var ID = 'E_dstM';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'execute.E_srcA': function (newValue, oldValue) {
          var ID = 'E_srcA';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'execute.E_srcB': function (newValue, oldValue) {
          var ID = 'E_srcB';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'memory.M_stat': function (newValue, oldValue) {
          var ID = 'M_stat';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'memory.M_icode': function (newValue, oldValue) {
          var ID = 'M_icode';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'memory.M_Cnd': function (newValue, oldValue) {
          var ID = 'M_Cnd';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'memory.M_valE': function (newValue, oldValue) {
          var ID = 'M_valE';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'memory.M_valA': function (newValue, oldValue) {
          var ID = 'M_valA';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'memory.M_dstE': function (newValue, oldValue) {
          var ID = 'M_dstE';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'memory.M_dstM': function (newValue, oldValue) {
          var ID = 'M_dstM';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'writeback.W_stat': function (newValue, oldValue) {
          var ID = 'W_stat';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'writeback.W_icode': function (newValue, oldValue) {
          var ID = 'W_icode';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'writeback.W_valE': function (newValue, oldValue) {
          var ID = 'W_valE';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'writeback.W_valM': function (newValue, oldValue) {
          var ID = 'W_valM';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'writeback.W_dstE': function (newValue, oldValue) {
          var ID = 'W_dstE';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
      'writeback.W_dstM': function (newValue, oldValue) {
          var ID = 'W_dstM';
          var $Node = $('#' + ID);
          $Node.animateCss('pulse');
      },
    },
    methods: {
      getState: function(name) {
        if(0 <= name && name <= 5) {
          return STATE[name];
        } else {
          return 'Error';
        }
      },
      numToHex: function (value, len) {
        if(typeof value == 'undefined' || value === null) {
          return '';
        }
        if(value < 0) {
          value = 0xffffffff + value + 1;
        }
        var res = value.toString(16);
        while(res.length < len) {
          res = '0' + res;
        }
        return '0x' + res;
      },
      numtoStr: function (name, val) {
        if(['D_stat','E_stat','M_stat','W_stat'].indexOf(name) !== -1) {
          return this.getState(val);
        } else if(['D_icode','E_icode','M_icode','W_icode'].indexOf(name) !== -1) {
          return INSTRUCTION[val];
        } else if(['D_rA','D_rB','E_dstE','E_dstM','E_srcA','E_srcB','M_dstE','M_dstM','W_dstE','W_dstM'].indexOf(name) !== -1) {
          //console.log(name + ' ' + val);
          if(typeof val == 'undefined' || val > 7) return 'R_NONE';
          else return REGISTERS[val];
        } else if(name === 'M_Cnd') {
          return val;
        } else {
          return this.numToHex(val, 8);
        }
      }
    }
  }
</script>

<style scoped>
.high {
  text-align: center;
  line-height: 22px;
}
.pipe {
  text-align: center;
  line-height: 44px;
  min-height: 44px;
  max-height: 44px;
}
.animated {
    -webkit-animation-duration: 0.3s;
    animation-duration: 0.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}
</style>
