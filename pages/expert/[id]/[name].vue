<script setup>
import CommentComp from "@/components/single/commentCompExpert.vue";
import imageComp from '@/components/image.vue'
import { userStore } from "~/stores/userStore";
const verifyForm = ref({});
const route = useRoute();
const router = useRouter();
const user = userStore()
const state = reactive({
  data: null,
  tab: null,
  textnumber: 0,
  user: {
    phoneNumber: null,
    consultationTime: 30,
    discountId: null,
    expertId: null,
  },
  paymentPayload: null,
  portData: null,
  expert: [],
  expertScore: [],
  score: 3,
  isScore: true,
  //#region MODAL
  orderModal: false,
  orderErrorModal: false,
  paymentModal: false,
  scoreModal: false,
  selectedDay: dateConverter.normalMiladi(new Date()),
  schedules: [],
  selectReserve: null,
  dtf: {}
  //#endregion
})

useHead({
  // title: `${state.data?.firstName} ${state.data?.lastName}`,
  title: `${route.params.name.split('-')[0]} ${route.params.name.split('-')[1]}`,
  // meta:[{name:'description',content:`${state.data?.firstName} ${state.data?.lastName}`}],
  meta:[{name:'description',content:`${route.params.name.split('-')[0]} ${route.params.name.split('-')[1]}`}],
  meta:[{name:'keywords'}]
})

const OFSETDAY = 7
const startDay = dateConverter.normalMiladi(new Date())
const endDay = dateConverter.normalMiladi(new Date().setDate(new Date().getDate() + OFSETDAY))

let regExTime = /([0-9]?[0-9]):([0-9][0-9])/;


// #region GET
await fetchApi.get(apiPath.public.Expert.get.byId(route.params.id))
  .then((res) => {
    state.data = res.data.value.data
    publicbreadcrumbstore().setBreadCrumbs([
      {
        title: 'خانه',
        disabled: false,
        to: '/',
      },
      {
        title: 'مشاوران',
        disabled: false,
        to: '/expert',
      },
      {
        title: `${state.data?.firstName} ${state.data?.lastName}`,
        disabled: true,
        to: `/expert/${state.data?.id}`,
      }])
  }).catch(error => {
    common.showError(error?.messages)
  })

onMounted(()=>{
  state.user.phoneNumber = user.getUser.phoneNumber
  state.user.expertId = state.data?.id
  state.textnumber = state.data?.counselingAmount
  state.expertScore = JSON.parse(localStorage.getItem("expertScore")) ?? []
  if (state.expertScore.includes(state.data?.id))
    state.isScore = false
})
//#endregion

//#region POST

const postOrder = async (s) => {
  if (s) {
    if (!state.orderErrorModal) {
      const { valid } = await verifyForm.value.validate()
      if (!valid) {
        return
      }
      state.user.scheduleId = state.selectReserve.id
      await axiosApi().post(apiPath.User.Order.post.orders, state.user)
        .then(async (res) => {
          if (res.succeeded) {
            common.showMessage(res.messages)
            router.replace("/account/orders")
          }
          else if (res.failed) {
            state.orderErrorModal = true
          }
          state.paymentPayload = res
        })
        .catch((error) => {
          common.showError(error?.data?.messages)
          state.orderModal = false
        })
    }
    else {
      postPayment()
    }
  }
  else
    state.orderModal = false
}

const postPayment = async () => {
  await axiosApi().get(apiPath.User.Payment.byOrder(state.paymentPayload.data.orderId))
    .then((res) => {
      state.paymentModal = true
      state.orderModal = false
      state.portData = res.data
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}
//#endregion

//#region LIKE
const putLike = async (id) => {
  state.expert = JSON.parse(localStorage.getItem("expert")) ?? []

  if (!state.expert.includes(id))
    await axiosApi().put(apiPath.public.Expert.put.like(id))
      .then((res) => {
        if (res) {
          data.value.data.like = res.data
          common.showMessage("نظر شما با موفقیت ثبت شد")
          state.expert.push(id)
          localStorage.setItem("expert", JSON.stringify(state.expert))
        }
      })
      .catch((error) => {
        common.showError(error?.data?.messages)
      })
}
//#endregion

//#region DISLIKE
const putDislike = async (id) => {
  state.expert = JSON.parse(localStorage.getItem("expert")) ?? []

  if (!state.expert.includes(id))
    await axiosApi().put(apiPath.public.Expert.put.dislike(id))
      .then((res) => {
        if (res) {
          data.value.data.disLike = res.data
          state.expert.push(id)
          localStorage.setItem("expert", JSON.stringify(state.expert))
        }
      })
      .catch((error) => {
        common.showError(error?.data?.messages)
      })
}
//#endregion

//#region SCORE
const postScore = async (r) => {
  if (r) {
    state.expertScore = JSON.parse(localStorage.getItem("expertScore")) ?? []

    if (!state.expertScore.includes(data.value?.data.id))
      await axiosApi().post(apiPath.public.Score.post, { id: data.value?.data.id, score: state.score })
        .then((res) => {
          if (res) {
            data.value.data.score = res.data
            state.expertScore.push(data.value?.data.id)
            localStorage.setItem("expertScore", JSON.stringify(state.expertScore))
            state.isScore = false
          }
        })
        .catch((error) => {
          common.showError(error?.data?.messages)
        })
  }
  state.scoreModal = !state.scoreModal
}
//#endregion

const openPayPort = (r) => {
  if (r) {
    window.location.href = state.portData.url
  }
  state.modal = false
}

const validator = {
  phoneNumber: [
    value => {
      if (value) return true
      return 'مقدار وارد شده اشتباه است.'
    },
  ],
  consultationTime: [
    value => {
      if (value && parseInt(value) >= 10 && parseInt(value) <= 60) return true
      return 'مقدار وارد شده میتواند بین 10 و 60 باشد.'
    },
  ],
}

const handleClickScore = () => {
  if (state.isScore) {
    state.scoreModal = !state.scoreModal
  }
}

const handleLogin = () => {
  router.push(`/auth/login?redirecturl=/expert/${state.data.id}/${state.data.firstName.replaceAll(' ','-')}-${state.data.lastName.replaceAll(' ','-')}`)
}

const schedules = () => {
  axiosApi().post('public/schedule', {
    day: state.selectedDay,
    expertId: route.params.id
  })
    .then((res) => {
      state.schedules = res.data
      state.selectReserve = null
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}

const selectedReserve = (reserve) => {
  state.orderErrorModal = false
  state.selectReserve = reserve

  let startTime = regExTime.exec(reserve.startTime);
  let endTime = regExTime.exec(reserve.endTime);
  var from = parseInt(((parseInt(startTime[1]) * 60) + parseInt(startTime[2])))
  var to = parseInt(((parseInt(endTime[1]) * 60) + parseInt(endTime[2])))

  state.selectReserve.duration = to - from
}

</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="pa-5 rounded-xl">
          <imageComp :src="state.data?.imageId" custom-class="mx-auto mb-2 rounded-lg" :ratio="1" :alt="`${state.data.firstName} ${state.data.lastName}`"></imageComp>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card class="rounded-xl mb-5">
          <v-card-title primary-title>
            رزومه مشاور
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="8">

                <v-list density="compact">
                  <v-list-item prepend-icon="mdi-arrow-left-circle">
                    <strong>نام: </strong>
                    <span>{{ state.data?.firstName }}</span>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-arrow-left-circle">
                    <strong>نام خانوادگی: </strong>
                    <span>{{ state.data?.lastName }}</span>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-arrow-left-circle">
                    <strong>کد نظام : </strong>
                    <span>{{ state.data?.medicalNumber }}</span>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-arrow-left-circle">
                    <strong>جمله انگیزشی: </strong>
                    <span>{{ state.data?.motivationalSentence }}</span>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-arrow-left-circle">
                    <strong>مبلغ مشاوره: </strong>
                    <span>{{ state.data?.counselingAmount?.toLocaleString() }} تومان</span>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-arrow-left-circle">
                    <strong>مدرک: </strong>
                    <span>{{ constract.grade?.find(item => item.id == state.data?.grade)?.title
                    }}</span>
                  </v-list-item>
                  <div class="d-flex align-center" style="flex-wrap: wrap;">
                    <v-list-item prepend-icon="mdi-arrow-left-circle">
                      <strong>تخصص: </strong>
                      </v-list-item>
                      <v-chip size="x-small" v-for="item in state.data?.categoryList" class="ml-1 mb-1">{{ item.title }}</v-chip>
                  </div>
                  <v-divider></v-divider>
                  <div class="ma-2">


                    <v-btn size="small" v-for="item in state.schedules" :disabled="item.reserved || item.freezed"
                      :variant="state.selectReserve?.id == item.id ? 'elevated' : 'outlined'"
                      :color="item.reserved ? 'red' : state.selectReserve?.id == item.id ? 'success' : 'primary'"
                      class="ma-1" @click="selectedReserve(item)">
                      {{ regExTime.exec(item.startTime)[0] }} تا {{ regExTime.exec(item.endTime)[0] }}
                      <v-tooltip activator="parent" location="top">
                        از {{ regExTime.exec(item.startTime)[0] }} تا {{ regExTime.exec(item.endTime)[0] }}
                      </v-tooltip>
                    </v-btn>
                  </div>



                </v-list>

              </v-col>
              <v-col cols="12" md="4" class="border-s">
                <div class="d-flex justify-end flex-column">
                  <date-picker v-model="state.selectedDay" format="YYYY-MM-DD" inline auto-submit class="schedule-select"
                    :min="startDay" :max="endDay" @change="schedules" display-format="jYYYY/jMM/jDD" />

                  <v-btn v-if="user.getAuth" color="red" variant="flat" :disabled="!state.selectReserve" size="x-large"
                    @click="state.orderModal = true">
                    {{ !state.selectReserve ? 'ابتدا زمان را انتخاب کنید' : 'رزرو نوبت مشاوره' }}

                  </v-btn>
                  <v-btn v-else @click="handleLogin">ورود</v-btn>
                </div>
              </v-col>
            </v-row>


          </v-card-text>
          <v-divider></v-divider>
          <v-card-subtitle>
            <v-row>
              <v-col class="text-center">
                <v-btn color="success" class="border-none" @click="putLike(state.data?.id)">
                  <v-icon class="ml-3">mdi-thumb-up-outline</v-icon>
                  <span>{{ state.data?.like }}</span>
                </v-btn>
              </v-col>
              <v-col class="text-center">
                <v-btn color="red" class="border-none" @click="putDislike(state.data?.id)">
                  <v-icon class="ml-3">mdi-thumb-down-outline</v-icon>
                  <span>{{ state.data?.disLike }}</span>
                </v-btn>
              </v-col>
              <v-col class="text-center">
                <v-btn color="blue" class="border-none" :style="state.isScore ? '' : 'cursor: default;'"
                  @click="handleClickScore">
                  <v-icon class="ml-3">mdi-star-outline</v-icon>
                  <small>{{ state.data?.score }}</small>
                </v-btn>
              </v-col>
              <v-col class="text-center">
                <v-btn color="blue" class="border-none" style="cursor: default;">
                  <v-icon class="ml-3">mdi-eye-outline</v-icon>
                  <span>{{ state.data?.visitedCount }}</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-subtitle>
        </v-card>




        <v-card class="rounded-xl">
          <v-card-title class="pb-0">
            <v-tabs v-model="state.tab">
              <v-tab value="one">رزومه من</v-tab>
              <v-tab value="two">ارسال دیدگاه</v-tab>
            </v-tabs>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>

            <v-window v-model="state.tab">
              <v-window-item value="one" class="text-pre-line">
                <div class="pa-4" v-html="state.data?.additionalText ?? ''"></div>
              </v-window-item>
              <v-window-item value="two">
                <CommentComp />
              </v-window-item>
            </v-window>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <mj-dialog v-model="state.orderModal" title="رزرو وقت مشاوره" :action-btn="true"
      :action-btn-text="state.orderErrorModal ? 'پرداخت' : 'ثبت سفارش'" :cancel-btn="true" action-type="primary"
      @action-callback="postOrder" size="sm">
      <v-form @submit.prevent="postOrder" ref="verifyForm">
        <div class="ma-2">

          <v-text-field variant="outlined" :rules="validator.phoneNumber" v-model="state.user.phoneNumber"
            label="شماره تماس شما" prepend-icon="mdi-phone" suffix="98+" dir="ltr"></v-text-field>

          <div class="my-3">
            <v-icon>mdi-calendar</v-icon>
            <span class="mr-5">
              زمان مشاوره:
            </span>
            <br />
            <span class="mr-8">

              روز
              {{ dateConverter.dayInWeek(state.selectReserve?.startTime) }}
              {{ dateConverter.convertToJalali(state.selectReserve.startTime) }}
              از ساعت:
              {{ regExTime.exec(state.selectReserve.startTime)[0] }}
              تا ساعت:
              {{ regExTime.exec(state.selectReserve.endTime)[0] }}
            </span>
          </div>

          <div class="d-flex mt-5">
            <v-icon>mdi-cash</v-icon>
            <span class="mr-5"> مبلغ قابل پرداخت: </span>
            <div class="d-block">
              {{ (state.selectReserve.duration *
                state.data?.counselingAmount).toLocaleString() }} تومان
            </div>
          </div>
        </div>

        <v-row class="pa-10 text-center" v-if="state.orderErrorModal">
          <v-col cols="12" class="bg-orange-lighten-3 rounded-lg">
            <div v-html="state.paymentPayload.messages"></div>
            <span>همچنین می توانید از طریق پنل کاربری خود منوی سفارشات این سفارش را تکمیل کنید.</span>
          </v-col>
        </v-row>
        <button class="d-none"></button>
      </v-form>
    </mj-dialog>

    <mj-dialog v-model="state.paymentModal" title="رسید پیگیری پرداخت" :action-btn="true" action-btn-text="پرداخت"
      :cancel-btn="true" action-type="primary" @action-callback="openPayPort" size="sm">
      <v-row class="pa-10 text-center">
        <v-col cols="6">
          <p>کد پیگیری شما: {{ parseInt(state.portData.autority) }}</p>
        </v-col>
        <v-col cols="6">
          <p>تاریخ: {{ dateConverter.convertToJalali(new Date()) }}</p>
        </v-col>
        <v-col cols="12">
          <p>مبلغ قابل پرداخت: {{ state.paymentPayload.data.amount.toLocaleString() }} تومان</p>
        </v-col>
      </v-row>
    </mj-dialog>

    <mj-dialog v-model="state.scoreModal" title="به مشاور امتیاز دهید" :action-btn="true" action-btn-text="ثبت"
      :cancel-btn="true" action-type="primary" @action-callback="postScore" size="sm">
      <div class="d-flex justify-center align-center">
        <v-rating v-model="state.score" color="orange-lighten-1" active-color="blue"></v-rating>
        <span class="mr-3">({{ state.score }}.0)</span>
      </div>
    </mj-dialog>

  </v-container>
</template>
<style>
.schedule-select span.vpd-input-group {
  display: none;
}
</style>