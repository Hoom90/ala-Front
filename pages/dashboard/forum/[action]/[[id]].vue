<script setup>
import imageComp from "@/components/image.vue"
const route = useRoute()
const router = useRouter()
const state = reactive({
  data: [],
  topic: {},
  categoryData:[],
  dialogDelete: false,
  dialogEdit: false,
  dialogView: false,
  current: {},
  search: null,
  page: {
    size: route.query?.size ?? 10,
    index: route.query?.index ?? 1,
  },
  pagination: {
    topicId:null
  },
  dialog: [],
})

//#region GET
onMounted(async()=>{
  dashboardbreadcrumbstore().setBreadCrumbs([
  {
      title: 'تالار گفتگو ',
      disabled: false,
      to: '/dashboard/forum/list',
    },  
  {
      title: 'پست ها',
      disabled: true,
      to: ``,
    }])
    await getData()
    await getTopicById()
})

const getData = async () => {
  if(route.query){
    state.pagination = {
      pageIndex: route.query?.index,
      pageSize: route.query?.size
    }
  }
  state.pagination.topicId = route.params.id
  await axiosApi().post(apiPath.Post.post.byTopicId,state.pagination)
    .then((res) => {
      state.data = res.data
      state.pagination = res.metadata
    }).catch((error) => {
      common.showError(error?.data?.messages)
    })
}

const getTopicById = async () =>{
  await axiosApi().get(apiPath.Topic.get.byId(route.params.id))
    .then((res) => {
      state.topic = res.data
    }).catch((error) => {
      common.showError(error?.data?.messages)
    })
}

//#endregion

//#region DELETE
const deleteData = async (r) =>{
  if(r){
    await axiosApi().delete(apiPath.Post.delete(state.current.id))
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
    await axiosApi().put(apiPath.Post.put,state.current)
    .then(res=>{
      common.showMessage(res.messages)
      getData()
    })
    .catch(error=>{
      common.showError(error?.data?.messages)
    })
  }
  state.dialogEdit = false
  state.current = {}
}
//#endregion

const changePageing = () =>{

  router.replace({ path: `/dashboard/forum/${route.params.action}/${route.params.id}`, query: { size: state.pagination.pageSize, index: state.pagination.pageIndex }})

  setTimeout(() => {
    getData()
  }, 50);
}

const handleDelete = (item) =>{
  state.dialogDelete = true
  state.current = item
}

const handleEdit = async (item) =>{
  state.dialogEdit = true
  state.current = {...item}
}

const handleView = async (item) =>{
  state.dialogView = true
  state.current = item
  state.current.fullName = item.firstName + " " + item.lastName
  state.current.shamsiData = dateConverter.convertToJalali(item.createdOn)
  state.current.replyTo = `${state.data.find(i => i.id == item.parentId)?.firstName ?? '-'} ${state.data.find(i => i.id == item.parentId)?.lastName ?? ''}`
}


</script>

<template>
  <v-toolbar class="mb-5" color="white" elevation="1" rounded>
    <v-toolbar-title>پست ها > {{ state.topic.title }}</v-toolbar-title>
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
          <th v-for="item in ['ردیف', 'نام', 'نقش', 'تاریخ ایجاد', 'پاسخ به']" class="text-center">
            {{ item }}
          </th>
          <th></th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in state.data" :key="item.id" class="text-center">
          <td>{{ ((state.pagination.pageIndex - 1) * state.pagination.pageSize + index) + 1 }}</td>
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
          <td>{{ `${item.firstName} ${item.lastName}` }}</td>
          <td class="d-flex ga-1 align-center justify-center">
            <v-chip v-if="item.isExpert" color="blue">مشاور</v-chip>
            <v-chip v-if="item.isAdmin" color="green">ادمین</v-chip>
            <v-chip v-else color="success">کاربر</v-chip></td>
          <td>
            {{ dateConverter.convertToJalali(item.createdOn) }}
          </td>
          <td>{{ `${state.data.find(i => i.id == item.parentId)?.firstName ?? '-'} ${state.data.find(i => i.id == item.parentId)?.lastName ?? ''}`}}</td>
          <td>
            <div class="float-left d-flex ga-1">
              <v-btn variant="tonal" color="info"  @click="handleView(item)">مشاهده</v-btn>
              <v-btn variant="tonal" color="info"  @click="handleEdit(item)">ویرایش</v-btn>
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

  <mj-dialog v-model="state.dialogView" :title="`جزئیات پیام < ${state.current.firstName} ${state.current.lastName} >`" size="lg">
    <div class="d-flex ga-3 pa-5">
      <div class="my-auto">
        <div class="border pa-1 rounded-circle mx-auto" style="width: 200px;">
          <imageComp :name="state.current.imageId" style="width: 200px;" class="mx-auto rounded-circle"/>
        </div>
      </div>
      <div class="w-100">
        <div class="d-flex ga-3 my-3">
          <v-text-field v-model="state.current.fullName" readonly variant="outlined" label="نام" hide-details></v-text-field>
          <div class="d-flex my-auto">
            <v-chip v-if="state.current.isExpert" color="blue">مشاور</v-chip>
            <v-chip v-if="state.current.isAdmin" color="green">ادمین</v-chip>
            <v-chip v-else color="success">کاربر</v-chip>
          </div>
        </div>
        <v-textarea auto-grow v-model="state.current.message" class="my-3" label="متن" readonly variant="outlined" hide-details></v-textarea>
        <v-row>
          <v-col>
            <v-text-field v-model="state.current.shamsiData" readonly variant="outlined" label="تاریخ ایجاد" hide-details></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="state.current.replyTo" readonly variant="outlined" label="پاسخ به" hide-details></v-text-field>
          </v-col>
        </v-row>
      </div>
    </div>
  </mj-dialog>

  <mj-dialog v-model="state.dialogEdit" :title="`ویرایش پیام < ${state.current.firstName} ${state.current.lastName} >`" :action-btn="true" :cancel-btn="true" action-type="primary"
    @action-callback="editData" size="sm">
    <v-form @submit.prevent="editData">
      <v-textarea v-model="state.current.message" class="mt-5" variant="outlined" label="توضیحات"></v-textarea>
    </v-form>
  </mj-dialog>

  <mj-dialog v-model="state.dialogDelete" title="حذف" :action-btn="true" action-btn-text="حذف شود"
    :cancel-btn="true" action-type="error" @action-callback="deleteData" size="sm">
    <p>{{ state.current.title }} حذف می شود.<br />آیا اطمینان دارید؟</p>
  </mj-dialog>
</template>
