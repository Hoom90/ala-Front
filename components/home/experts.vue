<script setup>
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import imageComp from '@/components/image.vue'
const modules = [Navigation]
const state = reactive({
  data:[],
  payload: { pageSize: 10 },
})

 fetchApi.post(apiPath.public.Expert.get.paged, { body: state.payload })
  .then((res) => {
    state.data = res.data.value.data;
  }).catch(error => {
    common.showError(error?.messages)
  })

</script>
<template>
  <v-container>
    <v-card class="rounded-xl elevation-0" style="background: rgb(255 202 0 / 10%);backdrop-filter: blur(5px);">
      <v-card-title class="pa-9">
        <v-row>
          <v-col cols="6">
            <div class="STitle">
              <img src="@/assets/img/star-divider-line.png" width="40" />
              <h3>معرفی مشاورین</h3>
              <img src="@/assets/img/divider-line01.png" width="300" />
            </div>
          </v-col>
          <v-col cols="6">
            <div class="float-left">
              <NuxtLink to="/expert">
                <v-btn color="primary" variant="tonal" class="rounded-xl px-10">
                  <h4>بیشتر</h4>
                </v-btn>
              </NuxtLink>
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-5 pb-9">
        <swiper :slidesPerView="2" :spaceBetween="18" :modules="modules" :navigation="true" :breakpoints="{
          '768': {
            slidesPerView: 4,
            spaceBetween: 15,
          },
          '1024': {
            slidesPerView: 5,
            spaceBetween: 20,
          },
          '1360': {
            slidesPerView: 6,
            spaceBetween: 30,
          },
        }" class="overflow-visible">

          <swiper-slide class="grid-box" v-for="item in state.data" :key="item.id">
            <nuxtLink :to="`expert/${item.id}/${item.firstName.replaceAll(' ','-')}-${item.lastName.replaceAll(' ','-')}`">
              <v-card class="rounded-xl">
                <v-card-item class="pa-3 position-relative">
                  <imageComp v-if="item.imageId" :src="item.imageId" :isUploaded="true" is-thumbnail="true" :custom-class="'rounded-xl'" :ratio="1" :alt="item.title"></imageComp>
                  <div class="rating">
                    <v-icon class="text-white">mdi-magnify</v-icon>
                  </div>
                </v-card-item>
                <v-divider></v-divider>
                <v-card-text class="mb-5"><h4>{{ item.firstName + ' ' + item.lastName }}</h4></v-card-text>
                <v-card-item class="py-1">
                  <h5>
                    <span class="ml-9">
                      <v-icon size="13" class="ml-2">mdi-calendar-month-outline</v-icon>
                      <small>{{ dateConverter.someTimeAgo(item.createdOn) }}</small>
                    </span>
                    <span>
                      <v-icon size="13" class="ml-2">mdi-eye-outline</v-icon>
                      <small>{{ item.visitedCount }}</small>
                    </span>
                  </h5>
                </v-card-item>
              </v-card>
            </nuxtLink>
          </swiper-slide>

        </swiper>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<style scoped>
h4{
  text-wrap: pretty;
}
</style>