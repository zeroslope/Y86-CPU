<template>
    <v-layout>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon large color="teal">skip_previous</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon large color="grey">pause</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon large color="green">play_arrow</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon large color="teal">skip_next</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon >
        <v-icon large color="red">replay</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
    </v-layout>
</template>

<script>
export default {
  name: "Control",
  data() {
    return {};
  }
};
</script>

<style scoped>

</style>
