<template>
  <v-card hover ripple>
    <h3 class="text-xs-center" >CPI</h3>
    <h2 class="text-xs-center" style="color: #F25F5C">
      {{ cpi }}
    </h2>
  </v-card>
</template>

<script>
  export default {
    name: 'Cpi',
    props: ['cpi']
  }
</script>

<style scoped>

</style>
