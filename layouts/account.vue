<script setup lang="ts">
import '@/assets/css/theme.css'
import HeaderView from "@/layouts/theme/headerView.vue";
import FooterView from "@/layouts/theme/footerView.vue";
import AsideView from "~/layouts/account/asideView.vue";

useHead({
  title: 'پنل کاربری'
})

</script>

<template>
<HeaderView />
  <v-main>
    <v-container>
      <v-row class="mb-5">
        <v-col cols="12" md="4" lg="3">
          <AsideView />
        </v-col>
        <v-col cols="12" md="8" lg="9">
          <v-card class="rounded-xl" min-height="545">
            <v-card-text>
              <slot />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
<FooterView />
</template>