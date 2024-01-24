<script setup>
import validator from "@/composables/validator"
const verifyForm = ref({});
const state = reactive({
  categoryList : [],
  selectedCategory : null,
  tableData : null,
  addModal : false,
  deleteModal : false,
  editModal: false,
  newResult: {
    id:null,
    categoryId:0,
    title: null,
    defaultValue: null,
  },
  oldState: null,
})

//#region GET
onMounted(async ()=>{
  await getCategory()
})

const getCategory = async () =>{
  await axiosApi().get(apiPath.Category.get.all)
  .then((res)=>{
    state.categoryList = res.data;
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
  })
}

const getResult = async () =>{
  await axiosApi().get(apiPath.Result.get.byCategoryId(state.selectedCategory))
  .then((res)=>{
    state.tableData = res.data
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
  })
}
//#endregion

//#region POST
const postData = async (r) =>{
  if(r){
    const { valid } = await verifyForm.value.validate()
    if (!valid) return
    state.newResult.categoryId = state.selectedCategory
    await axiosApi().post(apiPath.Result.post,state.newResult)
    .then((res)=>{
      common.showMessage(res.messages)
      state.newResult.id = res.data
      state.tableData.push(state.newResult)
    })
    .catch((error)=>{
      common.showError(error?.data?.messages)
    })
  }
  state.addModal = !state.addModal
  resetNewResult()
}
//#endregion

//#region DELETE
const deleteData = async (r) =>{
  if(r){
    await axiosApi().delete(apiPath.Result.delete(state.newResult.id))
    .then((res)=>{
      common.showMessage(res.messages)
      const index = state.tableData.indexOf(state.newResult);
      state.tableData.splice(index, 1);
    })
    .catch((error)=>{
      common.showError(error?.data?.messages)
    })
  }
  state.deleteModal = !state.deleteModal
  resetNewResult()
}
//#endregion

//#region PUT
const putData = async (r) =>{
  if(r){
    const { valid } = await verifyForm.value.validate()
    if (!valid) return
    await axiosApi().put(apiPath.Result.put,state.newResult)
    .then((res)=>{
      common.showMessage(res.messages)
      const index = state.tableData.indexOf(state.oldState)
      state.tableData.splice(index, 1)
      state.tableData.push(state.newResult)
    })
    .catch((error)=>{
      common.showError(error?.data?.messages)
    })
  }
  state.editModal = !state.editModal
  resetNewResult()
}
//#endregion

const resetNewResult = () =>{
  state.newResult= {
    id:null,
    categoryId:0,
    title: null,
    defaultValue: null,
  }
}

//#region MODAL
const handlePost = () =>{
  resetNewResult()
  state.addModal = !state.addModal
}

const handleDelete = (item) =>{
  state.newResult = item
  state.newResult.categoryId = null
  state.deleteModal = !state.deleteModal
}

const handleEdit = (item) =>{
  state.newResult = {...item}
  state.oldState = item
  state.newResult.categoryId = null
  state.editModal = !state.editModal
}
//#endregion

</script>
<template>
  <v-toolbar class="mb-5" :elevation="1" color="white" rounded>
    <v-toolbar-title>نسخه های پیشفرض</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="6" sm="6" md="8">
          <v-btn color="primary" variant="tonal" :disabled="state.tableData ? false : true" @click="handlePost">
            اضافه کردن فیلد جدید به نسخه
          </v-btn>
        </v-col>
        <v-col cols="12" xs="6" sm="6" md="4">
          <v-autocomplete label="دسته بندی مشاوره" variant="outlined" v-model="state.selectedCategory" :items="state.categoryList"
            item-title="fullTitle" item-value="id">
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" @click="getResult" :class="{ 'text-center selected': !item?.raw?.selectable }"
              :disabled="!item?.raw?.selectable" :title="item?.raw?.fullTitle"></v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <th v-for="header in [{title:'ردیف'},{title:'عنوان'},{title:'مقدار اولیه'}]">
              {{header.title}}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item,index) in state?.tableData"
            :key="index"
          >
            <td>{{ index+1 }}</td>
            <td>{{ item?.title }}</td>
            <td>{{ item?.defaultValue }}</td>
            <td class="text-left">
              <v-btn color="orange" class="ml-3" variant="tonal" @click="handleEdit(item)">ویرایش</v-btn>
              <v-btn color="red" variant="tonal" @click="handleDelete(item)">حذف</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>

  <mj-dialog v-model="state.addModal" title="افزودن نتیجه جدید" :action-btn="true"
    :cancel-btn="true" @action-callback="postData" size="sm">
    <v-form @submit.prevent="postData" ref="verifyForm">
      <v-text-field v-model="state.newResult.title" :rules="validator.result.title" variant="outlined" label="عنوان"></v-text-field>
      <v-text-field v-model="state.newResult.defaultValue" variant="outlined" label="مقدار اولیه"></v-text-field>
    </v-form>
  </mj-dialog>

  <mj-dialog v-model="state.editModal" :title="`ویرایش ${state.oldState?.title}`" :action-btn="true"
    :cancel-btn="true" @action-callback="putData" size="sm">
    <v-form @submit.prevent="putData" ref="verifyForm">
      <v-text-field v-model="state.newResult.title" :rules="validator.result.title" variant="outlined" label="عنوان"></v-text-field>
      <v-text-field v-model="state.newResult.defaultValue" variant="outlined" label="مقدار اولیه"></v-text-field>
    </v-form>
  </mj-dialog>

  <mj-dialog v-model="state.deleteModal" title="حذف مقاله" :action-btn="true" action-btn-text="حذف شود"
    :cancel-btn="true" action-type="error" @action-callback="deleteData" size="sm">
    <p>{{ state.newResult.title }} حذف می شود.<br />آیا اطمینان دارید؟<br/>تمام نسخه های مربوط هم حذف خواهند شد!</p>
  </mj-dialog>
</template>