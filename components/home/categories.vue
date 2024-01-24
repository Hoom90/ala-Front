<script setup>
import mother from '@/assets/img/icons/mother.png'
import open_book from '@/assets/img/icons/open-book.png'
import girl from '@/assets/img/icons/girl.png'
import delivery_boy from '@/assets/img/icons/delivery-boy.png'
import sexual from '@/assets/img/icons/sexual.png'
import students from '@/assets/img/icons/students.png'
const state = reactive({
  images: [mother, open_book, girl, delivery_boy, sexual, students],
  categories:[],
  payload: { pageSize: 10 }
})

fetchApi.post(apiPath.public.Category.post, { body: state.payload })
  .then((res) => {
    state.categories = res.data.value.data;
    let counter = 0;
    let temp = [];

    state.categories.forEach((item) => {
      if (counter === 6) return;
      temp.push(item);
      counter++;
    });
    state.categories = temp

  }).catch(error => {
    common.showError(error?.messages)
  })
</script>
<template>
  <v-container>
    <v-card class="categories rounded-xl" v-if="!pending">
      <v-card-title class="pa-9">
        <v-row>
          <v-col cols="6">
            <div class="STitle">
              <img src="@/assets/img/star-divider-line.png" width="40" />
              <h3>کلینیک مجازی</h3>
              <img src="@/assets/img/divider-line01.png" width="300" />
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-5 pb-9">
        <v-row class="justify-center">
          <v-col cols="6" sm="4" md="2" v-for="(item, index) in state.categories">
            <NuxtLink :to="`/category/${item.id}/${item.title.replaceAll(' ','-')}`">
              <img :src="state.images[index]" width="40" :alt="item.title"/>
              <h4>{{ item.title }}</h4>
            </NuxtLink>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
