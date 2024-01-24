<script setup>
import {userStore} from "~/stores/userStore";

definePageMeta({layout: 'dashboard'})
const route = useRoute()
const router = useRouter()
const user = userStore()
const state = reactive({
  dialogDelete: false,
  current: {},
  commentList: [],
  page:{
    size: route.query?.size ?? 10,
    index: route.query?.index ?? 1,
    parentId: null,
    sortBy: "-id",
    totalPage: 1
  },
  readyMessages: [
      "ممنون از شما",
      "دیدگاه شما پس از بررسی توسط کارشناس جواب داده خواهد شد",
      "سلام، با تشکر از دیدگاه زیبای شما",
      "این مورد را از طریق تیکت پیگیری نمایید",
      "سلام لطفا برای رسیدن به جواب با کارشناس پشتیبانی در ارتباط باشید"
  ],
  insertReadyMessage: null,
  formData: {
    contentId: null,
    message: null,
    publishStatus: true,
    anonymousUserName: null,
    parentId: 0
  },
  formReply: {
    published: true,
    message: null,
    parentId: null
  }
})
dashboardbreadcrumbstore().setBreadCrumbs([
  {
    title: 'دیدگاه ها ',
    disabled: true,
    to: '/dashboard/comment/list',
  }])
const getData = async () => {
  await axiosApi().post(apiPath.Comment.get.list, {
    pageIndex: state.page.index,
    pageSize: state.page.size,
  })
  .then((res)=>{
    state.commentList = res.data
    state.page.total = res.metadata.totalCount
    state.page.totalPage = res.metadata.totalPages
    // console.log(res.data)
  })
  .catch(error=>{
    common.showError(error?.data?.messages)
  })
}
getData()
const replyToComment = async (id) => {
  await axiosApi().post(apiPath.Comment.post, {
    message : state.formReply.message,
    published: state.formReply.published,
    parentId: id,

  })
    .then(res => {
      getData()
    })
}
const dialogDelete = (row) => {
  state.dialogDelete = true,
  state.current = row
}
const deleteComment = async (id) => {
  await axiosApi().delete(apiPath.Comment.delete + state.current.id, state.formData)
      .then(res => {
        common.showMessage("دیدگاه با موفقیت حذف شد")
        state.dialogDelete = false
        getData()
      })
}
const changePageing = () => {
  router.replace({ path: '/dashboard/comment/list', query: { size: state.page.size, index: state.page.index } })

  setTimeout(() => {
    getData()
  }, 50);
}

console.log(state.commentList?.subComment)
</script>



<template>
  <v-toolbar class="mb-5" :elevation="1" color="white" rounded>
    <v-toolbar-title>دیدگاه ها</v-toolbar-title>
  </v-toolbar>

  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="8"></v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-text-field type="search" variant="outlined" density="compact" label="جستجو" hide-details=""></v-text-field>
        </v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-select v-model="state.page.size" :items="constract.pageSize" variant="outlined" density="compact"
                    label="تعداد نمایش" @update:modelValue="changePageing" hide-details></v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-table size="x-large">
      <thead>
      <tr>
        <th>ردیف</th>
        <th>عنوان</th>
        <th>زمان ارسال</th>
        <th class="text-center" width="200"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(comment, index) in state.commentList" :key="comment.id"
          :class="{ 'bg-deep-orange-lighten-5' : !comment.publishStatus, 'bg-grey-lighten-4' : !comment.parentId }"
      >
        <td>{{ ((state.page.index - 1) * state.page.size + index) + 1 }}</td>
        <td>
          <div>
            <small class="text-grey-lighten-1">
              <span class="text-grey-lighten-1">ارسال کننده: </span>
              {{ comment.anonymousUserName }}  {{ comment.parentId }}
            </small>
          </div>
          <div>
            <small class="text-grey-lighten-1">
              <span>مربوط به:</span>
              <router-link :to="`/${comment.contentType == 1 ? 'news' : 'article'}/${comment.expertId}`" v-if="comment.contentId">{{ comment.contentTitle }}</router-link>
              <router-link :to="`/expert/${comment.expertId}`" v-if="comment.expertId">{{ comment.expertName }}</router-link>
              <span v-if="!comment.expertId && !comment.contentId"> شما</span>
            </small>
          </div>
          <div class="d-flex">
            <span class="text-grey-lighten-1">دیدگاه: </span>
            <span style="max-width: 750px">{{ comment.message }}</span>
          </div>
        </td>
        <td><div class="text-no-wrap">{{ dateConverter.someTimeAgo(comment.createdOn) }}</div></td>
        <td class="text-end">
          <div class="d-flex">
            <v-dialog transition="dialog-top-transition" width="auto">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" variant="tonal" color="blue" class="ml-2">جواب</v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card width="400">
                  <v-toolbar class="bg-grey-darken-3 px-5" :title="`ارسال جواب به: `+comment.firstname+' '+comment.lastName">
                    <v-icon @click="isActive.value = false">mdi-close</v-icon>
                  </v-toolbar>
                  <v-card-text class="py-8">
                    <v-form @submit.prevent="replyToComment(comment.id)">
                      <v-select
                          v-model="state.insertReadyMessage"
                          label="پاسخ های آماده"
                          :items="state.readyMessages"
                          variant="outlined"
                          return-object
                          single-line
                      ></v-select>

                      <v-textarea
                          clearable
                          clear-icon="mdi-close-circle"
                          label="جواب..."
                          v-model="state.formReply.message"
                          rows="2"
                          auto-grow
                          row-height="15"
                          variant="outlined"
                      ></v-textarea>
                      <v-switch label="انتشار دیدگاه" :model-value="true" color="info" v-model="state.formReply.published"></v-switch>
                      <v-btn variant="elevated" color="info" block @click="replyToComment(comment.id), isActive.value = false">ارسال</v-btn>
                    </v-form>
                  </v-card-text>
                </v-card>
              </template>
            </v-dialog>
            <v-btn variant="tonal" color="red" @click="dialogDelete(comment)">حذف</v-btn>
          </div>
        </td>
      </tr>
<!--      <tr v-for="(reply, index) in state.commentList?.subComment" :key="reply.id">
        <td>{{ reply.anonymousUserName }}</td>
      </tr>-->
      </tbody>
    </v-table>
    <v-pagination
        :total-visible="6"
        :length="state.page.totalPage" v-model="state.page.index" class="mx-auto"
        @update:modelValue="changePageing">
    </v-pagination>
  </v-card>

  <mj-dialog v-model="state.dialogDelete" title="حذف دیدگاه" :action-btn="true" action-btn-text="حذف شود"
             :cancel-btn="true" action-type="error" @action-callback="deleteComment" size="xs">
    <strong>عملیات حذف غیر قابل بازگشت است.</strong>
    <p>آیا از حذف این دیدگاه اطمینان دارید؟</p>
  </mj-dialog>



</template>
