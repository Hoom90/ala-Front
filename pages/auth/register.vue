<script setup>
definePageMeta({ layout: 'auth' })
import { userStore } from "@/stores/userStore"
const user = userStore()
const router = useRouter()
const verifyForm = ref({});

const state = reactive({
  firstName: '',
  lastName: '',
  password: '',
  rePassword: '',
})

useHead({
  title:"ثبت نام",
  meta:[{name:'description',content:'ثبت نام کاربر جدید'}],
  meta:[{name:'keywords',content:'ثبت نام,عضو,کاربر,جدید'}],
})

if (!user.getMobile)
  router.replace('/auth/login')

const register = async () => {
  const { valid } = await verifyForm.value.validate()
  if (!valid) return

  axiosApi().post("auth/register", {
    mobile: user.getMobile,
    firstName: state.firstName,
    lastName: state.lastName,
    password: state.password,
    rePassword: state.rePassword,
    registerToken: user.getRegisterToken
  }).then(r => {
    localStorage.setToken(r.data?.token)
    userInfo()
  }).catch(e => {
    common.showError(e.data?.messages)
  }).finally(() => {

  })
}

const userInfo = () => {

  axiosApi().get("account/user-info").then(r => {
    localStorage.saveUser(r.data)
    common.showMessage("ثبت نام با موفقیت انجام شد")
    router.push("/")
  }).catch(e => {
    common.showError(e?.data?.messages)
  }).finally(() => {

  })
}


const validator = {
  firstName: [
    value => {
      return true
      if (/^0?9[0-9]{9}$/.test(value)) return true
      return 'شماره وارد شده اشتباه است.'
    },
  ],
  lastName: [
    value => {
      return true
      if (/^0?9[0-9]{9}$/.test(value)) return true
      return 'شماره وارد شده اشتباه است.'
    },
  ],
  password: [
    value => {
      return true
      if (/^0?9[0-9]{9}$/.test(value)) return true
      return 'شماره وارد شده اشتباه است.'
    },
  ],
  rePassword: [
    value => {
      return true
      if (/^0?9[0-9]{9}$/.test(value)) return true
      return 'شماره وارد شده اشتباه است.'
    },
  ]
}


</script>
<template>
  <v-card max-width="400" width="330px" class="mt-n16 pt-2 bg-transparent border-lg border-warning">
    <!-- <v-card-item>
      <v-alert density="compact" color="success">
        <small>تمامی پیغام ها در این بخش نمایش داده خواهند شد.</small>
      </v-alert>
    </v-card-item> -->
    <v-card-text class="py-3">
      <div class="d-flex justify-center align-center mb-5">
        <span>موبایل:</span>
        {{ user.getMobile }}
        <NuxtLink to="/auth/login"><small>تغییر شماره</small></NuxtLink>
      </div>
      <v-form @submit.prevent="register" ref="verifyForm">
        <!-- <v-text-field variant="outlined" v-model="user.getMobile" readonly class="text-center" id="username"
          name="username" label="شماره همراه"></v-text-field> -->
        <v-text-field v-model="state.firstName" variant="outlined" class="text-center" label="نام"
          :rules="validator.firstName"></v-text-field>
        <v-text-field v-model="state.lastName" variant="outlined" class="text-center" label="نام خانوادگی"
          :rules="validator.lastName"></v-text-field>
        <v-text-field v-model="state.password" variant="outlined" type="password" class="text-center" label="کلمه عبور"
          :rules="validator.password"></v-text-field>
        <v-text-field v-model="state.rePassword" variant="outlined" type="password" class="text-center"
          label="تکرار کلمه عبور" :rules="validator.rePassword"></v-text-field>
        <hr><br /><v-divider></v-divider>
        <v-btn type="submit" variant="tonal" class="w-100" size="x-large"> ثبت نام</v-btn>
      </v-form>
      <v-divider></v-divider>
      <div class="d-flex justify-center pt-5 pb-3">
        <v-btn to="/auth/login" icon="mdi-lock" class="ml-5" title="صفحه ورود"></v-btn>
        <!-- <v-btn icon="mdi-email" title="ورود با ایمیل"></v-btn> -->
      </div>
    </v-card-text>
  </v-card>
  <v-card max-width="400" width="330px" class="mt-5 pt-2 bg-transparent border-lg border-warning">
  </v-card>
</template>