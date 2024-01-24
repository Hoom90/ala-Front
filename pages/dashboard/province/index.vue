<script setup>
import validator from "@/composables/validator"
const verifyForm = ref({});
const route = useRoute();
const state = reactive({
  data: [],
  newItem: {
    id: null,
    title: null,
    parentId: null,
  },
  breadcrumb: {
    parentId: null,
    title: null,
  },
  addEditModalState: false,
  deleteModalState: false,
  formTitle: null,
  modalTitle: null,
  // editedIndex: -1,
})

//#region GET
onMounted(async () => {
  state.formTitle = route.query?.id ? 'شهر ' : 'استان '
  if (route.query?.id) {
    state.breadcrumb = {
      parentId: route.query?.id,
      title: route.query?.name,
    }
    getCity()
  }
  else {
    getProvince()
  }
})

watch(() => route.query, () => {
  state.formTitle = route.query?.id ? 'شهر ' : 'استان '
  if (route.query?.id) {
    state.breadcrumb = {
      parentId: route.query?.id,
      title: route.query?.name,
    }
    getCity()
  }
  else {
    getProvince()
  }
})

const getProvince = async () => {
  await axiosApi().get(apiPath.Province.get.list)
    .then(res => {
      state.data = res.data
      dashboardbreadcrumbstore().setBreadCrumbs([
        {
          title: 'استان ها ',
          disabled: true,
          to: '/dashboard/province',
        }])
    }).catch(error => {
      common.showError(error?.data?.messages)
    })
}

const getCity = async () => {
  await axiosApi().get(apiPath.Province.get.byParent(state.breadcrumb.parentId))
    .then(res => {
      state.data = res.data
      dashboardbreadcrumbstore().setBreadCrumbs([
        {
          title: 'استان ها',
          disabled: false,
          to: '/dashboard/province',
        },
        {
          title: state.breadcrumb.title,
          disabled: true,
          to: '/dashboard/province/',
        }])
    }).catch(e => {
      common.showError(e?.data?.messages)
    })
}
//#endregion

//#region DELETE
const deleteData = async (r) => {
  if (r) {
    await axiosApi().delete(apiPath.Province.delete + state.newItem.id)
      .then(res => {
        common.showMessage(res.messages)
        if (route.query?.id) {
          state.breadcrumb = {
            parentId: route.query?.id,
            title: route.query?.name,
          }
          getCity()
        }
        else {
          getProvince()
        }
      }).catch(e => {
        common.showError(error?.data?.messages)
      })
  }
  close()
}
//#endregion

//#region POST
const postNewCity = async () => {
  state.newItem.parentId = state.breadcrumb.parentId
  await axiosApi().post(apiPath.Province.post, state.newItem)
    .then(res => {
      common.showMessage(res.messages)
      if (route.query?.id) {
        state.breadcrumb = {
          parentId: route.query?.id,
          title: route.query?.name,
        }
        getCity()
      }
      else {
        getProvince()
      }
    })
    .catch(error => {
      common.showError(error?.data?.messages)
    })
  close()
}
//#endregion

//#region PUT
const putNewCity = async () => {
  await axiosApi().put(apiPath.Province.update, state.newItem)
    .then(res => {
      common.showMessage(res.messages)
      if (route.query?.id) {
        state.breadcrumb = {
          parentId: route.query?.id,
          title: route.query?.name,
        }
        getCity()
      }
      else {
        getProvince()
      }
    })
    .catch(error => {
      common.showError(error?.data?.messages)
    })
  close()
}
//#endregion

//#region MODAL
const close = () => {
  state.deleteModalState = false
  state.addEditModalState = false
}

const editItem = (item) => {
  state.addEditModalState = !state.addEditModalState
  state.modalTitle = "ویرایش"
  state.newItem = { ...item }
}

const deleteItem = (item) => {
  state.newItem = item
  state.deleteModalState = true
}

const addModal = () => {
  state.addEditModalState = !state.addEditModalState
  state.modalTitle = "افزودن"
  state.newItem = {
    title: null,
    parentId: null,
  }
}

const handleSave = async (r) => {
  if (r) {
    const { valid } = await verifyForm.value.validate()
    if (!valid) return
    if (state.modalTitle === "افزودن") {
      postNewCity()
    }
    else {
      putNewCity()
    }
  }
  close()
}
//#endregion

</script>

<template>
  <v-toolbar class="mb-5" color="white" elevation="1" rounded>
    <v-toolbar-title>{{ state.formTitle }}ها</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn type="info" class="bg-blue-grey-lighten-1" @click="addModal">افزودن {{ state.formTitle }}
      جدید</v-btn>
  </v-toolbar>

  <v-card>
    <v-card-text class="d-flex pa-3">
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
          <th v-for="item in ['ردیف', 'نام']">{{ item }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in state.data" :key="item.id">
          <td>{{ i + 1 }}</td>
          <td>{{ item.title }}</td>
          <td>
            <div class="float-left">
              <v-btn variant="tonal" color="info" :to="`/dashboard/province?id=${item.id}&name=${item.title}`"
                v-if="!item.parentId">شهرها</v-btn>
              <v-btn variant="tonal" color="info" class="mx-2" @click="editItem(item)">ویرایش</v-btn>
              <v-btn variant="tonal" color="warning" @click="deleteItem(item)">حذف</v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>

  <!-- new item form / edit item form -->
  <mj-dialog v-model="state.addEditModalState" :title="state.modalTitle + ' ' + state.formTitle + ' جدید'"
    :action-btn="true" :cancel-btn="true" action-type="primary" @action-callback="handleSave" size="sm">
    <v-form @submit.prevent="handleSave" ref="verifyForm">
      <v-text-field v-model="state.newItem.title" :label="`نام ${state.formTitle}*`" variant="outlined"
        :rules="validator.province.title"></v-text-field>
    </v-form>
  </mj-dialog>

  <!-- delete item form -->
  <mj-dialog v-model="state.deleteModalState" :title="`حذف ${state.newItem.title}`" :action-btn="true"
    action-btn-text="حذف شود" :cancel-btn="true" action-type="error" @action-callback="deleteData" size="sm">
    <p>
      '{{ state.newItem.title }}' حذف می شود.
      <br />
      آیا مطمئن هستید؟ عملیات حذف غیر قابل بازگشت است!
    </p>

  </mj-dialog></template>