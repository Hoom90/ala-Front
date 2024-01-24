<script setup>
import { userStore } from "@/stores/userStore"

onMounted(()=>{
  var user = userStore()
  user.setAuth(localStorage.getToken())
  user.setUser(localStorage.getUser())
})

useHead({
  titleTemplate: (page) => {
    return page
      ? `مرکز مشاوره آلا - ${page}`
      : 'مرکز مشاوره آلا'
  },
  htmlAttrs:{
    lang: 'fa',
    dir: 'rtl'
  }
})

</script>
<template>
  <v-app class="back-image">
    <v-locale-provider rtl>
      <Transition>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      </Transition>
    </v-locale-provider>
  </v-app>
</template>

