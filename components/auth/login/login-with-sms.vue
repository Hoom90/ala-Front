<script setup>

const { $swal } = useNuxtApp();
const loginForm = ref({});
const router = useRouter();
const route = useRoute();
const props = defineProps(['mobile'])

const state = reactive({
    token: null,
    loginData: {},
})

const login = async () => {
    const { valid } = await loginForm.value.validate()
    if (!valid) return

    axiosApi().post("auth/login-with-sms", {
        mobile: props.mobile,
        smsToken: state.token,
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


const validator = {
    token: [
        value => {
            if (value?.length >= 6) return true
            return 'متن امنیتی وارد شده اشتباه است.'
        },
    ],
}
</script>
<template>
    <v-form fast-fail @submit.prevent="login" ref="loginForm">
        <div class="my-2">
            <p>
                متن پیامکی که برای شما ارسال شده را وارد کنید
            </p>
        </div>
        <v-text-field v-model="state.token" variant="outlined" class="text-center mb-1" :rules="validator.token"
            label="متن پیامک"></v-text-field>

        <hr><br /><v-divider></v-divider>
        <v-btn type="submit" variant="tonal" block size="x-large" class="w-100">ورود </v-btn>

    </v-form>
</template>