<script setup>
const route = useRoute()
const data = await fetchApi.get(apiPath.public.News.get.byId(route.params.id))
  .then((res) => {
    let title = res.data.value.data.title
    let id = res.data.value.data.id
    publicbreadcrumbstore().setBreadCrumbs([
      {
        title: 'خانه',
        disabled: false,
        to: '/',
      },
      {
        title: title,
        disabled: true,
        to: `/${id}`,
      }])
    return res.data.value.data;
  }).catch(error => {
    common.showError(error?.messages)
  })

useHead({
  title: `${data.title}`,
  meta:[{name:'description',content:`${data.title}`}],
  meta:[{name:'keywords',content:`${data.keywordList}`}]
})

</script>

<template>
  <v-container>
    <v-card class="single-content rounded-xl">
      <v-card-title class="text-center my-5">
        <h2>{{ data?.title }}</h2>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div v-html="data?.body">
        </div>
      </v-card-text>
    </v-card>

  </v-container>
</template>
