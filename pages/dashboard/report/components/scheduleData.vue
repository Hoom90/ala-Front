<script setup>
const route = useRoute()
const router = useRouter()
const state = reactive({
  scheduleData: [],
  expertData: [],
  searchFilter: [
    {id:1,title:'همه',field:null,value:null},
    {id:2,title:'رزرو شده',field:'reserved',value:'true'},
    {id:3,title:'فیریز شده',field:'freezed',value:'true'},
    {id:4,title:'رزرو نشده',field:'reserved',value:'false'},
    {id:5,title:'فیریز نشده',field:'freezed',value:'false'},
  ],
  payload:{
    pageSize: 10,
    pageIndex: 1,
    searchFilters: [
      {
        field: null,
        operator: 0,
        value: null
      }
    ],
    id: 0,
    sortBy: null
  },
  selectedDateFilter: [],
  selectedDateFilterJalali: null,
  selectedFilter:1,
  selectedField:{},
  modal:false,
  expertFilterDialoge:false,
  pagination: {},
})

//#region GET
watch(()=>route.query,async()=>{
  state.payload.pageIndex = route.query?.index??1
  state.payload.pageSize = route.query?.size??10
})

onMounted(async() =>{
  await getData()
})

const getData = async () =>{
  await axiosApi().post(apiPath.Schedule.post.pagination,state.payload)
  .then(async (res)=>{
    state.scheduleData = res.data
    state.pagination = res.metadata
    if(state.expertData.length == 0)
      await getExperts()
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
  })
}

const getExperts = async () =>{
  await axiosApi().post(apiPath.Expert.get.paged,{})
  .then((res)=>{
    state.expertData = res.data
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
  })
}

//#endregion

const handleSelectItem = async () =>{
  state.selectedDateFilter = null
  state.selectedDateFilterJalali =null
  state.payload.searchFilters = [{
    field: state.searchFilter.find(item => item.id == state.selectedFilter).field,
    operator: 0,
    value: state.searchFilter.find(item => item.id == state.selectedFilter).value,
  }]
  await getData()
}

const changePageing = () => {
  router.replace({ path: '/dashboard/report/list', query: { size: state.pagination.pageSize, index: state.pagination.pageIndex } })

  setTimeout(() => {
    getData()
  }, 50);
}

const handleDatePicker = async () =>{
  if(state.selectedDateFilter && state.selectedDateFilter.length >= 2){
    state.selectedFilter = 1
    state.selectedDateFilterJalali = `از ${dateConverter.convertToJalali(state.selectedDateFilter[0])} تا ${dateConverter.convertToJalali(state.selectedDateFilter[1])}`
    state.payload.searchFilters = [{
      field: "startTime",
      operator: 2,
      value: state.selectedDateFilter[0],
    },
    {
      field: "startTime",
      operator: 4,
      value: state.selectedDateFilter[1],
    }]
    await getData()
  }
  else{
    common.showError("مقدار به درستی وارد نشده است")
  }
}

const handleSearchExpert = async (r) =>{
  if(r){
    state.selectedFilter = 1
    state.selectedDateFilter = null
    state.selectedDateFilterJalali=null
    state.payload.searchFilters = [
    state.selectedField.firstName?{
      field: 'expert.user.FirstName',
      operator: 6,
      value: state.selectedField.firstName,
    }:null,
    state.selectedField.lastName?{
      field: 'expert.user.LastName',
      operator: 6,
      value: state.selectedField.lastName,
    }:null]
    await getData()
  }
  state.modal = !state.modal
}

const resetFromDate = async () =>{
  state.selectedDateFilterJalali = null;
  state.selectedDateFilter = null;
  state.payload.searchFilters = [
      {
        field: null,
        operator: 0,
        value: null
      }
    ],
  await getData()
}

</script>
<template>

  <v-card-text class="d-flex pa-3">
    <v-row>
      <v-col cols="12" md="3" lg="8"></v-col>
      <v-col cols="12" md="3" lg="2">
        <div class="d-flex ga-1">
          <v-btn v-if="state.selectedDateFilterJalali" @click="resetFromDate" variant="tonal" class="rounded-circle pa-0 my-auto" style="min-width: 0 !important;width: 25px; height: 25px;">
            <v-icon class="my-auto">mdi-close</v-icon>
          </v-btn>
          <v-text-field
            hide-details
            label="فیلتر سال برای تاریخ جلسه"
            variant="outlined"
            density="compact"
            readonly
            v-model="state.selectedDateFilterJalali"
            @click="state.yearPicker = true"
            id="dateFilter"></v-text-field>
            <date-picker :show="state.yearPicker" range v-model="state.selectedDateFilter"
                format="YYYY/MM/DD" display-format="jYYYY/jMM/jDD" custom-input="#dateFilter"
                @change="handleDatePicker"/>
        </div>
      </v-col>
      <v-col cols="12" md="3" lg="2">
        <v-select
          v-model="state.selectedFilter"
          label="نمایش براساس"
          variant="outlined"
          density="compact"
          :items="state.searchFilter"
          item-title="title"
          item-value="id"
          hide-details
          @update:model-value="handleSelectItem()"
        ></v-select>
      </v-col>
    </v-row>
  </v-card-text>
  <v-table>
      <thead>
        <tr>
          <th class="text-center">ردیف</th>
          <th class="text-center">
            <v-btn variant="text" prepend-icon="mdi-magnify" @click="state.modal = !state.modal">مشاور</v-btn>
          </th>
          <th class="text-center">زمان شروع جلسه</th>
          <th class="text-center">زمان پایان جلسه</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in state.scheduleData" :key="index">
          <td class="text-center">{{ ((state.pagination.pageIndex - 1) * state.pagination.pageSize + index) + 1 }}</td>
          <td class="text-center">{{ `${state.expertData?.find(t => t.id == item.expertId)?.firstName} ${state.expertData?.find(t => t.id == item.expertId)?.lastName}` }}</td>
          <td class="text-center">{{ dateConverter.convertToJalaliYYYYMDHHMM(item.startTime) }}</td>
          <td class="text-center">{{ dateConverter.convertToJalaliYYYYMDHHMM(item.endTime) }}</td>
        </tr>
      </tbody>
  </v-table>
  <v-pagination
    :total-visible="6"
    :length="state.pagination.totalPages" v-model="state.pagination.pageIndex" class="mx-auto"
  @update:modelValue="changePageing">
  </v-pagination>
  
  <mj-dialog v-model="state.modal" :title="`جستجو براساس نام مشاور`" :action-btn="true" action-btn-text="فیلتر کردن" :cancel-btn="true" action-type="primary"
    @action-callback="handleSearchExpert" size="sm">
    <v-form @submit.prevent="handleSearchExpert">
      <div class="d-flex ga-3">
        <v-text-field
          :items="state.data"
          v-model="state.selectedField.firstName"
          label="نام مشاور"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          :items="state.data"
          v-model="state.selectedField.lastName"
          label="نام خانوادگی مشاور"
          variant="outlined"
        ></v-text-field>
      </div>
    </v-form>
  </mj-dialog>
</template>