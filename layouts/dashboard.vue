<script setup>
import '@/assets/css/admin.css'
import HeaderView from "@/layouts/dashboard/headerView.vue";
import AsideView from "@/layouts/dashboard/asideView.vue"

useHead({
  script: [{ src: '/libs/tinymce/tinymce.min.js' }]
})


const breadCrumbs = dashboardbreadcrumbstore()

const state = reactive({
  showDrawer: true,
  windowHeight:500,
})

onMounted(() => {
  state.showDrawer = Boolean(localStorage.getItem('sidebar') ?? '1')
  state.windowHeight=window.innerHeight-65
})

const saveState = () => (localStorage.setItem('sidebar', state.showDrawer ? '1' : ''))

const changeDrawerState = () => {
  state.showDrawer = !state.showDrawer
  saveState()
}

</script>
<template>
  <v-layout >
    <!-- style="max-width: 1440px;margin: auto;width: 100%;" -->
    <!-- <loading /> -->

    <AsideView v-model="state.showDrawer" @update:modelValue="saveState" />
    <v-main >
      <HeaderView @change="changeDrawerState" />

      <section class="pa-5 overflow-y-auto" :style="{height: state.windowHeight+'px'}">
        <!-- {{ breadCrumbs.getBreadCrumbs }} -->
        <v-breadcrumbs :items="breadCrumbs.getBreadCrumbs" class="pt-1 pb-5">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-left"></v-icon>
          </template>
        </v-breadcrumbs>
        <slot></slot>
      </section>
    </v-main>
  </v-layout>
</template>