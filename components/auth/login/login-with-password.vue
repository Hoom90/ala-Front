<script setup>
const { $swal } = useNuxtApp();
const loginForm = ref({});
const router = useRouter();
const route = useRoute();
const props = defineProps(['mobile'])

const state = reactive({
    password: null,
    loginData: {},
    captcha: {},
    captchaCode: null
})

const login = async () => {
    const { valid } = await loginForm.value.validate()
    if (!valid) return

    state.loginData = await axiosApi().post("auth/login-with-password",
        {
            mobile: props.mobile.toString(),
            password: state.password,
            captchaToken: state.captcha?.data?.token,
            captchaCode: state.captchaCode
        }).then(r => {
            localStorage.setToken(r.data?.token)
            
            userInfo()
        }).catch(e => {
            common.showError(e.data?.messages)
        })
}

const userInfo = () => {
    axiosApi().get("account/user-info").then(r => {
        localStorage.saveUser(r.data)
        common.showMessage("ورود با موفقیت انجام شد")
        if(route.query.redirecturl){
            router.push(route.query.redirecturl)
        }
        else{
            router.push("/")
        }
    }).catch(e => {
        common.showError(e.data?.messages)
    }).finally(() => {

    })
}


const reloadCaptcha = async () => {
    state.captcha = await axiosApi().get("auth/captcha");
}

reloadCaptcha();

const validator = {
    password: [
        value => {
            if (value?.length >= 6) return true
            return 'کلمه عبور وارد شده اشتباه است.'
        },
    ],
    captcha: [
        value => {
            if (value?.length == 6) return true
            return 'کد وارد شده اشتباه است.'
        },
    ]
}
</script>
<template>
    <v-form fast-fail @submit.prevent="login" ref="loginForm">

        <v-text-field v-model="state.password" type="password" variant="outlined" class="text-center mb-1"
            :rules="validator.password" label="کلمه عبور" autofocus></v-text-field>



<!--        <v-text-field v-model="state.captchaCode" variant="outlined" class="text-center mb-1 pa-0" :rules="validator.captcha"-->
<!--            label="متن امنیتی">-->
<!--          <img :src="`data:image/png;base64,${state.captcha?.data?.image ?? ''}`" width="150" />-->
<!--&lt;!&ndash;          <v-icon @click="reloadCaptcha" class="mr-auto ml-5">mdi-reload</v-icon>&ndash;&gt;-->
<!--        </v-text-field>-->



        <div class="d-flex align-center border rounded overflow-hidden" style="border-color: #939393 !important">
          <img :src="`data:image/png;base64,${state.captcha?.data?.image ?? ''}`" width="150" @click="reloadCaptcha" />
          <v-text-field v-model="state.captchaCode" variant="plain" class="captchaText" placeholder="******" :rules="validator.captcha" hide-details="auto"></v-text-field>
        </div>

        <v-divider class="my-5"></v-divider>

        <v-btn type="submit" variant="tonal" block size="x-large" class="w-100">ورود </v-btn>

    </v-form>
</template>
<style>
.captchaText input{
  text-align: center;
  padding-top: 10px;
}
</style>