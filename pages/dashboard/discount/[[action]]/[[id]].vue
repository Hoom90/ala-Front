<script setup>
const route = useRoute();
const router = useRouter();
const state = reactive({
  formTitle: null,
  status: {
    isAdd: true,
    isEdit: false,
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
  users:[],
  experts:[],
  categories:[],
  datePicker: false,
})

//#region GET
const getData = async () => {
  const params = route.params.id == '' ? null : route.params.id
  state.formTitle = "افزودن کوپن جدید"
  dashboardbreadcrumbstore().setBreadCrumbs([
      {
        title: 'کوپن ها',
        disabled: false,
        to: '/dashboard/discount/list',
      }])
  if (params) {
    const id = params
    const name = route.query.name
    state.formTitle = "ویرایش کوپن " + name
    state.status.isAdd = false
    state.status.isEdit = true
    dashboardbreadcrumbstore().setBreadCrumbs([
      {
        title: 'کوپن ها',
        disabled: false,
        to: '/dashboard/discount/list',
      },
      {
        title: name,
        disabled: true,
        to: '/dashboard/discount/',
      }])
    await axiosApi().get(apiPath.Discount.get.single(id))
      .then((res) => {
        if (res.failed) {
          common.showError(res.messages)
        }
        state.selectedItem = res.data
      })
      .catch((error) => {
        common.showError(error?.data?.messages)
        routeToHome()
      })
  }
}

const getUsers = async() =>{
  await axiosApi().get(apiPath.Users.get.paged(route.query?.index, route.query?.size))
  .then((res)=>{
    if(res.failed){
      common.showError(res.messages)
    }
    let data = res.data
    data.forEach(item => {
      state.users.push({id:item.id,title:`${item.firstName} ${item.lastName}`})
    });
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
    routeToHome()
  })
}

const getExperts = async () =>{
  let body = {
  "pageSize": 0,
  "pageIndex": 0,
  "searchFilters": [
    {
      "field": "string",
      "operator": 0,
      "value": "string"
    }
  ],
  "id": 0,
  "sortBy": "string"
}
  await axiosApi().get(apiPath.Expert.get.paged,body)
  .then((res)=>{
    if(res.failed){
      common.showError(res.messages)
    }
    state.experts = res.data
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
    // routeToHome()
  })
}

const getCategories = async () =>{
  await axiosApi().get(apiPath.Category.get.list)
  .then((res)=>{
    if(res.failed){
      common.showError(res.messages)
    }
    state.categories = res.data
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
    routeToHome()
  })
}

getData()
getUsers()
getExperts()
getCategories()
//#endregion

//#region POST 
const postData = async () => {
  await axiosApi().post(apiPath.Discount.post, state.selectedItem)
    .then((res) => {
      if (res.failed) {
        common.showError(res.messages)
      }
      else {
        common.showMessage("آیتم افزوده شد!")
        routeToHome()
      }
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}
//#endregion

//#region PUT
const putData = async () => {
  await axiosApi().put(apiPath.Discount.update, state.selectedItem)
    .then((res) => {
      if (res.failed) {
        common.showError(res.messages)
      }
      else {
        common.showMessage("تغییرات انجام شد!")
        routeToHome()
      }
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}
//#endregion

//#region DELETE
const deleteData = async () => {
  await axiosApi().delete(apiPath.Discount.delete(state.selectedItem.id))
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
//#endregion



const routeToHome = ()=>{
  router.push("/dashboard/discount/list")
}

</script>
<template>
  <v-row class="justify-center">
    <v-col cols="12" md="8" lg="6">
      <v-card>
        <v-card-title primary-title>
          {{ state.formTitle }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="state.selectedItem.title" variant="outlined" label="عنوان"
                :readonly="state.disabled"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="state.selectedItem.ticketcode" type="number" variant="outlined" label="کد تخفیف"
                :readonly="state.disabled"></v-text-field>
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field variant="outlined" id="expirationDate" placeholder="تاریخ انقضا"
                append-inner-icon="mdi-calendar-month-outline" @click="state.datePicker = true" clearable
                :readonly="state.disabled">
              </v-text-field>
              <date-picker v-model="state.selectedItem.expirationDate" :show="state.datePicker" :editable="true" simple
                format="YYYY-MM-DD" display-format="jYYYY/jMM/jDD" custom-input="#expirationDate"
                @close="state.datePicker = false" clearable />
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field v-model="state.selectedItem.amount" variant="outlined" label="تعداد"
                :readonly="state.disabled"></v-text-field>
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field v-model="state.selectedItem.maxDiscount" variant="outlined" label="maxDiscount"
                :readonly="state.disabled"></v-text-field>
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field v-model="state.selectedItem.percentDiscount" variant="outlined" label="percentDiscount"
                :readonly="state.disabled"></v-text-field>
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field v-model="state.selectedItem.discountTypeId" variant="outlined" label="discountTypeId"
                :readonly="state.disabled"></v-text-field>
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field v-model="state.selectedItem.dicountLimitationTypeId" variant="outlined"
                label="dicountLimitationTypeId" :readonly="state.disabled"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-combobox
                v-model="state.selectedItem.users"
                :items="state.users"
                :item-title="state.users.title"
                :item-value="state.users.id"
                chips
                clearable
                label="کاربران"
                multiple
                prepend-icon="mdi-filter-variant"
                variant="solo"
                :readonly="state.disabled"
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :model-value="selected"
                    closable
                    @click="select"
                    @click:close="remove(item)"
                  >
                    <strong>{{ item }}</strong>&nbsp;
                    <span>(interest)</span>
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>
            <v-col cols="12">
              <v-combobox
                v-model="state.selectedItem.experts"
                :items="state.experts"
                :item-title="state.users.title"
                :item-value="state.users.id"
                chips
                clearable
                label="مشاوران"
                multiple
                prepend-icon="mdi-filter-variant"
                variant="solo"
                :readonly="state.disabled"
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :model-value="selected"
                    closable
                    @click="select"
                    @click:close="remove(item)"
                  >
                    <strong>{{ item }}</strong>&nbsp;
                    <span>(interest)</span>
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>
            <v-col cols="12">
              <v-combobox
                v-model="state.selectedItem.categories"
                :items="state.categories"
                :item-title="state.users.title"
                :item-value="state.users.id"
                chips
                clearable
                label="دسته بندی"
                multiple
                prepend-icon="mdi-filter-variant"
                variant="solo"
                :readonly="state.disabled"
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :model-value="selected"
                    closable
                    @click="select"
                    @click:close="remove(item)"
                  >
                    <strong>{{ item }}</strong>&nbsp;
                    <span>(interest)</span>
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row class="justify-center">
            <v-col cols="6">
              <v-btn class="mb-3 mr-0" color="primary" block variant="tonal" @click="postData" v-if="state.status.isAdd">اضافه شود</v-btn>
              <v-btn class="mb-3 mr-0" color="primary" block variant="tonal" @click="putData" v-if="state.status.isEdit">تایید</v-btn>
              <v-btn class="mb-3 mr-0" color="red" block variant="tonal" @click="() => { state.status.isDelete = true }" v-if="state.status.isEdit">حذف</v-btn>
              <v-btn class="mb-3 mr-0" color="red" block variant="outlined" to="/dashboard/discount/list">انصراف</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <!-- delete item modal -->
  <mj-dialog v-model="state.status.isDelete" :title="'حذف ' + state.selectedItem.title" :action-btn="true"
    action-btn-text="حذف شود" :cancel-btn="true" action-type="error" @action-callback="deleteData" size="sm">
    <p>دسته '{{ state.selectedItem.title }}' حذف می شود.<br />آیا مطمئن هستید؟ عملیات حذف غیر قابل بازگشت است!</p>
  </mj-dialog>
</template>