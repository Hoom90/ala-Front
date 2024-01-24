<script setup>
import { userStore } from "@/stores/userStore"
import avatar from "@/assets/img/avatar.png"
import imageView from "@/components/image.vue"
const user = userStore()
const router = useRouter()

const state = reactive({
  asideAccount: [
    { name: "میزکار من", icon: 'mdi-laptop', url: "/account/home" },
    { name: "ویرایش کاربری", icon: 'mdi-badge-account-horizontal-outline', url: "/account/editProfile" },
    { name: "کیف پول", icon: 'mdi-credit-card-outline', url: "/account/wallet" },
    { name: "سفارشات", icon: 'mdi-basket-outline', url: "/account/orders/" },
    // { name: "مشاوره ها", icon: 'mdi-hand-heart', url: "/account/###" },
    { name: "تیکت", icon: 'mdi-rhombus-split', url: "/account/ticket/list" },
    { name: "تغییر کلمه عبور", icon: 'mdi-key-outline', url: "/account/changePassword" },
    { name: "خروج", icon: 'mdi-power-standby', func: logOut },
  ],
})

onMounted(()=>{
  if(user.getIsConsultant){
    state.asideAccount.splice(4,1,{ name: "خدمات", icon: 'mdi-briefcase-outline', url: "/account/service" },{ name: "تالار گفتگو", icon: 'mdi-chat-outline', url: "/account/forum/" })
  }
})

async function logOut() {
  await axiosApi().post(apiPath.Logout)
    .then(r => {
      console.log('logout');
      localStorage.logOut()
      router.replace('/')
    }).catch(e => {
      common.showError(e?.data?.messages)
    })
}

</script>
<template>
  <v-card class="asideCard rounded-xl">
    <v-card-text style="background: var(--theme-blue)">
      <!-- {{ user.getUser?.imageId }} -->
      <imageView :src="user.getUser?.imageId" :no-image="avatar"
        custom-class="mx-auto cursor-pointer rounded-pill mb-5 border-xl"
        style="width: 100px; height: 100px;" />
      <!-- {{ user.getUser?.imageId }} -->
      <!-- <v-img :src="user.getUser?.imageId?  avatar" class="mx-auto cursor-pointer rounded-pill mb-10 border-xl" width="100"
        height="100" /> -->
      <h1 class="text-center text-white mb-3"><strong>{{ `${user.getUser.firstName} ${user.getUser.lastName}` }}</strong></h1>
    </v-card-text>
    <v-slide-group
        class="d-flex d-md-none"
        show-arrows
    >
      <v-slide-group-item
          v-for="item in state.asideAccount"
          :key="item"
      >
        <v-btn
            class="ma-2"
            rounded
            variant="tonal"
            :to="item.url"
            @click="item.func"
        >
          {{ item.name }}
        </v-btn>
      </v-slide-group-item>
    </v-slide-group>
    <v-list class="d-none d-md-block">

      <v-list-item v-for="item in state.asideAccount" :key="item" :to="item.url" :title="item.name" @click="item.func">
        <template v-slot:prepend>
          <v-icon color="blue" :icon="item.icon"></v-icon>
        </template>
      </v-list-item>

    </v-list>
  </v-card>
</template>
<style>
.asideCard{position: sticky;top: 110px;}
</style>
