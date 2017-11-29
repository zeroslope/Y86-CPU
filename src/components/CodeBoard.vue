<template>
  <v-card>
    <v-layout>
      <v-tabs v-model="active" centered>
        <v-tabs-bar dark>
          <v-tabs-item
            v-for="tab in 3"
            :key="tab"
            :href="'#' + tab"
            ripple
            class="black--text"
          >
            Item {{i}}
          </v-tabs-item>
          <v-tabs-slider color="green"></v-tabs-slider>
        </v-tabs-bar>

        <v-tabs-items>
          <v-tabs-content
            v-for="i in 3"
            :key="i"
            :id="tab"
          >
            <v-card>
              <v-card-text>{{ i }}</v-card-text>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-layout>
  </v-card>
</template>

<script>
  export default {
    name: 'CodeBoard',
    data () {
      return {

      }
    }
  }
</script>

<style scoped>

</style>
