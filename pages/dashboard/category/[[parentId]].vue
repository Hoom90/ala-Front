<script setup>
import validator from "@/composables/validator"
const route = useRoute()
const verifyForm = ref({});

dashboardbreadcrumbstore().setBreadCrumbs([
  {
    title: 'دسته ها ',
    disabled: true,
    to: '/dashboard/category',
  }])

const state = reactive({
  categories: [],
  dialogAdd: false,
  parents: [],
  categoryData: {
    id: null,
    title: null,
    sort: 0,
    description: null,
    parentId: route.params.parentId == '' ? null : route.params.parentId
  },
  // page: {
  //   pageSize: 0,
  //   pageIndex: 0,
  // },
  // parentId: null,
  selectedData: null,
  formTitle: null,
  dialogDelete: false,
})

const resetForm = () => {
  state.categoryData.id = null
  state.categoryData.title = null
  state.categoryData.sort = 0
  state.categoryData.description = null
}


//#region GET
const getData = async () => {

  await axiosApi().post(apiPath.Category.get.paged, {parentId: state.categoryData.parentId})
    .then((res) => {
      if(res.failed){
        common.showError(res.messages)
        return
      }
      state.categories = res.data;
      if (state.categoryData.parentId) {
        parents()
      }
    })
    .catch(e => {
      common.showError(e?.data?.messages)
    })
}

getData()
//#endregion

//#region POST
const postData = async () => {
  await axiosApi().post(apiPath.Category.post, state.categoryData)
    .then((res) => {
      common.showMessage("دسته ثبت شد")
      getData()
      resetForm()
      close()
    }).catch((error) => {
      common.showError(error?.data?.messages)
    })
    .finally(() => {
    })
}
//#endregion

//#region PUT
const putData = async () => {
  await axiosApi().put(apiPath.Category.update, state.categoryData)
    .then((res) => {
      common.showMessage("دسته ویرایش شد")
      getData()
      resetForm()
    }).catch((error) => {
      common.showError(error?.data?.messages)
    })
    .finally(() => {
      close()
    })
}
//#endregion

//#region DELETE
const deleteData = async (r) => {
  if (r) {
    await axiosApi().delete(apiPath.Category.delete + state.categoryData.id)
      .then(r => {
        getData()
        common.showMessage('این دسته حذف شد.')
      }).catch(e => {
        common.showError(e?.data?.messages)
      })
  }
  close()
}
//#endregion

const parents = async () => {
  await axiosApi().get(apiPath.Category.get.parents + route.params.parentId)
    .then(r => {
      let list = []
      for (const item of r.data?.parents) {
        list.push({
          title: item.title,
          disabled: false,
          to: '/dashboard/category/' + item.id,
        })
      }
      dashboardbreadcrumbstore().setBreadCrumbs([
        {
          title: 'دسته ها ',
          disabled: false,
          to: '/dashboard/category',
        }, ...list,
        {
          title: r.data.title,
          disabled: true,
          to: '/dashboard/category/',
        }])

    }).catch(e => {
      common.showError(e?.data?.messages)
    })
}


const save = async (r) => {
  if (r) {
    const { valid } = await verifyForm.value.validate()
    if (!valid) return

    if (state.categoryData.id) {
      putData()
    }
    else {
      postData()
    }
  }
  else {
    close()
  }
}

const close = () => {
  state.dialogAdd = false
  state.dialogDelete = false
  state.dialogView = false
  resetForm()
}

const handleShowDialog = (row) => {
  if (row) {
    state.dialogAdd = true
    state.categoryData = { ...row }
    state.formTitle = "ویرایش"
    state.isEdit = true
  }
  else {
    state.dialogAdd = true;
    state.formTitle = 'افزودن'
    state.isEdit = false

  }
}

const handleDelete = (data) => {
  state.categoryData = data
  state.dialogDelete = true
}

</script>

<template>
  <v-toolbar class="mb-5" color="white" elevation="1" rounded>
    <v-toolbar-title>دسته بندی</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn type="info" @click="handleShowDialog()" class="bg-blue-grey-lighten-1">ایجاد دسته جدید</v-btn>
  </v-toolbar>

  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="10"></v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-text-field type="search" variant="outlined" density="compact" label="جستجو" hide-details=""></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-table>
      <thead>
        <tr>
          <th> ردیف </th>
          <th> عنوان </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in state.categories" :key="item.id">
          <td>{{ i + 1 }}</td>
          <td>{{ item.title }}</td>
          <td>
            <div class="float-left">
              <!-- <v-btn variant="tonal" color="info" @click="handleView(item)">مشاهده</v-btn> -->
              <v-btn variant="tonal" color="info" class="mr-2" :to="'/dashboard/category/' + item.id">زیر دسته</v-btn>
              <v-btn variant="tonal" color="info" class="mx-2" @click="handleShowDialog(item)">ویرایش</v-btn>
              <v-btn variant="tonal" color="warning" @click="handleDelete(item)">حذف</v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>

  <!-- new item form / edit item form -->
  <mj-dialog v-model="state.dialogAdd" :title="state.formTitle + ' دسته بندی '" :action-btn="true"
    :action-btn-text="state.isEdit ? 'تایید' : 'اضافه شود'" :cancel-btn="true" action-type="primary"
    @action-callback="save" size="sm">
    <v-form @submit.prevent="save" ref="verifyForm">

      <v-text-field v-model="state.categoryData.title" variant="outlined" label="عنوان*"
        :rules="validator.category.title"></v-text-field>

      <v-text-field v-model="state.categoryData.sort" type="number" variant="outlined" label="جایگاه"></v-text-field>

      <v-textarea v-model="state.categoryData.description" variant="outlined" label="توضیحات"></v-textarea>
      <button class="d-none"></button>
    </v-form>
  </mj-dialog>

  <!-- delete item form -->
  <mj-dialog v-model="state.dialogDelete" :title="'حذف ' + state.categoryData.title" :action-btn="true"
    action-btn-text="حذف شود" :cancel-btn="true" action-type="error" @action-callback="deleteData" size="sm">
    <p>
      دسته '{{ state.categoryData.title }}' حذف می شود.
      <br />
      آیا مطمئن هستید؟ عملیات حذف غیر قابل بازگشت است!
    </p>

  </mj-dialog>
</template>