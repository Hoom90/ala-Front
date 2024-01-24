<script setup>
  import Slider from "@/components/home/slider.vue";
  import Categories from "@/components/home/categories.vue";
  import Experts from "@/components/home/experts.vue";
  import Articles from "@/components/home/articles.vue";
  import News from "@/components/home/news.vue";

publicbreadcrumbstore().setBreadCrumbs([])

</script>
<template>
  <Slider />
  <Categories />
  <Experts />
  <News />
  <Articles />
</template>
