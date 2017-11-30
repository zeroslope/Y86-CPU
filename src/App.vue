<template>
  <v-app>
    <!-- <img src="./assets/logo.png"> -->
    <v-card>
      <v-layout row wrap>
          <v-flex xs12 md6>
            <v-toolbar light dense app class="mb-0">
                <v-spacer></v-spacer>
                <v-toolbar-title >Y86 Simulators</v-toolbar-title>
                <v-btn icon>
                   <v-icon>memory</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
            </v-toolbar>
          </v-flex>
          <v-flex xs12 md6>
            <v-toolbar dark dense app>
              <v-spacer></v-spacer>
              <v-toolbar-title>By 55242</v-toolbar-title>
              <v-btn icon>
                <v-icon>mdi-github-circle</v-icon>
              </v-btn>
            </v-toolbar>
          </v-flex>
      </v-layout>
    </v-card>

    <main>
    <v-content class="my-1">
      <v-container fluid grid-list-xs>

      <v-layout column>

        <v-layout row wrap align-start>
          <v-flex xs12 md4>
            <v-layout column wrap>
              <v-flex >
                <v-card>
                  <control></control>
                </v-card>
              </v-flex>

              <v-flex>
                <v-layout row>
                  <v-flex xs4 md4 class="mt-1">
                    <clock></clock>
                  </v-flex>
                  <v-flex xs8 md8 class="mt-1">
                    <condition></condition>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex class="mt-0">
                <v-layout row>
                  <v-flex xs5 md4>
                    <registers></registers>
                  </v-flex>
                  <v-flex xs7 md8>
                    <registers></registers>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex md7 class="ml-1">
            <code-board></code-board>
          </v-flex>
        </v-layout>

        <v-flex>
          <pipe-line></pipe-line>
        </v-flex>

      </v-layout>
      </v-container>
    </v-content>
    </main>

      <v-footer app fixed>
        <span>&copy; 55242 2017</span>
      </v-footer>
  </v-app>
</template>

<script>
import Control from './components/Control'
import CodeBoard from './components/CodeBoard'
import PipeLine from './components/Pipe'
import Memory from './components/Memory'
import Registers from './components/Registers'
import Clock from './components/Clock'
import Condition from './components/Condition'
var Constant = require('./script/kernels/constant');

export default {
  name: 'app',
  components: {
    Clock,
    Control,
    CodeBoard,
    Memory,
    Registers,
    Condition,
    PipeLine
  }
}
</script>

<style>

</style>
