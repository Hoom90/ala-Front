<script setup>
import validator from "@/composables/validator"
const verifyForm = ref({});
const route = useRoute()
const router = useRouter()
const state = reactive({
  data: [],
  categoryData:[],
  dialogDelete: false,
  dialogEdit: false,
  dialogAdd: false,
  current: {},
  currentTitle: '',
  search: null,
  page: {
    size: route.query?.size ?? 10,
    index: route.query?.index ?? 1,
  },
  pagination: {},
  dialog: [],
})

//#region GET
onMounted(async()=>{
  dashboardbreadcrumbstore().setBreadCrumbs([
    {
      title: 'تالار گفتگو ',
      disabled: true,
      to: '/dashboard/forum/list',
    }])
  await getAllCategory()

    await getData()
})

const getData = async () => {
  if(route.query){
    state.pagination = {
      pageIndex: route.query?.index,
      pageSize: route.query?.size
    }
  }
  await axiosApi().post(apiPath.Topic.post.pagination, state.pagination)
    .then((res) => {
      state.data = res.data
      state.pagination = res.metadata
    }).catch((error) => {
      common.showError(error?.data?.messages)
    })
}

const getAllCategory = async () => {
  if(state.categoryData.length == 0)
  await axiosApi().post(apiPath.public.Category.post,{})
  .then((res)=>{
    state.category =res.data
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
  })
}

//#endregion

const postData = async (r) =>{
  if(r){
    const { valid } = await verifyForm.value.validate()
    if (!valid) return

    await axiosApi().post(apiPath.Topic.post.add,state.current)
    .then(res=>{
      common.showMessage(res.messages)
      getData()
    })
    .catch(error=>{
      common.showError(error.messages)
    })
  }
  state.dialogAdd = false
  state.current = {}
}

//#region DELETE
const deleteData = async (r) =>{
  if(r){
    await axiosApi().delete(apiPath.Topic.delete.byId(state.current.id))
    .then(res=>{
      common.showMessage(res.messages)
      getData()
    })
    .catch(error=>{
      common.showError(error?.data?.messages)
    })
  }
  state.dialogDelete = false
  state.current = {}
}
//#endregion

//#region EDIT
const editData = async (r) =>{
  if(r){
    const { valid } = await verifyForm.value.validate()
    if (!valid) return
    await axiosApi().put(apiPath.Topic.put,state.current)
    .then(res=>{
      common.showMessage(res.messages)
      getData()
    }
    )
    .catch(error=>{
      common.showError(error?.data?.messages)
    })
  }
  state.dialogEdit = false
  state.current = {}
}
//#endregion

const changePageing = () =>{
  router.replace({ path: '/dashboard/forum/list', query: { size: state.pagination.pageSize, index: state.pagination.pageIndex }})

  setTimeout(() => {
    getData()
  }, 50);
}

const handleAdd = async () =>{
  state.dialogAdd = true
  state.current = {}
}

const handleDelete = (item) =>{
  state.dialogDelete = true
  state.current = item
}

const handleEdit = async (item) =>{
  await getAllCategory()
  state.dialogEdit = true
  state.current = {...item}
  state.currentTitle = {...item}.title
}

</script>

<template>
  <v-toolbar class="mb-5" color="white" elevation="1" rounded>
    <v-toolbar-title>تالار گفتگو</v-toolbar-title>
    <v-spacer></v-spacer> 
    <v-btn color="info" variant="tonal" @click="handleAdd">افزودن تاپیک جدید</v-btn>
  </v-toolbar>

  <v-card>
    <v-card-text class="d-flex pa-3">
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="8"></v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-text-field variant="outlined" @input="common.callDelay(getData)" density="compact"
            label="جستجو" placeholder="جستجو در نام و موبایل" hide-details=""></v-text-field>
        </v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-select v-model="state.pagination.pageSize" :items="constract.pageSize" variant="outlined" density="compact"
            label="تعداد نمایش" @update:modelValue="changePageing" hide-details></v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-table>
      <thead>
        <tr>
          <th v-for="item in ['ردیف', 'عنوان', 'نویسنده', 'تعداد پست', 'دسته بندی', 'تاریخ ایجاد', 'وضعیت']" class="text-center">
            {{ item }}
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in state.data" :key="item.id" class="text-center">
          <td>{{ ((state.pagination.pageIndex - 1) * state.pagination.pageSize + index) + 1 }}</td>
          <td>
            <nuxt-link :to="`/post/${item.id}`">
              <span class="text-black">{{ item.title }}</span>
            </nuxt-link>
          </td>
          <!-- <td>
            <div class="text-center">
              <v-btn
                color="primary"
                @click="state.dialog[index] = true"
              >
              مشاهده
                <v-dialog
                  v-model="state.dialog[index]"
                  width="auto"
                >
                  <v-card>
                    <v-card-text>
                      {{ item.description }}
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="primary" block @click="state.dialog[index] = false">بستن</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-btn>
            </div>
          </td> -->
          <td>{{ `${item.expertFirstName} ${item.expertLastName}` }}</td>
          <td>{{ item.postCount }}</td>
          <td>{{ item.categoryTitle }}</td>
          <td>
            {{ dateConverter.convertToJalali(item.createdOn) }}
          </td>
          <td>
            <v-chip v-if="!item.isActive" color="red">غیرفعال</v-chip>
            <v-chip v-else color="success">فعال</v-chip>
          </td>
          <td>
            <div class="float-left d-flex ga-1">
              <v-btn variant="tonal" color="info" :to="`/post/${item.id}`">مشاهده</v-btn>
              <v-btn variant="tonal" color="info" :to="`/dashboard/forum/${item.categoryId}/${item.id}`">پست ها</v-btn>
              <v-btn variant="tonal" color="info" @click="handleEdit(item)">ویرایش</v-btn>
              <!-- <v-btn variant="tonal" color="info" @click="handleClose(item)">بستن</v-btn> -->
              <v-btn variant="tonal" color="warning"  @click="handleDelete(item)">حذف</v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination :length="state.pagination.totalPages" v-model="state.pagination.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </v-card>

  <mj-dialog v-model="state.dialogAdd" title="افزودن تاپیک جدید" :action-btn="true" :cancel-btn="true" action-type="primary"
    @action-callback="postData" size="sm">
    <v-form @submit.prevent="postData" ref="verifyForm">

      <v-text-field v-model="state.current.title" variant="outlined" label="عنوان*" :rules="validator.forum.title"></v-text-field>

      <v-select
        :items="state.category"
        v-model="state.current.categoryId"
        label="انتخاب دسته*"
        variant="outlined"
        item-title="title"
        item-value="id"
        :rules="validator.forum.categoryId"
      ></v-select>

      <v-textarea v-model="state.current.description" variant="outlined" label="توضیحات*" :rules="validator.forum.description"></v-textarea>
    </v-form>
  </mj-dialog>

  <mj-dialog v-model="state.dialogEdit" :title="`ویرایش < ${state.currentTitle} >`" :action-btn="true" :cancel-btn="true" action-type="primary"
    @action-callback="editData" size="sm">
    <v-form @submit.prevent="editData" ref="verifyForm">

      <v-text-field v-model="state.current.title" variant="outlined" label="عنوان*" :rules="validator.forum.title"></v-text-field>

      <v-select
        :items="state.category"
        v-model="state.current.categoryId"
        label="انتخاب دسته*"
        variant="outlined"
        item-title="title"
        item-value="id"
        :rules="validator.forum.categoryId"
      ></v-select>

      <v-textarea v-model="state.current.description" variant="outlined" label="توضیحات*" :rules="validator.forum.description"></v-textarea>
    </v-form>
  </mj-dialog>

  <mj-dialog v-model="state.dialogDelete" title="حذف" :action-btn="true" action-btn-text="حذف شود"
    :cancel-btn="true" action-type="error" @action-callback="deleteData" size="sm">
    <p>{{ state.current.title }} حذف می شود.<br />آیا اطمینان دارید؟</p>
  </mj-dialog>
</template>
