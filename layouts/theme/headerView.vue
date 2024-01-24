<script setup>
import logo from "@/assets/logo.svg"
import { useTheme } from "vuetify";
import { userStore } from "@/stores/userStore"
import SearchBox from "~/components/home/searchBox.vue";
const user = userStore()
const router = useRouter();
const state = reactive({
  sidebar: false,
  asideProfile: [
    { name: "پنل کاربری من", icon: 'mdi-home-outline', url: "/account/home" },
    { name: "پنل ادمین", icon: 'mdi-hand-heart-outline', url: "/dashboard" },
    { name: "ورود یا ثبت نام", icon: 'mdi-newspaper', url: "/auth/login" },
  ],
  asideDefault: [
    { name: "خانه", icon: 'mdi-home-outline', url: "/" },
    { name: "تالار گفتگو", icon: 'mdi-wechat', url: "/topic" },
    { name: "مشاوران", icon: 'mdi-hand-heart-outline', url: "/expert" },
    { name: "مقالات", icon: 'mdi-newspaper', url: "/article" },
    { name: "اخبار", icon: 'mdi-newspaper', url: "/news" },
    { name: "دسته بندی", icon: 'mdi-rhombus-split-outline', hasChildren: true, children: [] },
  ],
  asidePages: [],
  categorySelect: false,
})

fetchApi.post(apiPath.public.Category.post, { body: {} })
  .then((res) => {
    state.asideDefault[4].children = res.data.value.data
  }).catch(error => {
    common.showError(error?.messages)
  })
const pages = await fetchApi.get(`${apiPath.public.Page.query}?ContentType=3`)
  .then((res) => {
    return res.data.value
  }).catch(error => {
    common.showError(error?.messages)
  })

const theme = useTheme();
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
};
async function logOut() {
  await axiosApi().post(apiPath.Logout)
    .then(r => {
      localStorage.logOut()
      state.sidebar = false
      common.showMessage("خروج با موفقیت انجام شد")
      router.push("/")
    }).catch(e => {
      common.showError(e?.data?.messages)
    })
}
</script>
<template>
  <v-navigation-drawer v-model="state.sidebar" style="z-index: 9999;" elevation="2" temporary>
    <v-list color="transparent" class="mt-10">
      <v-list-item v-if="!user.getAuth" class="d-md-none d-flex" to="/auth/login" prepend-icon="mdi-login"
        title="ورود یا ثبت نام" active-class="text-blue">
      </v-list-item>
      <v-list-item v-else class="d-md-none d-flex" to="/account/home" prepend-icon="mdi-login" title="پنل کاربری من"
        active-class="text-blue">
      </v-list-item>
      <v-list-item v-if="user.getIsAdmin" class="d-md-none d-flex" prepend-icon="mdi-login" title="پنل ادمین"
        to="/dashboard" active-class="text-blue">
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item :prepend-icon="item.icon" :title="item.name" active-class="text-blue" :to="item.url"
        @click="state.categorySelect = !state.categorySelect" v-for="item in state.asideDefault"
        :append-icon="item.hasChildren ? state.categorySelect ? 'mdi-minus' : 'mdi-plus' : ''"></v-list-item>
      <v-list-item v-if="state.categorySelect" prepend-icon="mdi-rhombus-split-outline" :title="item.title"
        :to="`/category/${item.id}/${item.title.replaceAll(' ','-')}`" active-class="text-blue"
        v-for="item in state.asideDefault[4].children"></v-list-item>
      <v-divider></v-divider>

      <v-list-item prepend-icon="mdi-rhombus-split-outline" :title="item.title" active-class="text-blue" :to="`/page/${item.id}/${item.title.replaceAll(' ','-')}`"
        v-for="item in pages"></v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2" v-if="user.getAuth">
        <v-btn block @click="logOut">
          <v-icon>mdi-power-standby</v-icon>
          <span class="mr-2">خروج</span>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>


  <v-app-bar class="overflow-visible px-3" height="90">
    <div class="mx-auto w-100 align-center d-flex">
      <v-app-bar-nav-icon class="ml-4" @click="state.sidebar = !state.sidebar"></v-app-bar-nav-icon>
      <v-app-bar-title class="d-none d-md-block">
        <nuxt-link to="/">
          <h1 style="font-size: 1rem;">مرکز مشاوره و خدمات روانشناختی آلاء</h1>
        </nuxt-link>
      </v-app-bar-title>
    </div>
    <div class="mx-auto w-100 d-block">
      <nuxt-link to="/" class="centeredLogo">
        <v-img :src="logo" width="100%" />
      </nuxt-link>
    </div>
    <div class="align-center d-flex justify-end mx-auto text-left w-100">
      <v-btn class="d-none d-md-flex" v-if="!user.getAuth" to="/auth/login" variant="text" rounded="xl" size="x-large">
        <v-icon>mdi-login</v-icon>
        <strong><small>ورود یا ثبت نام</small></strong>
      </v-btn>
      <v-btn class="d-none d-md-flex" v-else to="/account/home" variant="text" rounded="xl" size="x-large">
        <v-icon>mdi-login</v-icon>
        <strong><small>پنل کاربری من</small></strong>
      </v-btn>
      <v-btn class="d-none d-md-flex" v-if="user.getIsAdmin" to="/dashboard" variant="text" rounded="xl" size="x-large">
        <v-icon>mdi-login</v-icon>
        <strong><small>پنل ادمین</small></strong>
      </v-btn>
      <!-- <SwichTheme /> -->

      <v-btn icon @click="toggleTheme">
        <v-icon v-if="theme.global.current.value.dark">mdi-moon-waning-crescent</v-icon>
        <v-icon v-else-if="!theme.global.current.value.dark">mdi-weather-sunny</v-icon>
      </v-btn>

      <SearchBox />

    </div>
  </v-app-bar>
</template>


<style scoped>header {
  border-bottom: solid 5px var(--theme-blue);
}</style>