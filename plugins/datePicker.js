import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker'

export default defineNuxtPlugin(({ vueApp } ) => {
    vueApp.component('DatePicker', Vue3PersianDatetimePicker)
})