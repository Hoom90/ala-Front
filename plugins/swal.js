import swal from 'sweetalert2'
// import 'sweetalert2/dist/sweetalert2.min.css';


    // const $swal = {
    //     install: (Vue, options) => {
    //         Vue.config.globalProperties.$swal = Swal.mixin(options);
    //     },
    // }
    export default defineNuxtPlugin((nuxtApp) => {
        nuxtApp.provide('swal', swal)
        // nuxtApp.vueApp.use($swal, {
        //     reverseButtons: true,
        //     confirmButtonText: "confirmText",
        //     cancelButtonText: "cancelText",
        //     confirmButtonColor: "#84bd00",
        // });
    });