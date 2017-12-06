<template>
  <v-card hover ripple>
    <h3 class="text-xs-center">CLOCK</h3>
    <h2 class="text-xs-center" style="color: #FFE885">
      {{ clock }}
    </h2>
  </v-card>
</template>

<script>
  export default {
    name: 'Clock',
    props: ['clock']
  }
</script>

<style scoped>

</style>
