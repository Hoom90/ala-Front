<script setup>
definePageMeta({
  layout: 'dashboard',
})
import NewTagComp from "~/pages/dashboard/tag/components/newTagComp.vue";
</script>

<template>
  <v-toolbar class="mb-5" elevation="1" color="white" rounded>
    <v-toolbar-title>
      برچسب ها
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <NewTagComp />
  </v-toolbar>
</template>
