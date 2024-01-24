<script setup>
import ImageComp from '@/components/image.vue'
publicbreadcrumbstore().setBreadCrumbs([
  {
    title: 'خانه',
    disabled: false,
    to: '/',
  },
  {
    title: 'دسته بندی ها',
    disabled: true,
    to: '/categories',
  }])
const state = reactive({
  data: [],
})

onMounted(async () => {
  await getData()
})

const getData = async () => {
  await axiosApi().get(apiPath.public.Category.get)
    .then((res) => {
      state.data= res.data
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}


</script>
<template>
  <v-container>
    <div id="table">
      <v-row>
        <v-col cols="6" sm="4" md="3" lg="2" v-for="item in state.data" :key="item.id">
          <nuxtLink :to="`categories/${item.id}`">
            <v-card class="grid-box rounded-xl" min-height="280">
              <v-card-item class="pa-3 position-relative" style="min-height: 208px">
                <ImageComp :src="item?.imageId"></ImageComp>
              </v-card-item>
              <v-divider></v-divider>
              <v-card-text class="mb-5">{{ item.fullTitle }}</v-card-text>
            </v-card>
          </nuxtLink>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

