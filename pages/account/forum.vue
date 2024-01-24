<script setup>
import validator from "@/composables/validator"
const verifyForm = ref({});
const router = useRouter();
const state= reactive({
  pagination: {
    pageIndex: 0,
    pageSize:0,
    totalPages:0,
    totalCount: 0,
  },
  records: [],
  category: [],
  current: {},
  currentTitle: '',
  addModal:false,
  editModal:false,
  deleteModal:false,
})

//#region GET
onMounted(async()=>{
  await getData()
  await getCategory()
});

const getData = async () => {
  await axiosApi().post(apiPath.ExpertTopic.post.pagination,state.pagination)
  .then((res)=>{
    state.records = res.data
    state.pagination = res.metadata
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
  })
}

const getCategory = async () =>{
  await axiosApi().post(apiPath.public.Category.post,{})
  .then((res)=>{
    state.category = res.data
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
  })
}

const changePageing = () => {
  router.replace({ path: '/account/forum', query: { size: state.pagination.pageSize, index: state.pagination.pageIndex }})

  setTimeout(() => {
    getData()
  }, 50);
}
//#endregion

//#region POST
const postData = async (r) =>{
  if(r){
    const { valid } = await verifyForm.value.validate()
    if (!valid) return

    await axiosApi().post(apiPath.ExpertTopic.post.add,state.current)
    .then((res)=>{
      common.showMessage(res.message)
      getData()
    })
    .catch((error)=>{
      common.showError(error?.data?.messages)
    })
  }
  state.dialogAdd = false
  state.newTopic={
    title:null,
    description:null,
    categoryId:null,
    isActive:true,
  }
  state.addModal = false
  state.current = {}
}
//#endregion

//#region EDIT
const editData = async (r) =>{
  if(r){
    const { valid } = await verifyForm.value.validate()
    if (!valid) return

    let payload = {
      id: state.current.id,
      title: state.current.title,
      isActive: state.current.isActive,
      description: state.current.description,
      categoryId: state.current.categoryId,
    }
    await axiosApi().put(apiPath.ExpertTopic.put,payload)
    .then((res)=>{
      common.showMessage(res.messages)
      getData()
    })
    .catch((error)=>{
      common.showError(error.messages)
    })
  }
  state.editModal = false
  state.current = {}
}
//#endregion

//#region DELETE
const deleteData = async (r) =>{
  if(r){
    await axiosApi().delete(apiPath.ExpertTopic.delete(state.current.id))
    .then(res=>{
      common.showMessage(res.messages)
      getData()
    })
    .catch(error=>{
      common.showError(error?.data?.messages)
    })
  }
  state.deleteModal = false
  state.current = {}
}
//#endregion

const handleAdd = () =>{
  state.addModal = true
  state.current = {}
}

const handleEdit = (item) =>{
  state.editModal = true
  state.current = {...item}
  state.currentTitle = {...item}.title
}

const handleDelete = (item) =>{ 
  state.deleteModal = true
  state.current = item
}

</script>

<template>
  <fieldset class="myFieldset rounded-xl mb-5 d-flex align-center">
    <h3>تالار های گفتگوی من</h3>
    <v-spacer></v-spacer> 
    <v-btn color="info" variant="tonal" @click="handleAdd">افزودن تاپیک جدید</v-btn>
  </fieldset>

  <fieldset class="myFieldset rounded-xl">
    <v-table>
      <thead>
      <tr>
        <th v-for="header in ['ردیف','عنوان','دسته بندی','وضعیت','تاریخ ایجاد']">{{ header }}</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in state.records" :key="item.id">
        <td>{{ ((state.pagination.pageIndex - 1) * state.pagination.pageSize + index) + 1 }}</td>
        <td>
          <nuxt-link :to="`/topic/${item.categoryId}/${item.id}`">
            <span class="text-black">{{ item.title }}</span>
          </nuxt-link>
        </td>
        <td>{{ item.categoryTitle }}</td>
        <td>
          <v-chip v-if="item.isActive" color="green">فعال</v-chip>
          <v-chip v-else color="red">غیرفعال</v-chip>
        </td>
        <td>{{ dateConverter.convertToJalali(item.createdOn) }}</td>
        <td class="text-left pa-0 ma-0 justify-end">
          <v-btn class="h-100" color="info" variant="tonal" rounded="0" :to="`/topic/${item.categoryId}/${item.id}`">
            <v-icon>mdi-eye-outline</v-icon>
          </v-btn>
          <v-btn class="h-100" color="green" variant="tonal" rounded="0" @click="handleEdit(item)">
            <v-icon>mdi-pen</v-icon>
          </v-btn>
          <v-btn class="h-100" color="red" variant="tonal" rounded="0" @click="handleDelete(item)">
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </td>
      </tr>
      </tbody>
    </v-table>
    <v-pagination :length="state.pagination.totalPages" v-model="state.pagination.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </fieldset>

  <mj-dialog v-model="state.addModal" title="تاپیک جدید افزودن" :action-btn="true" :cancel-btn="true" action-type="primary"
    @action-callback="postData" size="sm">
    <v-form @submit.prevent="postData" ref="verifyForm">

      <v-text-field v-model="state.current.title" variant="outlined" label="عنوان" :rules="validator.category.title"></v-text-field>

      <v-select
        :items="state.category"
        v-model="state.current.categoryId"
        label="انتخاب دسته"
        variant="outlined"
        item-title="title"
        item-value="id"
        :rules="validator.category.categoryId"
      ></v-select>

      <v-textarea v-model="state.current.description" variant="outlined" label="توضیحات" :rules="validator.description"></v-textarea>
    </v-form>
  </mj-dialog>

  <mj-dialog v-model="state.editModal" :title="`ویرایش < ${state.currentTitle} >`" :action-btn="true" :cancel-btn="true" action-type="primary"
    @action-callback="editData" size="sm">
    <v-form @submit.prevent="editData" ref="verifyForm">

      <v-text-field v-model="state.current.title" variant="outlined" label="عنوان" :rules="validator.category.title"></v-text-field>

      <v-select
        :items="state.category"
        v-model="state.current.categoryId"
        label="انتخاب دسته"
        variant="outlined"
        item-title="title"
        item-value="id"
        :rules="validator.category.categoryId"
      ></v-select>

      <v-textarea v-model="state.current.description" variant="outlined" label="توضیحات"></v-textarea>
    </v-form>
  </mj-dialog>

  <mj-dialog v-model="state.deleteModal" title="حذف" :action-btn="true" action-btn-text="حذف شود"
    :cancel-btn="true" action-type="error" @action-callback="deleteData" size="sm">
    <p>{{ state.current.title }} حذف می شود.<br />آیا اطمینان دارید؟</p>
  </mj-dialog>
</template>
