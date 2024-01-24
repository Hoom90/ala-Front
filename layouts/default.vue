<script setup>
import '@/assets/css/theme.css'
import HeaderView from "@/layouts/theme/headerView.vue";
import FooterView from "@/layouts/theme/footerView.vue";
import { userStore } from "~/stores/userStore";
const user = userStore()
const router = useRouter()
const breadCrumbs = publicbreadcrumbstore()

onMounted(()=>{
   if(user.getFavorite.expertId && user.getUser){
      let id = user.getFavorite.expertId
      user.setFavorite(null)
      router.push(`expert/${id}`)
   }
})

</script>

<template>
      <HeaderView />
      <v-main>
            <v-container grid-list-xs class="pb-0">
                  <!-- {{ breadCrumbs.getBreadCrumbs }} -->
                   <v-breadcrumbs v-if="breadCrumbs.getBreadCrumbs.length != 0" :items="breadCrumbs.getBreadCrumbs" class="pt-1 pb-0">
                        <template v-slot:divider>
                              <v-icon icon="mdi-chevron-left"></v-icon>
                        </template>
                  </v-breadcrumbs>
            </v-container>
            <slot />
      </v-main>
      <FooterView />
</template>
