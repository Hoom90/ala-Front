<script setup>
definePageMeta({ layout: 'auth' });
const { $swal } = useNuxtApp();

import { userStore } from "@/stores/userStore"

// import { loginMobile } from "@/stores/loginStore"
const router = useRouter();

var user = userStore()

const verifyForm = ref({});

const state = reactive({
  verifyCode: null,
})

if (!user.getMobile)
  router.replace('/auth/login')

const verify = async () => {
  const { valid } = await verifyForm.value.validate()
  if (!valid) return


  axiosApi().post("auth/confirm-sms-code", {
    mobile: user.getMobile,
    smsToken: state.verifyCode
  }).then(r => {
    router.push('/auth/register')
  }).catch(e => {
    common.showError(e?.data?.messages)
  }).finally(() => {

  })
}


const validator = {
  codeNumber: [
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
    <v-card-item>
      <v-alert density="compact" color="success">
        <small>کد پیامی که از طریق پیامک برای شما ارسال شده را اینجا وارد کنید.</small>
      </v-alert>
    </v-card-item>
    <v-card-text class="py-3">
      <v-form fast-fail @submit.prevent="verify" ref="verifyForm">
        <div class="my-2">
          <span>شماره شما:</span>
          {{ user.getMobile }}
          <NuxtLink class="under-lined" to="/auth/login">تغییر شماره</NuxtLink>
        </div>

        <v-text-field v-model="state.verifyCode" variant="outlined" :maxlength="6" class="text-center mb-1"
          :rules="validator.codeNumber" label="کد پیامک"></v-text-field>
        <hr><br /><v-divider></v-divider>
        <v-btn type="submit" variant="tonal" block size="x-large" class="w-100">ثبت کد</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>