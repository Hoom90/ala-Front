<script setup>
import { userStore } from "@/stores/userStore"

const route = useRoute()
const user = userStore()
onMounted(async () => {
  await getComments()
  state.commentFormData.anonymousUserName = user.getAuth ? user.getUser.firstName+ ' ' +user.getUser.lastName : ''
})

const state = reactive({
  commentList: [],
  expand: false,
  payload: {
    pageSize: 20,
    pageIndex: 1,
    expertId: route.params.id,
    // sortBy: "-id",
  },
  commentFormData: {
    message: null,
    anonymousUserName: null,
    anonymousUserEmail: null,
    expertId: route.params.id,
  },
})

const getComments = async () => {
  await axiosApi().post(apiPath.public.Comment.get, state.payload)
      .then(comments => {
        state.commentList = comments.data
      })
      .catch((error)=>{
        common.showError(error?.data?.messages)
      })
}
const saveComment = async () => {
  await axiosApi().post(apiPath.public.Comment.add_expert_comment, state.commentFormData)
      .then( res => {
        if (res){
          state.expand = true
          document.getElementById('message').value = null
          getComments()
        }
      })
      .catch((error) => {
        common.showError(error?.data?.messages)
      })
}

</script>


<template>
<v-card id="Comment" class="rounded-xl">
  <v-card-title>دیدگاه کاربران</v-card-title>
  <v-divider></v-divider>
  <v-card-text>
    <v-form @submit.prevent="saveComment">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
              v-model="state.commentFormData.anonymousUserName"
              variant="outlined"
              label="نام و نام خانوادگی"
              :focused="user.getAuth"
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="12" md="6">
          <v-text-field
              variant="outlined"
              label="ایمیل"
              v-model="state.commentFormData.anonymousUserEmail"
          >{{ user.getUser.email }}</v-text-field>
        </v-col> -->
      </v-row>
      <v-textarea
          id="message"
          v-model="state.commentFormData.message"
          variant="outlined"
          rows="3"
          label="متن..."></v-textarea>
      <v-row class="justify-center">
        <v-col cols="12" md="6" lg="4">
          <v-btn type="submit" block color="info" variant="outlined">ارسال</v-btn>
        </v-col>
      </v-row>
      <v-expand-transition>
        <v-alert
            text="دیدگاه شما با موفقیت ثبت گردید و پس از تایید ناظر منتشر خواهد شد."
            class="mt-5"
            variant="tonal"
            type="success"
            color="success"
            v-show="state.expand"
        ></v-alert>
<!--        <v-card  >

          <v-icon>mdi-home</v-icon>
          <v-card-text></v-card-text>
        </v-card>-->
      </v-expand-transition>
    </v-form>
  </v-card-text>


  <hr>


  <v-card-text>
    <v-row v-for="comment in state.commentList" :key="comment.id" >
      <v-col cols="12" md="6">
        <div class="d-flex">
          <v-avatar color="grey" variant="tonal">
            <v-icon icon="mdi-account-circle-outline" size="x-large"></v-icon>
          </v-avatar>
          <v-card variant="tonal" class="w-100 mr-3 rounded-xl">
            <v-card-text class="pb-0 text-grey-lighten-1">{{ comment.anonymousUserName }}</v-card-text>
            <v-card-text class="text-wrap">{{ comment.message }}</v-card-text>
            <v-divider></v-divider>
            <v-card-text class="d-flex py-0 text-grey-lighten-1">
              <small>{{ dateConverter.someTimeAgo(comment.createdOn) }}</small>
              <small class="mr-auto">
                <v-icon>mdi-reply</v-icon>
              </small>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
      <v-col cols="12">
        <v-row justify="end" v-for="reply in comment.subComment" :key="reply.id" >
          <v-col cols="12" md="6" dir="ltr">
            <div class="d-flex">
              <v-avatar color="info" variant="tonal">
                <v-icon icon="mdi-account-circle" size="x-large"></v-icon>
              </v-avatar>
              <v-card variant="tonal" color="info" class="w-100 ml-3 text-right rounded-xl">
                <v-card-text class="pb-0 text-grey-lighten-1">{{ reply.anonymousUserName }}</v-card-text>
                <v-card-text class="text-wrap" dir="rtl">{{ reply.message }}</v-card-text>
                <v-divider></v-divider>
                <v-card-text class="d-flex py-0 text-grey-lighten-1">
                  <small>{{ dateConverter.someTimeAgo(reply.createdOn) }}</small>
                  <small class="mr-auto">
                    <v-icon>mdi-reply</v-icon>
                  </small>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
        <v-divider class="mt-5"></v-divider>
      </v-col>

    </v-row>







  </v-card-text>
</v-card>
</template>


<style scoped>

</style>
