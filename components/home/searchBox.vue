<script setup>
const state = reactive({
  dialog: false,
})
</script>

<template>
  <v-dialog v-model="state.dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props }">
      <v-btn dark v-bind="props" icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="d-flex pa-2 pa-md-5">
        <h3>جستجو در سایت</h3>
        <v-icon @click="state.dialog = false" class="mr-auto">mdi-close</v-icon>
      </v-card-title><v-divider></v-divider>
      <v-card-text>

        <v-text-field
            type="search"
            variant="underlined"
            label="برای جستجو کلمه ای را وارد کنید و اینتر بزنید..."
            autofocus
            append-inner-icon="mdi-magnify"
        ></v-text-field>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>