<script setup>

const emit = defineEmits('change')
</script>
<template>
  <v-app-bar :elevation="2" color="grey-darken-3">
    <v-app-bar-nav-icon @click="emit('change')"></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-bell-alert-outline</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-account-box-outline</v-icon>
    </v-btn>
  </v-app-bar>
</template>