<template>
  <v-card hover ripple>
    <div>
      <h3 class="text-xs-center">CONDITIONS</h3>
      <h2 class="text-xs-center" style="color: #3787A8">ZF = {{cond.ZF}}　SF = {{cond.SF}}　OF = {{cond.OF}} </h2>
    </div>
  </v-card>
</template>

<script>
  export default {
    name: 'Registers',
    props: ['cond'],
    data () {
      return {

      }
    }
  }
</script>

<style scoped>

</style>
