<script setup>
const router = useRouter()
const route = useRoute()
const state = reactive({
  table: {
    headers: ["ردیف", "عنوان", "تاریخ", "بدهکار", "بستانکار"],
  },
  pagination: {
    pageIndex: 0,
    pageSize: 0,
    totalPages: 0,
    totalCount: 0,
  },
  balance: 0,
  textnumber: 0,
  records: [],
  payModal: false,
  modal: false,
  portData: null,
  todayDate: null,
})

//#region GET
onMounted(async () => {
  await getData()
})

const getData = async () => {
  await getBalance()
  await getRecord()
}

const getBalance = async () => {
  await axiosApi().get(apiPath.User.Wallet.balance)
    .then((res) => {
      state.balance = res.data
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}

const getRecord = async () => {
  if (route.query) {
    state.pagination = {
      pageIndex: route.query?.index,
      pageSize: route.query?.size
    }
  }
  await axiosApi().post(apiPath.User.Wallet.paged, state.pagination)
    .then((res) => {
      state.records = res.data
      state.pagination = res.metadata
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}

const changePageing = () => {
  router.replace({ path: '/account/wallet', query: { size: state.pagination.pageSize, index: state.pagination.pageIndex } })

  setTimeout(() => {
    getRecord()
  }, 50);
}
//#endregion

//#region POST
const postData = async () => {
  if (state.textnumber == '0' || state.textnumber.length < 2) {
    common.showError("مقدار وارد شده اشتباه است.")
    return
  }
  await axiosApi().post(apiPath.User.Payment.post, { amount: state.textnumber })
    .then((res) => {
      state.modal = true
      state.portData = res.data
      state.todayDate = new Date().toISOString().slice(0, 10)
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}
//#endregion

const openPayPort = (r) => {
  if (r) {
    window.location.href = state.portData.url
  }
  state.modal = false
  state.textnumber = '0'
}

</script>

<template>
  <!-- head -->
  <fieldset class="myFieldset rounded-xl mb-5 d-flex justify-space-between align-center pr-10">
    <legend>شارژ کیف</legend>
    <div>
      <span>موجودی کیف پول: </span>
      <span>{{ state.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} تومان</span>
    </div>
    <div class="mb-3">
      <v-form @submit.prevent="postData">
        <div class="d-flex align-center ga-1">
          <v-btn color="theme-blue" type="submit" variant="outlined" height="40" min-width="40" class="d-flex align-center pa-0">
            <v-icon>mdi-cash-plus</v-icon>
          </v-btn>
          <NumberSeprator style="min-width: 200px;" v-model="state.textnumber" dir="ltr" hide-details density="compact" />
        </div>
      </v-form>
    </div>
  </fieldset>

  <!-- records -->
  <fieldset class="myFieldset rounded-xl mb-5">
    <legend>سوابق پرداخت</legend>
    <v-table>
      <thead>
        <tr>
          <th v-for="header in state.table.headers">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in state.records" :key="item.index">
          <td>{{ ((state.pagination.pageIndex - 1) * state.pagination.pageSize + index) + 1 }}</td>
          <td>{{ item.description }}</td>
          <td>{{ dateConverter.convertToJalali(item.createdOn) }}</td>
          <td>{{ item.indebtedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
          <td>{{ item.creditAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination :length="state.pagination.totalPages" v-model="state.pagination.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col></v-col>
        <v-col>جمع حساب مالی</v-col>
        <v-col>{{ state.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} تومان</v-col>
      </v-row>
    </v-card-text>
  </fieldset>

  <!-- <fieldset class="myFieldset rounded-xl">
    <legend>سوابق دریافت</legend>
    <v-table>
      <thead>
        <tr>
          <th>مبلغ</th>
          <th>تاریخ</th>
          <th>وضعیت</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in state.records" :key="item.amount">
          <td>{{ item.amount }}</td>
          <td>{{ item.createdOn }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </v-table>
  </fieldset> -->

  <mj-dialog v-model="state.modal" title="رسید پیگیری پرداخت" :action-btn="true" action-btn-text="پرداخت"
    :cancel-btn="true" action-type="primary" @action-callback="openPayPort" size="sm">
    <v-row class="pa-10 text-center">
      <v-col cols="12">
        <p>کد پیگیری شما:<br />{{ parseInt(state.portData.autority) }}</p>
      </v-col>
      <v-col cols="12">
        <p>تاریخ:<br />{{ dateConverter.convertToJalali(state.todayDate) }}</p>
      </v-col>
      <v-col cols="12">
        <p>مبلغ:<br />{{ state.textnumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} تومان</p>
      </v-col>
    </v-row>
  </mj-dialog>
</template>