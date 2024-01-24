<script setup>
const route = useRoute()
const router = useRouter()


dashboardbreadcrumbstore().setBreadCrumbs([
  {
    title: 'کاربران ',
    disabled: true,
    to: '/dashboard/user/list',
  }])

const state = reactive({
  users: [],
  dialogDelete: false,
  currentUser: {},
  dialogExpert: false,
  page: {
    size: route.query?.size ?? 10,
    index: route.query?.index ?? 1,
    total: 1,
    totalPage: 1
  },
  table: {
    headers: ["ردیف", "نام", "نام خانوادگی", "شماره تماس"]
  }
})

const load = () => {
  axiosApi().get(apiPath.Users.get.paged(route.query?.index, route.query?.size))
    .then(r => {
      state.users = r.data
      state.page.total = r.metadata.totalCount
      state.page.totalPage = r.metadata.totalPages
      if (state.users.expertId) {
        state.isExpert = true
      }
    }).catch(e => {
      common.showError(e?.data?.messages)
    }).finally(() => {

    })
}

load()

const changePageing = () => {
  router.replace({ path: '/dashboard/user/list', query: { size: state.page.size, index: state.page.index } })

  setTimeout(() => {
    load()
  }, 50);
}

const handleDelete = (row) => {
  state.currentUser = row
  state.dialogDelete = true
}

const acceptDelete = (r) => {
  if (r) {
    axiosApi().delete(apiPath.Users.delete(state.currentUser.id))
      .then(r => {
        load()
        common.showMessage('کاربر حذف شد')
      }).catch(e => {
        common.showError(e?.data?.messages)
      }).finally(() => {

      })
  }
  state.dialogDelete = false
}

const handelExpert = (row) => {
  state.currentUser = row
  state.dialogExpert = true
}

const acceptExpert = (r) => {
  if (r) {
    axiosApi().post(apiPath.Expert.post, {userId:state.currentUser.id})
      .then(res => {
        common.showMessage("مشاور ثبت شد ")
        load()
        // router.push(`/dashboard/expert/${res.data}`)
      }).catch(e => {
        common.showError(e?.data?.messages)
      })
  }
  state.dialogExpert = false
}


</script>
<template>
  <v-toolbar class="mb-5" color="white" elevation="1" rounded>
    <v-toolbar-title>کاربران</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn class="bg-blue-grey-lighten-1" to="/dashboard/user/" size="large">
      <v-icon class="ml-2">mdi-plus-circle-multiple</v-icon>
      افزودن کاربر
    </v-btn>
  </v-toolbar>
  <v-card>
    <v-card-text class="d-flex pa-3">
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="8"></v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-text-field type="search" variant="outlined" density="compact" label="جستجو" hide-details=""></v-text-field>
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
          <th v-for="item in state.table.headers">
            {{ item }}
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in state.users" :key="item.id">
          <td>{{ ((state.page.index - 1) * state.page.size + i) + 1 }}</td>
          <td>{{ item.firstName }}</td>
          <td>{{ item.lastName }}</td>
          <td>{{ item.phoneNumber }}</td>
          <td>
            <div class="float-left">
              <v-btn variant="tonal" color="info" @click="handelExpert(item)" v-if="!item.expertId">تعیین به مشاور</v-btn>
              <!-- <v-btn variant="tonal" color="info" :to="'/dashboard/expert?userId=' + item.id" >تعیین به مشاور</v-btn> -->
              <v-btn variant="tonal" color="info" class="mx-2" :to="'/dashboard/user/' + item.id">ویرایش</v-btn>
              <v-btn variant="tonal" color="warning" @click="handleDelete(item)" v-if="item.id != 1">حذف</v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination :length="state.page.totalPage" v-model="state.page.index" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </v-card>

  <mj-dialog v-model="state.dialogDelete" title="حذف کاربر" :action-btn="true" action-btn-text="حذف شود"
    :cancel-btn="true" action-type="error" @action-callback="acceptDelete" size="sm">
    <p>
      کاربر {{ state.currentUser.firstName }} {{ state.currentUser.lastName }} حذف می شود.
      <br />
      آیا اطمینان دارید؟
    </p>

  </mj-dialog>

  <mj-dialog v-model="state.dialogExpert" title="تعیین مشاور" :action-btn="true" action-btn-text="ثبت مشاور"
    :cancel-btn="true" action-type="info" @action-callback="acceptExpert" size="sm">
    <p>
      کاربر {{ state.currentUser.firstName }} {{ state.currentUser.lastName }} به لیست مشاورین اضافه می شود.
      <br />
      آیا اطمینان دارید؟
    </p>

  </mj-dialog>
</template>
<style>
.page-size-select .v-input__control {
  width: 100px;
}
</style>