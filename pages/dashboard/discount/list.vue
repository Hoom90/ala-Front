<script setup>

const state = reactive({
  table: {
    size: 10,
    totalPage: 0,
    index: 0,
    headers: ["ردیف", "عنوان", "کد تخفیف", "تاریخ انقضا"],
    items: null,
  },
  modal: {
    isDelete: false,
  },
  selectedItem: {
    id: null,
    title: null,
    ticketcode: null,
    expirationDate: null,
    amount: null,
    maxDiscount: null,
    percentDiscount: null,
    discountTypeId: null,
    dicountLimitationTypeId: null,
    users: [],
    experts: [],
    categories: [],
  },
  datePicker: false,
  danger: false
})

//#region GET
const getData = async () => {
  dashboardbreadcrumbstore().setBreadCrumbs([
    {
      title: 'کوپن ها',
      disabled: true,
      to: '/dashboard/discount/list',
    }])
  await axiosApi().get(apiPath.Discount.get.all)
    .then((res) => {
      if (res.failed) {
        common.showError(res.messages)
      }
      state.items = res.data
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}

getData()
//#endregion

//#region DELETE
const deleteData = async () => {
  if (res) {
    await axiosApi().delete(apiPath.Discount.delete + state.selectedItem.id)
      .then((res) => {
        if (res.failed) {
          common.showError(res.messages)
        }
        else {
          common.showMessage("حذف انجام شد!")
        }
      })
      .catch((error) => {
        common.showError(error?.data?.messages)
      })
  }
  close()
}
//#endregion

//#region MODAL
const generateDeleteForm = () => {
  state.modal.isDelete = true
  state.selectedItem = item
}

const close = () => {
  state.modal.isDelete = false
}
//#endregion

</script>
<template>
  <v-toolbar class="mb-5" color="white" elevation="1" rounded>
    <v-toolbar-title>کوپن های تخفیف</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn type="info" to="/dashboard/discount/add" class="bg-blue-grey-lighten-1">ایجاد کوپن تخفیف جدید</v-btn>
  </v-toolbar>

  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="8"></v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-text-field type="search" variant="outlined" density="compact" label="جستجو" hide-details=""></v-text-field>
        </v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-select v-model="state.table.size" :items="constract.pageSize" variant="outlined" density="compact"
            label="تعداد نمایش" @update:modelValue="changePageing" hide-details></v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-table size="x-large">
      <thead>
        <tr>
          <th v-for="header in state.table.headers">{{ header }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in state.table.items" v-if="state.table.items" :key="item.id">
          <td>{{ i + 1 }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.ticketcode }}</td>
          <td>{{ dateConverter.convertToJalali(item.expirationDate) }}</td>
          <td>
            <div class="float-left">
              <v-btn variant="tonal" color="info" class="mx-2" :to="`/dashboard/discount/edit/${item.id}?name=${item.title}`">ویرایش</v-btn>
              <v-btn variant="tonal" color="warning" @click="generateDeleteForm(item)">حذف</v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div v-if="!state.table.items" class="text-center pa-5">کوپن تخفیف ای یافت نشد</div>

    <v-pagination :length="state.table.totalPage" v-model="state.table.index" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>

  </v-card>
   <!-- delete item modal -->
   <mj-dialog v-model="state.modal.isDelete" :title="'حذف ' + state.selectedItem.title" :action-btn="true"
    action-btn-text="حذف شود" :cancel-btn="true" action-type="error" @action-callback="deleteData" size="sm">
    <p>دسته '{{ state.selectedItem.title }}' حذف می شود.<br />آیا مطمئن هستید؟ عملیات حذف غیر قابل بازگشت است!</p>
  </mj-dialog>
</template>