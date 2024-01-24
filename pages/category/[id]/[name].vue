<script setup>
import imageComp from '@/components/image.vue'
import apiPath from "~/composables/api-path";
const route = useRoute();
const router = useRouter();
const state = reactive({
  children: [],
  keywords:'',
  cities: [],
  data: null,
  panel: [0, 1],
  step: 15,
  experts: [],
})


/**
 * Get Childrens For Categories
 * @returns {Promise<void>}
 */
await fetchApi.get(apiPath.public.Category.get.byId(route.params.id))
  .then((res) => {
    publicbreadcrumbstore().setBreadCrumbs([
      { title: 'خانه', disabled: false, to: '/', },
      { title: 'دسته ها', disabled: true, to: '/', },
      { title: res.data.value.data.title, disabled: true, }
    ])
  }).catch(error => {
    common.showError(error?.data?.messages)
  })

fetchApi.post(apiPath.public.Category.post, { body: { "parentId": route.params.id } })
  .then((res) => {
    state.children = res.data.value.data
    state.children.forEach(item =>{
      state.keywords = item.title + ',' + state.keywords
    })
    useHead({
      title: 'دسته بندی ها',
      meta:[{name:'description',content:''}],
      meta:[{name:'keywords',content:`${state.keywords}`}]
    })
  }).catch(error => {
    common.showError(error?.data?.messages)
  })


/**
 * get All Cities List
 * @returns {Promise<void>}
  */
fetchApi.get(apiPath.public.Province.get)
  .then((cities) => {
    state.cities = cities.data.value.data
  })
  .catch((error) => {
    common.showError(error?.data?.messages)
  })

/**
 * get All Experts List by category id
 * @returns {Promise<void>}
  */
fetchApi.post(apiPath.public.Expert.category, { body: { categoryId: route.params.id } })
  .then((category) => {
    state.experts = category.data.value.data
  })
  .catch((error) => {
    common.showError(error?.data?.messages)
  })
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12" :md="4" lg="3">
        <v-expansion-panels class="rounded-xl" v-model="state.panel" multiple>

          <v-expansion-panel class="rounded-xl" title="زیر دسته">
            <v-expansion-panel-text v-if="state.children.length > 0">
              <v-btn variant="flat" v-for="item in state.children" :key="item.id" block class="mb-2" color="theme-blue"
                :to="`/category/${item.id}/${item.title.replaceAll(' ','-')}`">
                <h2 style="font-size: 1rem;">{{ item.title }}</h2>
              </v-btn>
            </v-expansion-panel-text>
            <v-expansion-panel-text v-else>بدون زیر دسته...
              <v-btn size="small" class="float-start" @click="router.go(-1)">بازگشت</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel class="rounded-xl" title="نمایش بر اساس">
            <v-expansion-panel-text>
              <v-switch label="بازدید بیشتر" class=" mr-auto" hide-details></v-switch>
              <v-switch label="سابقه بیشتر" hide-details></v-switch>
            </v-expansion-panel-text>

          </v-expansion-panel>

          <v-expansion-panel class="rounded-xl" title="سابقه فعالیت">
            <v-expansion-panel-text>
              <div class="text-center">
                <h3 class="border rounded pa-1 mx-auto">{{ state.step }} سال</h3>
              </div>
              <v-slider color="theme-blue" v-model="state.step" step="1" min="1" max="30" show-ticks="always"
                tick-size="3" thumb-label hide-details></v-slider>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel class="rounded-xl" title="جنسیت">
            <v-expansion-panel-text>
              <v-radio-group inline hide-details>
                <v-radio label="خانم" value="radio-1"></v-radio>
                <v-radio label="آقا" value="radio-2"></v-radio>
              </v-radio-group>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel class="rounded-xl" title="استان/شهر">
            <v-expansion-panel-text>
              <v-autocomplete variant="outlined" label="انتخاب شهر" :items="state.cities" item-title="fullTitle"
                item-value="id">
              </v-autocomplete>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="12" :md="8" lg="9">
        <v-row>
          <v-col cols="6" md="4" lg="3" v-for="item in state.experts" :key="item.id">
            <NuxtLink :to="`/expert/${item.id}/${item.firstName}%${item.lastName}`">
              <v-card class="rounded-xl" min-height="320">
                <v-card-item class="pa-3 position-relative">
                  <imageComp v-if="item.imageId" :src="item.imageId" :isUploaded="true" :custom-class="'rounded-xl'"
                    is-thumbnail="true"></imageComp>
                  <div class="rating">
                    <v-icon class="text-white mx-2">mdi-thumb-up-outline</v-icon>
                    <v-icon class="text-white mx-2 mt-3">mdi-thumb-down-outline</v-icon>
                  </div>
                </v-card-item>
                <v-divider></v-divider>
                <v-card-text class="mb-5"><h3 style="font-size: 1rem;">{{ item.firstName + ' ' + item.lastName }}</h3></v-card-text>
                <v-card-item class="py-1">
                  <h4>
                    <span class="ml-9">
                      <v-icon size="13" class="ml-2">mdi-calendar-month-outline</v-icon>
                      <small>{{ dateConverter.someTimeAgo(item.createdOn) }}</small>
                    </span>
                    <span>
                      <v-icon size="13" class="ml-2">mdi-eye-outline</v-icon>
                      <small>{{ item.view }}</small>
                    </span>
                  </h4>
                </v-card-item>
              </v-card>
            </NuxtLink>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

  </v-container>
</template>