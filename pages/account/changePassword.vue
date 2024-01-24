<script setup>
import validator from "@/composables/validator";


const verifyForm = ref({});

const state = reactive({
  password: {}
})

onMounted(() => {

})


const save = async () => {
  const { valid } = await verifyForm.value.validate()
  if (!valid) {
    common.showError('موارد ضروری را وارد کنید')
    return
  }

  await axiosApi().post(apiPath.ChangePassword, state.password)
    .then((res) => {
      state.password={}
      common.showMessage("کلمه عبور با موفقیت تغییر کرد")
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}


</script>

<template>
  <fieldset class="myFieldset rounded-xl mb-5">
    <h3>تغییر کلمه عبور</h3>
  </fieldset>
  <fieldset class="myFieldset rounded-xl">
    <v-row class="justify-center">
      <v-col cols="6">
        <v-form @submit.prevent="save" ref="verifyForm">
          <v-text-field variant="outlined" type="password" v-model="state.password.oldPassword" :rules="validator.auth.password"
            label="کلمه عبور قبلی"></v-text-field>
          <v-text-field variant="outlined" type="password" v-model="state.password.newPassword" :rules="validator.auth.password"
            label="کلمه عبور جدید"></v-text-field>
          <v-text-field variant="outlined" type="password" v-model="state.password.rePassword" :rules="validator.auth.password"
            label="تکرار کلمه عبور جدید"></v-text-field>
          <v-btn class="bg-info" type="submit" size="large" block>ذخیره کلمه عبور</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </fieldset>
</template>

<style scoped></style>