<template>
  <v-card>
    <v-layout column fixed >
        <v-card>
          <v-list class="grey lighten-3">
            <v-list-tile v-for="(item,index) in reg" :key="index">
              <v-list-tile-content class='line'>
                  <v-list-tile-title class="caption">{{ index }}</v-list-tile-title>
                  <v-list-tile-sub-title class="body-1">{{ numToHex(reg[index], 8) }}</v-list-tile-sub-title>
              </v-list-tile-content>
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
  line-height:  13px;
  /*height:       20px;*/
}
</style>
