<script setup>
const route= useRoute()
const state = reactive({
  data: null,
  val: null,
})


onMounted(async ()=>{
  await getData()
})

const getData = async () =>{
  await axiosApi().get(apiPath.UserCounselingResultOrder(route.params.id))
  .then((res)=>{
    state.data = res.data
    state.val = state.data.resultItems
  })
  .catch((error) =>{
    common.showError(error?.data?.messages)
  })
}

</script>
<template>
  <fieldset class="myFieldset rounded-xl mb-5">
    <v-row>
      <v-col>
        <h3>نسخه شما</h3>
      </v-col>
      <v-col class="text-left">
        <v-btn color="blue" variant="tonal" to="/account/order/">بازگشت به خدمات</v-btn>
      </v-col>
    </v-row>
  </fieldset>
  <fieldset class="myFieldset rounded-xl">
    <div class="my-5" v-if="state.data">
      <v-list density="compact" :lines="false">
        <v-list-item><span>مدت زمان مشاوره: </span><span>{{ state.data?.duration }}</span><span> دقیقه</span></v-list-item>
        <v-list-item v-for="(field,index) in state.data.resultItems"><span>{{ field.title?? `تجویز ${index+1}` }}: </span><span>{{ state.val[index].value }}</span></v-list-item>
        <v-list-item><span>توضیحات بیشتر: </span><span>{{ state.data.summary }}</span></v-list-item>
      </v-list>
    </div>
  </fieldset>
</template>


<style>

</style>