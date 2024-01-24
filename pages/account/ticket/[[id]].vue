<script setup>
const verifyForm = ref({})
const route = useRoute()
const state = reactive({
  data: [],
  answerModal: false,
  ticket: {
    title: null,
    description: null,
    requestType: 2,
    department: 0,
    parentId: null
  },
})

//#region GET
onMounted(async () => {
  await getData()
})

const getData = async () => {
  await axiosApi().get(apiPath.User.Ticket.getbyId(route.params.id))
    .then((res) => {
      state.data = res.data
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}
//#endregion

const postTicket = async (r) =>{
  if(!r){
    state.answerModal = false
    return
  }
  
  const { valid } = await verifyForm.value.validate()
  if (!valid) return

  state.ticket.title = state.data.title
  state.ticket.parentId = state.data.id
  state.ticket.department = state.data.department
  await axiosApi().post(apiPath.User.Ticket.post.add,state.ticket)
  .then((res)=>{
    common.showMessage(res.messages)
    state.answerModal = false
    getData()
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
  })
}

const handleStateColor = (state) => {
  let ticketState = constract.ticketState
  let color = null
  ticketState.forEach(item => {
    if (state == item.id) {
      color = item.color
    }
  });
  return color
}

const validator = {
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
    <h3>{{ `تیکت ${state.data.title}` }}</h3>
    <div class="mr-auto">
      <v-chip :color="handleStateColor(state.data.state)" variant="outlined">{{ state.data.stateTitle }}</v-chip>
      <v-btn variant="tonal" class="rounded-pill mr-3" color="info" to="/account/ticket/list">بازگشت</v-btn>
    </div>
  </fieldset>

  <fieldset class="myFieldset rounded-xl">
    <v-card-text>

      <v-card variant="tonal" class="mb-3 w-50">
        <template v-slot:title>
          {{ `تیکت ${state.data?.title} به بخش ${state.data?.departmentTitle}` }}
        </template>

        <template v-slot:text>
          {{ state.data?.description }}
        </template>
        <v-divider></v-divider>
        <v-card-actions>
          <v-row>
            <!-- <v-col>
              <v-chip :color="handleStateColor(state.data.state)" variant="outlined">{{ state.data.stateTitle }}</v-chip>
            </v-col> -->
            <v-col class="text-left">
              <v-chip>{{ dateConverter.someTimeAgo(state.data.createdOn) }}</v-chip>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>

      <v-card variant="tonal" :class="ticket.requestType == 2 ? 'mb-3 mr-auto w-50' : 'mb-3 w-50'" v-for="(ticket, index) in state.data?.children" :key="index">
        <!-- <template v-slot:title>
          {{ `جواب تیکت:` }}
        </template> -->

        <template v-slot:text>
          {{ ticket.description }}
        </template>
        <v-divider></v-divider>

        <v-card-actions>
          <v-row>
            <!-- <v-col>
              <v-chip :color="handleStateColor(ticket.state)" variant="outlined">{{ ticket.stateTitle }}</v-chip>
            </v-col> -->
            <v-col class="text-left">
              <v-chip>{{ dateConverter.someTimeAgo(ticket.createdOn) }}</v-chip>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>

      <v-row
        v-if="state.data.children && (state.data.children[state.data.children?.length - 1]?.state == 6 || state.data.children[state.data.children?.length - 1]?.state == 5)">
        <v-col class="text-left">
          <v-btn variant="tonal" color="blue" @click="state.answerModal = !state.answerModal">جواب دادن</v-btn>
        </v-col>
      </v-row>

    </v-card-text>
  </fieldset>


  <mj-dialog v-model="state.answerModal" :action-btn="true" :cancel-btn="true" @action-callback="postTicket" size="sm">
    <v-form @submit.prevent="postTicket" ref="verifyForm">
      <v-textarea v-model="state.ticket.description" :rules="validator.description" label="متن تیکت" maxlength = "200" variant="outlined" counter></v-textarea>
    </v-form>
  </mj-dialog>
</template>


<style></style>