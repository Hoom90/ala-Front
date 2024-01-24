<script setup>
import ImageComp from '@/components/image.vue'
publicbreadcrumbstore().setBreadCrumbs([
  {
    title: 'خانه',
    disabled: false,
    to: '/',
  },
  {
    title: 'مشاوران',
    disabled: true,
    to: '/expert',
  }])
const state = reactive({
  data: [],
  page: {
    header: {
      pageSize: 50,
      pageIndex: 1,
    },
    totalPages:0,
    height: 0,
  },
  loading:false,
  timeoutState:null,
  scroll:0,
})

onMounted(async () => {
  window.addEventListener("scroll", async (event) => {
    state.test=window.scrollY 
    state.page.height = document.getElementById('table').clientHeight
    if(window.scrollY > state.scroll && !(state.page.header.pageIndex > state.page.totalPages))
      if (window.scrollY > 0 && window.scrollY > (state.page.height * 0.8) && !state.loading) {
      state.loading = true
        clearTimeout(state.timeoutState)
        state.timeoutState = setTimeout(async()=>{
          await getData()
        },10)
      }
    state.scroll = window.scrollY
  });
})

const getData = async () => {
  await axiosApi().post(apiPath.public.Expert.get.paged, state.page.header)
    .then((res) => {
      state.data=state.data.concat(res.data)
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
    .finally(()=>{
      state.loading = false
    })
    state.page.header.pageIndex++
}

fetchApi.post(apiPath.public.Expert.get.paged, {body:state.page.header})
  .then((res) => {
    state.data=state.data.concat(res.data.value.data)
    state.page.totalPages = res.data.value.metadata.totalPages
    state.page.header.pageIndex++
  }).catch(error => {
    common.showError(error?.messages)
  })

useHead({
  title: 'مشاوران',
  meta:[{name:'description',content:'لیست مشاوران مرکز مشاوره آلا'}],
  meta:[{name:'keywords',content:'مشاور,متخصص'}],
})

</script>
<template>
  <v-container style="min-height: 800px;">
    <div id="table">
      <v-row class="d-flex justify-center align-center ga-3" style="flex-direction: column;">
        <div>
          <h2 style="font-size: 1.3rem;">مشاوران مرکز مشاوره آلا</h2>
        </div>
        <div>
          <h3 style="font-size: 1rem;">موسسه آلا متشکل از برترین مشاوران در سطح کشور</h3>
        </div>
      </v-row>
      <v-row>
        <v-col cols="6" sm="4" md="3" lg="2" v-for="item in state.data" :key="item.id">
          <nuxtLink :to="`expert/${item.id}/${item.firstName.replaceAll(' ','-')}-${item.lastName.replaceAll(' ','-')}`">
            <v-card class="grid-box rounded-xl" min-height="280">
              <v-card-item class="pa-3 position-relative" style="min-height: 208px">
                <ImageComp :src="item.imageId" customClass="rounded-xl" is-thumbnail="true" :alt="item.title"></ImageComp>
                <div class="rating">
                  <v-icon class="text-white">mdi-magnify</v-icon>
                </div>
              </v-card-item>
              <v-divider></v-divider>
              <v-card-text class="text-center" style="min-height: 60px"><h3>{{ `${item.firstName} ${item.lastName}` }}</h3></v-card-text>
            </v-card>
          </nuxtLink>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

