<script setup>
import panel from "../topic/component/expantion_panel.vue"
import imageComp from "../../components/image.vue"
const messageInput = ref({})
const route = useRoute()
const state = reactive({
  category: [],
  post:[],
  payload: {
    postHeader: {
      pageSize: 10,
      pageIndex: 1,
      topicId: route.params.id,
    },
    totalPages:0,
    height: 0,
  },
  newPost:{
    message: null,
    topicId: route.params.id,
    parentId: null,
  },
  replyTo: null,
  question:{},
  //#region FILTER
  panel: [0, 1],
  //#endregion
  //#region SCROLL LOADING
  loading: false,
  timeoutState: null,
  scroll: 0,
  //#endregion
})




//#region GET
onMounted(async () => {
  window.addEventListener("scroll", async (event) => {
    state.test=window.scrollY 
    state.payload.height = document.getElementById('table').clientHeight
    if(window.scrollY > state.scroll && !(state.payload.postHeader.pageIndex > state.payload.totalPages))
    if (window.scrollY > 0 && window.scrollY > (state.payload.height * 0.4) && !state.loading) {
      state.loading = true
      clearTimeout(state.timeoutState)
      state.timeoutState = setTimeout(async()=>{
        state.payload.postHeader.pageSize = 50
        // await getpost()
        state.payload.postHeader.pageIndex++
      },10)
    }
    state.scroll = window.scrollY
  });
})


const getpost = async () =>{
  state.payload.postHeader.topicId = route.params.id
  state.newPost.topicId = route.params.id
  await axiosApi().post(apiPath.public.Post.post.pagination,state.payload.postHeader)
  .then((res)=>{
    state.post =res.data
    publicbreadcrumbstore().setBreadCrumbs([
    {
      title: 'خانه',
      disabled: false,
      to: '/',
    },
    {
      title: 'تالار گفتگو',
      disabled: false,
      to: '/topic',
    },
    {
      title: state.question?.title,
      disabled: true,
      to: '/',
    },
  ])
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
  })
}

//#region SSR
fetchApi.post(apiPath.public.Category.post, { body: {} })
  .then((res) => {
    state.category = res.data.value.data
  })
  .catch((error) => {
    common.showError(error?.data?.messages)
  })

await fetchApi.get(apiPath.public.Topic.get.byId(route.params.id))
  .then((res) => {
    state.question = res.data.value.data
    useHead({
      title: `${state.question?.title}`,
      meta:[{name:'description',content:`${state.question?.description}`}],
      meta:[{name:'keywords',content:`${state.question?.title},${state.question.categoryTitle},${state.question.expertFirstName},${state.question.expertLastName}`}],
    })
  })
  .catch((error) => {
    common.showError(error?.data?.messages)
  })

fetchApi.post(apiPath.public.Post.post.pagination,{body:state.payload.postHeader})
  .then((res)=>{
    state.post = res.data.value.data
    state.payload.totalPages = res.data.value.metadata.totalPages
    publicbreadcrumbstore().setBreadCrumbs([
      {
        title: 'خانه',
        disabled: false,
        to: '/',
      },
      {
        title: 'تالار گفتگو',
        disabled: false,
        to: '/topic',
      },
      {
        title: state.question?.title,
        disabled: true,
        to: '/',
      },
    ])
    state.payload.postHeader.pageIndex++
  })
  .catch((error)=>{
    common.showError(error?.data?.messages)
  })
//#endregion

//#endregion

//#region POST
const postPost = async () =>{
  if(state.newPost.message){
    await axiosApi().post(apiPath.public.Post.post.add,state.newPost)
    .then((res)=>{
      common.showMessage(res.message)
      getpost()
    })
    .catch((error)=>{
      common.showError(error?.data?.messages)
    })
  }
  state.newPost.message=null
  state.newPost.parentId=null
}
//#endregion

const handleReply = (id) =>{
  state.replyTo = null
  state.newPost.parentId = id
  state.replyTo = state.post.find(item => item.id == id)
  // console.log(state.replyTo);
  messageInput.value.focus()
}

const clearReply = ()=>{
  state.newPost={
    message: null,
    topicId: route.params.id,
    parentId: null,
  }
  state.replyTo = null
}

</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12" :md="4" lg="3">
        <panel :isClose="state.panel" :categories="state.category"/>
      </v-col>
      <v-col cols="12" :md="8" lg="9">

        <v-card class="rounded-xl mb-3" elevation="0">
          <v-card-item>
            <div class="d-flex mt-3" style="gap: 20px;">
              <div style="border-radius: 100%;border: 1px solid #e5e5e5;padding: 1px;width: 60px;height: 60px;">
                <nuxt-link :to="`/expert/${state.question?.expertId}`">
                  <imageComp style="border-radius: 100%;" width="60" is-thumbnail="true"></imageComp>
                </nuxt-link>
              </div>
              <div class="w-100">
                <h2 style="font-size: 1.1rem;">{{ `${state.question?.title}`}}</h2>
                <div class="d-flex my-3" style="gap: 10px;">
                  <nuxt-link :to="`/expert/${state.question?.expertId}`">
                    <h3 style="font-size: 1rem;" class="text-primary">{{`${state.question?.expertFirstName??' '} ${state.question?.expertLastName??' '}`}}</h3>
                  </nuxt-link>
                  <p style="font-size: .8rem;" class="my-auto">{{ dateConverter.someTimeAgo(state.question?.createdOn) }}</p>
                </div>
                <!-- <div class="d-flex" style="gap:5px" v-for="(link,index) in state.question?.categoryId" :key="index"> -->
                <div class="d-flex" style="gap:5px">
                  <nuxt-link :to="`/topic/${state.question?.categoryId}`">
                    <v-btn color="theme-blue" rounded="xl" variant="tonal"><h3 style="font-size: .8rem;">{{ state.question?.categoryTitle ?? '#دسته بندی' }}</h3></v-btn>
                  </nuxt-link>
                </div>
                <p class="my-3">{{ state.question?.description ?? ' ' }}</p>

                <v-divider></v-divider>
                <!-- input -->
                <div class="d-flex ga-1 my-3" style="position: relative;">
                  <!-- style="position: relative;" -->
                  <div v-if="state.newPost?.parentId" class="d-flex w-100 rounded-xl" style="overflow: hidden;text-overflow:ellipsis; background-color: #a5a5a5;position: absolute;top:0px;width: max-content;min-height: 100px;">
                    <button @click="clearReply" class="mx-auto my-auto" style="width: 50px;height: 50px;">
                      <v-icon>mdi-close</v-icon>
                    </button>
                    <v-card class="w-100" style="background-color: transparent;" elevation="0">
                      <div class="d-flex ga-1 pt-3" style="padding-inline: 1rem;">
                        <p>{{`${state.replyTo?.firstName} ${state.replyTo?.lastName}`}}</p>
                        <small>{{ dateConverter.someTimeAgo(state.replyTo?.createdOn) }}</small>
                      </div>
                      <p class="py-3" style="padding-inline: 1rem;">{{ state.replyTo?.message }}</p>
                    </v-card>
                  </div>
                  <div class="d-flex w-100" :style="state.newPost?.parentId? 'margin-top:80px;' : ''">
                    <v-textarea 
                      label="ایجاد متن جدید"
                      variant="solo-inverted"
                      auto-grow
                      clearable
                      rows="4"
                      ref="messageInput"
                      v-model="state.newPost.message"
                      elevation="0"
                      prepend-inner-icon="mdi-send"
                      @click:prepend-inner="postPost"
                      :class="state.newPost?.parentId ? '' : 'ml-3'"
                      hide-details
                    ></v-textarea>
                  </div>
                </div>
              </div>
            </div>
          </v-card-item>
        </v-card>

        <div id="table">
          <v-row>
            <v-col cols="12" v-for="item in state.post" :key="item.id">
              <v-card class="rounded-xl border w-100" elevation="0">
                <v-card-text class="d-flex justify-space-between">
                  <v-row>
                    <v-col class="d-flex">
                      <h3 class="my-auto mr-3">{{`${item.firstName} ${item.lastName}`}}</h3>
                      <small class="my-auto mr-3">{{ dateConverter.someTimeAgo(item.createdOn) }}</small>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text>

                  <div v-if="item.parentId" class="mb-3">
                    <p>در پاسخ به: </p>
                    <v-card class="rounded-xl text-white mt-3" style="background-color: #696969;">
                      <v-card-text class="d-flex ga-3">
                        <h5>{{`${state.post.find((t)=> t.id == item.parentId)?.firstName} ${state.post.find((t)=> t.id == item.parentId)?.lastName}`}}</h5>
                        <small>{{ dateConverter.someTimeAgo(state.post.find((t)=> t.id == item.parentId)?.createdOn) }}</small>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-text>
                        <p>{{ state.post.find((t)=> t.id == item.parentId)?.message }}</p>
                      </v-card-text>
                    </v-card>
                  </div>

                  <p>{{ item.message }}</p>
                </v-card-text>
                <v-divider></v-divider>
                <div class="text-left pa-3">
                  <v-btn color="blue" variant="plain" @click="handleReply(item.id)">پاسخ دادن</v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.fixed-bar {
  position: sticky;
  position: -webkit-sticky; /* for Safari */
  top: 120px;
  z-index: 2;
}
</style>