<script setup>
definePageMeta({ layout: 'auth' });
import validator from "@/composables/validator"
import LoginWithPassword from "@/components/auth/login/login-with-password.vue"
import LoginWithSMS from "@/components/auth/login/login-with-sms.vue"
import { userStore } from "@/stores/userStore"
const router = useRouter();
const user = userStore()
const verifyForm = ref({});

useHead({
  title:'ورود',
  meta:[{name:'description',content:'ورود به سایت و پنل کاربری'}],
  meta:[{name:'keywords',content:'ورود,کاربر,پنل'}],
})

const state = reactive({
  mobile: "",
  status: 0,
})

const checkMobile = async () => {
  const { valid } = await verifyForm.value.validate()
  if (!valid) return

  axiosApi().post(apiPath.CheckUserRegistration,
    {
      mobile: state.mobile.toString(),
    }).then(r => {
      user.setMobile(state.mobile)
      user.setRegisterToken(r.data?.registerToken ?? '')

      if (!r.data?.confirmMobile)
        sendVerifySms()

      if (r.data?.isUser) {
        if (!r.data?.isRegistered) {
          router.push('/auth/register')
        }
        else {
          state.status = 1;
        }
        // login with password
      }
    }).catch(e => {
      common.showError(e?.data.messages)
    })
}

const loginWithSMS = async () => {
  state.loginSMSData = await fetchApi.post(apiPath.SendSmsCode,
    {
      body: {
        mobile: state.mobile,
      }
    });

  if (state.loginSMSData.error) {
    common.showError(state.loginSMSData.error.message)
  }
  else {
    state.status = 2
  }
}

const forgot = () => {
  user.setMobile(state.mobile)

  axiosApi().post(apiPath.ForgotPassword, {
    mobile: state.mobile
  }).then(r => {
    router.push('/auth/forgot')

  }).catch(e => {
    common.showError(e?.data?.messages)
  }).finally(() => {

  })

}

const sendVerifySms = async () => {
  user.setMobile(state.mobile)

  await axiosApi().post(apiPath.SendSmsCode, {
    mobile: state.mobile
  }).then(r => {
    router.push('/auth/verify')
  }).catch(e => {
    common.showError(e?.data?.messages)
  })
}

// const validator = {
//   mobileNumber: [
//     value => {
//       if (value == "admin") return true
//       if (/^0?9[0-9]{9}$/.test(value)) return true
//       return 'شماره وارد شده اشتباه است.'
//     },
//   ]
// }

/*const parseInputToInt = () => {
  if (state.mobile) {
    state.mobile = parseInt(state.mobile, 10)
  }
}*/

</script>
<template>
  <v-card max-width="400" width="330px" class="mt-n16 pt-2 bg-transparent border-lg border-warning">
    <v-card-text class="py-3">
      <v-form fast-fail @submit.prevent="checkMobile" ref="verifyForm" v-if="state.status == 0">
        <v-text-field
            v-model="state.mobile"
            variant="outlined"
            :maxlength="10"
            class="text-left mb-1"
            dir="ltr"
            id="username"
            suffix="98+"
            name="username"
            :rules="validator.auth.mobileNumber"
            label="شماره همراه"
            focused
            autofocus="true"
            @input="parseInputToInt"
        ></v-text-field>
        <hr><br />
        <v-btn type="submit" variant="tonal" color="info" block size="x-large" >
          <h2 style="font-size: 1rem;">ورود یا ثبت نام</h2>
        </v-btn>
      </v-form>
      <div class="d-flex justify-center align-center mb-5 ga-1" v-if="state.status > 0">
        <h2 style="font-size: 1rem;">موبایل:</h2>
        {{ state.mobile }}
        <a href="javascript:void(0)"><small @click="state.status = 0">تغییر شماره</small></a>
      </div>

      <LoginWithPassword :mobile="state.mobile" v-if="state.status == 1" />
      <LoginWithSMS :mobile="state.mobile" v-if="state.status == 2" />

<!--      <v-divider></v-divider>-->
<!--      <div class="d-flex justify-center pt-5 pb-3" v-if="state.status == 1">-->

<!--      </div>-->



    </v-card-text>
  </v-card>
  <v-card v-if="state.status == 1" max-width="400" width="330px" class="mt-5 pt-2 bg-transparent border-lg border-warning">
    <v-row>
      <v-col cols="6" class="border-e-md">
        <v-btn @click="forgot" block variant="plain" title="فراموشی کلمه عبور">
          <v-icon>mdi-lock</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="6" class="">
        <v-btn @click="loginWithSMS" block variant="plain" title="ورود با پیامک">
          <v-icon>mdi-email</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>