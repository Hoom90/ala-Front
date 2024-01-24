<script setup>
import ImageComp from '@/components/image.vue'
const props = defineProps(['name'])

const state = reactive({
  data: [],
  page: {
    header: {
      pageSize: 50,
      pageIndex: 1,
      contentType: props.name.toLowerCase() == "news" ? 1 : 2
    },
    height: 0,
  },
  loading:false,
  timeoutState:null,
  scroll:0,
})

onMounted(async () => {
  await getData()
  window.addEventListener("scroll", async (event) => {
    state.test=window.scrollY 
    state.page.height = document.getElementById('table').clientHeight
    if(window.scrollY > state.scroll)
      if (window.scrollY > 0 && window.scrollY > (state.page.height * 0.7) && !state.loading) {
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
  await axiosApi().post(apiPath.public[props.name].get.all, state.page.header)
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

</script>
<template>
  <v-container>
    <div id="table">
      <v-row>
        <v-col cols="6" sm="4" md="3" lg="2" v-for="item in state.data" :key="item.id">
          <nuxtLink :to="`${props.name.toLowerCase()}/${item.id}`">
            <v-card class="grid-box rounded-xl" min-height="280">
              <v-card-item class="pa-3 position-relative" style="min-height: 208px">
                <ImageComp :src="item.image" :isUploaded="true" customClass="rounded-xl" :ratio="1"></ImageComp>
                <div class="rating">
                  <v-icon class="text-white">mdi-magnify</v-icon>
                </div>
              </v-card-item>
              <v-divider></v-divider>
              <v-card-text class="mb-5" style="min-height: 60px">{{ item.title }}</v-card-text>
              <v-card-item class="py-1">
                <span class="ml-9">
                  <v-icon size="13" class="ml-2">mdi-calendar-month-outline</v-icon>
                  <small>{{ dateConverter.convertToJalali(item.createdOn) }}</small>
                </span>
                <span>
                  <v-icon size="13" class="ml-2">mdi-eye-outline</v-icon>
                  <small>{{ item.view }}</small>
                </span>
              </v-card-item>
            </v-card>
          </nuxtLink>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
