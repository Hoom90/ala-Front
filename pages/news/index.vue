<script setup>
import ImageComp from "@/components/image.vue"
publicbreadcrumbstore().setBreadCrumbs([
  {
    title: 'خانه',
    disabled: false,
    to: '/',
  },
  {
    title: 'خبر ها',
    disabled: true,
    to: '/news',
  }])

useHead({
  title: 'اخبار',
  meta:[{name:'description',content:`آخرین اخبار`}],
  meta:[{name:'keywords',content:`اخبار,آلا,اخرین,جدیدترین`}]
})

const table = ref()

const state = reactive({
  data: [],
  page: {
    header: {
      pageSize: 50,
      pageIndex: 1,
      contentType: 1
    },
    totalPages:0,
    height: 0,
  },
  loading: false,
  timeoutState: null,
  scroll: 0,
})

onMounted(async () => {
  window.addEventListener("scroll", async (event) => {
    state.test = window.scrollY
    state.page.height = table.value.clientHeight
    if (window.scrollY > state.scroll && !(state.page.header.pageIndex > state.page.totalPages))
    if (window.scrollY > 0 && window.scrollY > (state.page.height * 0.6) && !state.loading) {
        state.loading = true
        clearTimeout(state.timeoutState)
        state.timeoutState = setTimeout(async () => {
          await getData()
        }, 10)
      }
    state.scroll = window.scrollY
  });
})

const getData = async () => {
  await axiosApi().post(apiPath.public.News.get.all, state.page.header)
    .then((res) => {
      state.data = state.data.concat(res.data)
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
    .finally(() => {
      state.loading = false
    })
  state.page.header.pageIndex++
}

await fetchApi.post(apiPath.public.News.get.all, { body: state.page.header })
  .then((res) => {
    state.data = res.data.value.data
    state.page.totalPages = res.data.value.metadata.totalPages
    state.page.header.pageIndex++
  }).catch(error => {
    common.showError(error?.data?.messages)
  })



</script>
<template>
  <v-container style="min-height: 800px;">
    <div ref="table">
      <v-row class="d-flex justify-center align-center ga-3 mb-5" style="flex-direction: column;">
        <h2 style="font-size: 1.3rem;">جدیدترین اخبار</h2>
      </v-row>
      <v-row>
        <v-col cols="6" sm="4" md="3" lg="2" v-for="item in state.data" :key="item.id">
          <nuxtLink :to="`news/${item.id}/${item.title.replaceAll(' ','-')}`">
            <v-card class="grid-box rounded-xl" min-height="280">
              <v-card-item class="pa-3 position-relative" style="min-height: 208px">
                <ImageComp :src="item.image" :isUploaded="true" customClass="rounded-xl" is-thumbnail="true" :ratio="1"
                  :alt="item.title"></ImageComp>
                <div class="rating">
                  <v-icon class="text-white">mdi-magnify</v-icon>
                </div>
              </v-card-item>
              <v-divider></v-divider>
              <v-card-text class="mb-5" style="min-height: 60px"><h3 style="text-wrap: pretty;">{{ item.title }}</h3></v-card-text>
              <v-card-item class="py-1">
                <h4>
                  <span class="ml-9">
                    <v-icon size="13" class="ml-2">mdi-calendar-month-outline</v-icon>
                    <small>{{ dateConverter.convertToJalali(item.createdOn) }}</small>
                  </span>
                  <span>
                    <v-icon size="13" class="ml-2">mdi-eye-outline</v-icon>
                    <small>{{ item.visitedCount }}</small>
                  </span>
                </h4>
              </v-card-item>
            </v-card>
          </nuxtLink>
        </v-col>
      </v-row>
      <!-- <div class="d-flex justify-center align-center mt-10">
        <v-btn color="success" @click="getData" v-if="state.data.length > 49">بیشتر</v-btn>
      </div> -->
    </div>
  </v-container>
</template>

