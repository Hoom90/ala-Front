<script setup>

const route = useRoute()
const router = useRouter()
dashboardbreadcrumbstore().setBreadCrumbs([
  {
    title: 'اخبار ',
    disabled: true,
    to: '/dashboard/news/list',
  }]
)

const state = reactive({
  page: {
    size: route.query?.size ?? 10,
    index: route.query?.index ?? 1,
    total: 1,
    totalPage: 1
  },
  newsList: [],
  dialogDelete: false,
  current: {}
})

const load = async () => {
  await axiosApi().post(apiPath.News.get.list, {
    contentType: 1,
    pageIndex: state.page.index,
    pageSize: state.page.size,
  }).then(r => {
    state.newsList = r.data;
    state.page.total = r.metadata.totalCount
    state.page.totalPage = r.metadata.totalPages
  }).catch(e => {
    common.showError(e?.data?.messages)
  })
}
load()

const changePageing = () => {
  router.replace({ path: '/dashboard/news/list', query: { size: state.page.size, index: state.page.index } })

  setTimeout(() => {
    load()
  }, 50);
}

const handleDelete = (row) => {
  state.dialogDelete = true
  state.current = row
}
const acceptDelete = async (r) => {
  if(r)
  await axiosApi().delete(apiPath.News.delete + state.current?.id).then(r => {
    common.showMessage("خبر با موفقیت حذف شد")
    load()
  }).catch(e => {
    common.showError(e?.data?.messages)
  })  
  .finally(()=>(state.dialogDelete=false))
  else
  state.dialogDelete=false
}

</script>



<template>
  <v-toolbar class="mb-5" :elevation="1" color="white" rounded>
    <v-toolbar-title>اخبار</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn to="/dashboard/news/add" variant="tonal" color="info">ایجاد خبر جدید</v-btn>
  </v-toolbar>

  <v-card>
    <v-card-text>
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
    <v-table size="x-large">
      <thead>
        <tr>
          <th>ردیف</th>
          <th>عنوان</th>
          <th>تاریخ ایجاد</th>
          <th>وضعیت</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in state.newsList" :key="item.id">
          <td>{{ ((state.page.index - 1) * state.page.size + index) + 1 }}</td>
          <td>{{ item.title }}</td>
          <td>{{ dateConverter.convertToJalali(item.createdOn) }}</td>
          <td>
            <v-chip color="red" v-if="item.status == 1">آرشیو</v-chip>
            <v-chip color="success" v-else>منتشر شده</v-chip>
          </td>
          <td class="text-center">
            <div class="float-left">
              <v-btn variant="tonal" color="info" class="mx-2" :to="'/dashboard/news/edit/' + item.id" >ویرایش</v-btn>
              <v-btn variant="tonal" color="warning" @click="handleDelete(item)">حذف</v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination
        :total-visible="6"
        :length="state.page.totalPage" v-model="state.page.index" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>

  </v-card>


  <mj-dialog v-model="state.dialogDelete" title="حذف خبر" :action-btn="true" action-btn-text="حذف شود"
    :cancel-btn="true" action-type="error" @action-callback="acceptDelete" size="sm">
    <p>خبر {{ state.current.title }} حذف می شود.<br />آیا اطمینان دارید؟</p>
  </mj-dialog>
</template>
