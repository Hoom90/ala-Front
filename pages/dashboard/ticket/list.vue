<script setup>
const router = useRouter()
const route = useRoute()
dashboardbreadcrumbstore().setBreadCrumbs([
  {
    title: 'تیکت ها ',
    disabled: true,
    to: '/dashboard/ticket',
  }])

const state = reactive({
  pagination: {
    pageIndex: 0,
    pageSize:0,
    totalPages:0,
    totalCount: 0,
  },
  ticketList: [],
})

//#region GET
onMounted(async () => {
  await getData()
})

const getData = async () => {
  if(route.query){
    state.pagination = {
      pageIndex: route.query?.index,
      pageSize: route.query?.size
    }
  }
  await axiosApi().post(apiPath.Ticket.post.pagination,state.pagination)
    .then((res) => {
      state.ticketList = res.data
      state.pagination = res.metadata
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}

const changePageing = () => {
  router.replace({ path: '/dashboard/ticket/list', query: { size: state.pagination.pageSize, index: state.pagination.pageIndex }})

  setTimeout(() => {
    getData()
  }, 50);
}

//#endregion

const handleStateColor = (state) => {
  let ticketState =constract.ticketState
  let color =null 
  ticketState.forEach(item=>{
    if(state == item.id){
      color = item.color
    }
  });
  return color
}

const handleDepartmentTitle = (departmentId) => {
  let department = constract.ticketRecievers
  let departmentTitle = null
  department.forEach(item => {
    if (departmentId == item.id) {
      departmentTitle = item.title
    }
  })
  return departmentTitle
}

const handleDelete = async (item) =>{
  await axiosApi().delete(apiPath.Ticket.delete(item.id))
  .then((res)=>{
    common.showMessage(res.messages)
    let index = state.ticketList.indexOf(t => t.id == item.id)
    state.ticketList.splice(index,1)
  })
  .catch((error) => {
    common.showError(error?.data?.messages)
  })
}

</script>
<template>
  <v-toolbar class="mb-5" :elevation="1" color="white" rounded>
    <v-toolbar-title>تیکت ها</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="8"></v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-text-field type="search" variant="outlined" density="compact" label="جستجو" hide-details=""></v-text-field>
        </v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-select v-model="state.pagination.pageSize" :items="constract.pageSize" variant="outlined" density="compact"
            label="تعداد نمایش" @update:modelValue="changePageing" hide-details></v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-table size="x-large">
      <thead>
        <tr>
          <th>ردیف</th>
          <th>عنوان</th>
          <th>گیرنده</th>
          <th>تاریخ ایجاد</th>
          <th>وضعیت</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in state.ticketList" :key="index">
        <td>{{ ((state.pagination.pageIndex - 1) * state.pagination.pageSize + index) + 1 }}</td>
        <td>{{ item.title }}</td>
        <td>{{ handleDepartmentTitle(item.department) }}</td>
        <td>{{ dateConverter.someTimeAgo(item.createdOn) }}</td>
        <td>
          <v-chip :color="handleStateColor(item.state)">{{ item.stateTitle }}</v-chip>
        </td>
        <td>
          <div class="float-left">
            <v-btn variant="tonal" color="info" class="mx-2" :to="`/dashboard/ticket/${item.id}`">بررسی</v-btn>
            <v-btn variant="tonal" color="warning" @click="handleDelete(item)">حذف</v-btn>
          </div>
        </td>
      </tr>
      </tbody>
    </v-table>
    <v-pagination total-visible="6" :length="state.pagination.totalPages" v-model="state.pagination.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </v-card>

  <!-- <mj-dialog v-model="state.dialogDelete" title="حذف مقاله" :action-btn="true" action-btn-text="حذف شود"
    :cancel-btn="true" action-type="error" @action-callback="acceptDelete" size="sm">
    <p>مقاله {{ state.current.title }} حذف می شود.<br />آیا اطمینان دارید؟</p>
  </mj-dialog> -->
</template>

