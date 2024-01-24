<script setup>
const router = useRouter();
const state= reactive({
  pagination: {
    pageIndex: 0,
    pageSize:0,
    totalPages:0,
    totalCount: 0,
  },
  records: [],
})

//#region GET
onMounted(async()=>{
  await getData()
});

const getData = async () => {
  await axiosApi().post(apiPath.ExpertOrderPagination,state.pagination)
  .then((res)=>{
    state.records = res.data
    state.pagination = res.metadata
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
  })
}

const changePageing = () => {
  router.replace({ path: '/account/service', query: { size: state.pagination.pageSize, index: state.pagination.pageIndex }})

  setTimeout(() => {
    getData()
  }, 50);
}
//#endregion

</script>

<template>
  <fieldset class="myFieldset rounded-xl mb-5">
    <h3>خدمات ارائه شده</h3>
  </fieldset>

  <fieldset class="myFieldset rounded-xl">
    <v-table>
      <thead>
      <tr>
        <th v-for="header in ['ردیف','نام و نام خانوادگی','زمان (دقیقه)','هزینه']">{{ header }}</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in state.records" :key="item.id">
        <td>{{ ((state.pagination.pageIndex - 1) * state.pagination.pageSize + index) + 1 }}</td>
        <td>{{ `${item.userFirstName} ${item.userLastName}` }}</td>
        <td>{{ item.consultationTime }}</td>
        <td>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
        <td class="text-left pa-0 ma-0 justify-end">
          <v-btn class="h-100" color="light-blue-accent-1" variant="tonal" rounded="0" :to="`/account/service/prescription/${item.id}`">
            <v-icon>mdi-note-plus</v-icon>
          </v-btn>
        </td>
      </tr>
      </tbody>
    </v-table>
    <v-pagination :length="state.pagination.totalPages" v-model="state.pagination.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </fieldset>

</template>