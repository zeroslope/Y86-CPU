<template>
  <v-flex style="height:250px; overflow: scroll; overflow-x:hidden;">
    <v-card>
      <v-layout column fixed>
          <v-card>
            <v-list>
              <!-- <v-list-tile v-for="(item, index, value) in register" :key="index"> -->
              <v-list-tile v-for="i in 10" :key="i">
                <v-list-tile-content>
                    <v-list-tile-title>{{ i }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{ i }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script>
  export default {
    name: 'Registers',
    props: ['register'],
    data () {
      return {
        register: {
          'eax': 1,
          'ebx': 2
        }
      }
    }
  }
</script>

<style scoped>

</style>
