<script setup>
definePageMeta({ layout: 'auth' });
const { $swal } = useNuxtApp();

// import LoginWithPassword from "./login/login-with-password.vue"
// import LoginWithSMS from "./login/login-with-sms.vue"
import { userStore } from "@/stores/userStore"

// import { loginMobile } from "@/stores/loginStore"
const router = useRouter();

var user = userStore()

const verifyForm = ref({});

const state = reactive({
  mobile: null,
  status: 0,
})


const checkMobile = async () => {
  const { valid } = await verifyForm.value.validate()
  if (!valid) return

  state.verifyData = await httpClient.post("auth/check-user-registration",
    {
      body: {
        mobile: state.mobile,
      }
    });

  if (state.verifyData.error) {
    $swal.fire({
      title: "خطا",
      text: state.verifyData.error.message,
      icon: 'error',
      confirmButtonText: 'باشه',
      timer: 5000,
    });
  }
  else {
    if (state.verifyData?.data?.succeeded) {
      if (state.verifyData?.data?.data?.isRegistered) {
        if (state.verifyData?.data?.data?.isUser) {
          // login with password
          state.status = 1;
        }
      }
      else {
        // complete register
        user.setMobile(state.mobile)
        router.push('/auth/register')
      }

    }
    // localStorage.setToken(state.data?.data?.data?.token)
  }
}

const loginWithSMS = async () => {
  state.loginSMSData = await httpClient.post("auth/send-sms-code",
    {
      body: {
        mobile: state.mobile,
      }
    });

  if (state.loginSMSData.error) {
    $swal.fire({
      title: "خطا",
      text: state.loginSMSData.error.message,
      icon: 'error',
      confirmButtonText: 'باشه',
      timer: 5000,
    });
  }
  else {
    state.status = 2
  }
}



const forgot = () => {
  user.setMobile(state.mobile)

  axiosApi().post("auth/forgot-password", {
    mobile: state.mobile
  }).then(r => {
    router.push('/auth/forgot')

  }).catch(e => {
    common.showError(e?.data?.messages)
  }).finally(() => {

  })

}


const validator = {
  mobileNumber: [
    value => {
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
        <small>تمامی پیغام ها در این بخش نمایش داده خواهند شد.</small>
      </v-alert>
    </v-card-item>
    <v-card-text class="py-3">
      <v-form fast-fail @submit.prevent="checkMobile" ref="verifyForm" v-if="state.status == 0">
        <v-text-field v-model="state.mobile" variant="outlined" :maxlength="6" class="text-center mb-1" :rules="validator.mobileNumber"
          label="کد پیامک"></v-text-field>
        <hr><br /><v-divider></v-divider>
        <v-btn type="submit" variant="tonal" block size="x-large" class="w-100">ثبت کد</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>