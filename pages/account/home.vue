<script setup>
const user = userStore()
</script>

<template>
  <v-row>
    <v-col cols="6" sm="4" md="3">
      <v-alert
          variant="outlined"
          class="rounded-lg border-md text-center"
          color="red-lighten-1"
          border="start"
      >
        <h2 class="mb-10">خرید های من</h2>
        <h1>0</h1>
      </v-alert>
    </v-col>
    <v-col cols="6" sm="4" md="3">
      <v-alert
          variant="outlined"
          class="rounded-lg border-md text-center"
          color="deep-purple-accent-4"
          border="start"
      >
        <h2 class="mb-10">خرید های من</h2>
        <h1>0</h1>
      </v-alert>
    </v-col>
    <v-col cols="6" sm="4" md="3">
      <v-alert
          variant="outlined"
          class="rounded-lg border-md text-center"
          color="teal-darken-1"
          border="start"
      >
        <h2 class="mb-10">خرید های من</h2>
        <h1>0</h1>
      </v-alert>
    </v-col>
    <v-col cols="6" sm="4" md="3">
      <v-alert
          variant="outlined"
          class="rounded-lg border-md text-center"
          color="orange-darken-2"
          border="start"
      >
        <h2 class="mb-10">خرید های من</h2>
        <h1>0</h1>
      </v-alert>
    </v-col>
    <v-col cols="12">
      <v-alert color="warning" variant="tonal" class="rounded-lg">
        <strong>{{`${user.getUser.firstName} ${user.getUser.lastName}`}}</strong><br /><br />
        <p>به پنل کاربری خود خوش آمدید.</p>
      </v-alert>
    </v-col>
  </v-row>
</template>