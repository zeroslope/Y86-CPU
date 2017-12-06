<template>
  <v-card>
    <v-layout column fixed>
        <v-card style="min-height:270px; background-color: #63AFD0;">
          <v-list style="background-color: #63AFD0">
            <v-list-tile style="max-height:24px" v-for="(item,index) in stack" :key="index" calss="pa-0 ma-0">
                <p class="line">
                  <span >{{ '0x' + numToHex(index*4, 4) }}</span>
                  <span style="color: #3B3B3A">{{ '0x' + memToHex(item) }}</span>
                </p>
            </v-list-tile>
          </v-list>
        </v-card>
    </v-layout>
  </v-card>
</template>

<script>
  export default {
    name: 'Memory',
    props: ['stack'],
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
        return res;
      },
      memToHex: function (value) {
        if(typeof value == 'undefined' || value === null) {
          return '';
        }
        var res = '';
        for(var i = 0;i < value.length;++ i) {
          res += this.numToHex(value[i], 2);
        }
        return res;
      }
    }
  }
</script>

<style scoped>
.scroll::-webkit-scrollbar {
  display: none;
}
p {
  font-family: 'Ubuntu Mono', monospace;
}
span {
  font-family: 'Ubuntu Mono', monospace;
}
.line{
  font-family: 'Ubuntu Mono', monospace;
}
</style>
