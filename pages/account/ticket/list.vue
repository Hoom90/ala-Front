<script setup>
const router = useRouter()
const route = useRoute();
const state= reactive({
  records: [],
  pagination: {
    pageIndex: 0,
    pageSize:0,
    totalPages:0,
    totalCount: 0,
  },
})

//#region GET
onMounted(async()=>{
  await getData()
})

const getData = async()=>{
  if(route.query){
    state.pagination = {
      pageIndex: route.query?.index,
      pageSize: route.query?.size
    }
  }
  await axiosApi().post(apiPath.User.Ticket.post.pagination,state.pagination)
  .then((res)=>{
    state.records = res.data
    state.pagination = res.metadata
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
  })
}

const changePageing = () => {
  router.replace({ path: '/account/ticket/list', query: { size: state.pagination.pageSize, index: state.pagination.pageIndex }})

  setTimeout(() => {
    getData()
  }, 50);
}
//#endregion

const handleStateColor = (state) => constract.ticketState.find(x=>x.id==state)?.color

</script>

<template>
  <fieldset class="myFieldset rounded-xl d-flex align-center mb-5">
    <h3>لیست تیکت ها</h3>
    <div class="mr-auto">
      <v-btn variant="tonal" class="rounded-pill" color="info" to="/account/ticket/add">ارسال تیکت جدید</v-btn>
    </div>
  </fieldset>

  <fieldset class="myFieldset rounded-xl">
    <v-table>
      <thead>
      <tr>
        <th class="text-center">عنوان</th>
        <th class="text-center">گیرنده</th>
        <th class="text-center">تاریخ ارسال</th>
        <th class="text-center">وضعیت</th>
        <th class="text-center"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in state.records" :key="item.id">
        <td class="text-center">{{ item.title }}</td>
        <td class="text-center">{{ item.departmentTitle }}</td>
        <td class="text-center">{{ dateConverter.convertToJalali(item.createdOn) }}</td>
        <td class="text-center">
          <v-chip :color="handleStateColor(item.state)">{{ item.stateTitle }}</v-chip>
        </td>
        <td class="text-center">
          <v-btn color="blue" variant="tonal" @click="router.push(`/account/ticket/${item.id}`)">مشاهده</v-btn>
        </td>
      </tr>
      </tbody>
    </v-table>
    <v-pagination :length="state.pagination.totalPages" v-model="state.pagination.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </fieldset>
</template>

<style scoped>

</style>