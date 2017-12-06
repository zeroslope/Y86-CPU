<template>
  <v-card>
    <v-layout column fixed >
        <v-card>
          <v-list style="background-color: #70C1B3">
            <v-list-tile style="max-height:31.5px" v-for="(item,index) in reg" :key="index">
              <p class='line'>
                  <tt style="color: #2C2D2C">{{ index }}</tt>
                  <span style="color: #3B3B3A">{{ numToHex(reg[index], 8) }}</span>
              </p>
            </v-list-tile>
          </v-list>
        </v-card>
    </v-layout>
  </v-card>
</template>

<script>
  export default {
    name: 'Registers',
    props: ['reg'],
    data () {
      return {
      }
    },
    methods: {
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
      }
    }
  }
</script>

<style scoped>
.line{
  font-family: 'Courier New', Courier, monospace;
}

.scroll::-webkit-scrollbar {
  display: none;
}
.line {
  line-height:  0px;
  font-family: 'Ubuntu Mono', monospace;
  /*height:       20px;*/
}
</style>
