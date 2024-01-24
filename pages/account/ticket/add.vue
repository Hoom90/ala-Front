<script setup>
const router =useRouter()
const verifyForm = ref({})
const state = reactive({
  ticket: {
    title: null,
    description: null,
    requestType: 2,
    department: null,
    state: 1,
    parentId: null,
  },
})

const postTicket = async () =>{
  const { valid } = await verifyForm.value.validate()
  if (!valid) return
  
  await axiosApi().post(apiPath.User.Ticket.post.add,state.ticket)
  .then((res)=>{
    common.showMessage(res.messages)
    router.push(`/account/ticket/${res.data}`)
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
  })
}

const validator = {
  title: [
    value => {
      if (value) return true
      return 'مقدار وارد شده اشتباه است.'
    },
  ],
  department: [
    value => {
      if (value) return true
      return 'مقدار وارد شده اشتباه است.'
    },
  ],
  description: [
    value => {
      if (value) return true
      return 'مقدار وارد شده اشتباه است.'
    },
  ],
}

</script>

<template>
  <fieldset class="myFieldset rounded-xl d-flex align-center mb-5">
    <h3>ارسال تیکت</h3>
    <div class="mr-auto">
      <v-btn variant="tonal" class="rounded-pill" to="/account/ticket/list">بازگشت به لیست</v-btn>
    </div>
  </fieldset>
  <fieldset class="myFieldset rounded-xl">
    <v-form @submit.prevent="postTicket" ref="verifyForm">
      <v-row class="justify-center align-center">
        <v-col cols="12" md="7" lg="6">
          <v-text-field v-model="state.ticket.title" :rules="validator.title" variant="outlined" label="عنوان" maxlength = "50" counter></v-text-field>
          <v-select v-model="state.ticket.department" :rules="validator.department" variant="outlined" label="ارسال به" :items="constract.ticketRecievers" item-value="id" item-title="title"></v-select>
          <v-textarea v-model="state.ticket.description" :rules="validator.description" label="متن تیکت" maxlength = "200" variant="outlined" counter></v-textarea>
          <v-btn block variant="tonal" type="submit" color="blue">ارسال</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </fieldset>
</template>
