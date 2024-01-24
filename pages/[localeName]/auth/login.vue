<script setup>
// import fetchData from "@/plugins/httpClient";
// import storage from "@/composables/localStorage";

const { $swal } = useNuxtApp();

setPageLayout("auth");
const state = reactive({
    captcha: null,
    mobile: null,
    password: null,
    captchaCode: null,

    data: {}
})


const reloadCaptcha = async () => {
    state.captcha = await httpClient.get("auth/captcha");
}

reloadCaptcha();

const login = async () => {
    state.data = await httpClient.post("auth/login-with-password",
        {
            body: {
                mobile: state.mobile,
                password: state.password,
                captchaToken: state.captcha?.data?.data?.token,
                captchaCode: state.captchaCode
            }
        });

    if (state.data.error) {
        $swal.fire({
            title: "خطا",
            text: state.data.error.message,
            icon: 'error',
            confirmButtonText: 'باشه',
            timer: 5000,
        });
    }
    else
    {
        debugger
        localStorage.setToken(state.data?.data?.data?.token)
    }
}

</script>
<template>
    <!-- {{ state.captcha }} -->

    mobile:
    <v-text-field v-model="state.mobile"></v-text-field>
    password:
    <v-text-field v-model="state.password" type="password"></v-text-field>
    captcha:
    <v-text-field v-model="state.captchaCode"></v-text-field>
    <br>
    <img v-if="!state.captcha.pending" :src="`data:image/png;base64,${state.captcha.data?.data?.image??''}`"
        width="150" />
    <v-btn @click="reloadCaptcha">Reload</v-btn>
    <hr>
    <v-btn @click="login">login</v-btn>

    <hr>
    {{ state.data }}
</template>