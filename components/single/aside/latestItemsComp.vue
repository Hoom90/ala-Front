<script setup>
const props = defineProps(["name"])

const state = reactive({
  items: [],
  payload: {
    pageSize: 20,
    pageIndex: 1,
    contentType: props.name.toLowerCase() == "news" ? 1 : 2
  },
})

onMounted(async()=>{
  await getData()
})

const getData = async () => {
  await axiosApi().post(apiPath.public[props.name].get.all, state.payload)
    .then((res) => {
      state.items = res.data
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
    .finally(()=>{
      state.loading = false
    })
    state.payload.pageIndex++
}


</script>
<template>
  <v-card class="rounded-xl mb-5">
    <v-card-title>آخرین {{state.contentType?.toLowerCase() == 1 ? 'اخبار' : 'مقالات' }}</v-card-title>
    <v-divider></v-divider>
    <v-card-item>
      <v-list>
        <v-list-item
          v-for="(item, i) in state.items"
          :key="i"
          :value="item"
          rounded="xl"
          class="d-flex"
          :to="`/${props.name}/${item.id}`"
        >
        <template v-slot:prepend>
          <v-icon icon="mdi-circle-multiple" color="var(--theme-blue)"></v-icon>  
        </template>
        <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-item>
  </v-card>
</template>