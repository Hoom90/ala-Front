<script setup>
const route = useRoute()
const router = useRouter()


dashboardbreadcrumbstore().setBreadCrumbs([
  {
    title: 'مشاوران ',
    disabled: true,
    to: '/dashboard/expert/list',
  }])

const state = reactive({
  users: [],
  dialogDelete: false,
  currentUser: {},
  search: null,
  page: {
    size: route.query?.size ?? 10,
    index: route.query?.index ?? 1,
    total: 1,
    totalPage: 1,
  },
  table: {
    headers: ["ردیف", "نام", "نام خانوادگی", "شماره تماس", "تاریخ عضویت", "وضعیت"]
  }
})

//#region GET
const getData = () => {
  axiosApi().post(apiPath.Expert.get.paged, state.page)
    .then((res) => {
      state.users = res.data
    }).catch((error) => {
      common.showError(error?.data?.messages)
    })
}

getData()
//#endregion

const changePageing = () => {
  router.replace({ path: '/dashboard/expert/list', query: { size: state.page.size, index: state.page.index } })

  setTimeout(() => {
    getData()
  }, 50);
}

const handleDelete = (row) => {
  state.currentUser = row
  state.dialogDelete = true
}

const deleteData = (r) => {
  if (r) {
    axiosApi().delete(apiPath.Expert.delete(state.currentUser.id))
      .then(r => {
        common.showMessage('مشاور حذف شد')
        getData()
      }).catch(e => {
        common.showError(e?.data?.messages)
      })
  }
  close()
}

const close = () => {
  state.dialogDelete = false
}

</script>
<template>
  <v-toolbar class="mb-5" color="white" elevation="1" rounded>
    <v-toolbar-title>مشاوران</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <v-card>
    <v-card-text class="d-flex pa-3">
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="8"></v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-text-field v-model="state.search" variant="outlined" @input="common.callDelay(getData)" density="compact"
            label="جستجو" placeholder="جستجو در نام و موبایل" hide-details=""></v-text-field>
        </v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-select v-model="state.page.size" :items="constract.pageSize" variant="outlined" density="compact"
            label="تعداد نمایش" @update:modelValue="changePageing" hide-details></v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-table>
      <thead>
        <tr>
          <th v-for="item in state.table.headers" class="text-center">
            {{ item }}
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in state.users" :key="item.id" class="text-center">
          <td>{{ ((state.page.index - 1) * state.page.size + i) + 1 }}</td>
          <td>{{ item.firstName }}</td>
          <td>{{ item.lastName }}</td>
          <td>{{ item.phoneNumber }}</td>
          <td>{{ dateConverter.convertToJalali(item.createdOn) }}</td>
          <td>
            <v-chip color="green" v-if="item.isConfirm">تایید شده</v-chip>
            <v-chip color="red" v-else>در انتظار</v-chip>
          </td>
          <td>
            <div class="float-left">
              <v-btn variant="tonal" color="info" :to="'/dashboard/expert/' + item.id">ویرایش</v-btn>
              <v-btn variant="tonal" color="info" class="mx-2" :to="'/dashboard/expert/Schedule/' + item.id">زمانبندی</v-btn>
              <v-btn variant="tonal" color="warning"  @click="handleDelete(item)">حذف</v-btn>
              <!-- account/orders/api/admin/Schedule -->
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination :length="state.page.totalPage" v-model="state.page.index" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </v-card>


  <mj-dialog v-model="state.dialogDelete" title="حذف مشاور" :action-btn="true" action-btn-text="حذف شود"
    :cancel-btn="true" action-type="error" @action-callback="deleteData" size="sm">
    <p>مشاور {{ state.currentUser.firstName }} {{ state.currentUser.lastName }} حذف می شود.<br />آیا اطمینان دارید؟</p>
  </mj-dialog>
</template>
<style>
.page-size-select .v-input__control {
  width: 100px;
}
</style>