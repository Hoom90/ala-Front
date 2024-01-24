<script setup>
import enemad from "@/assets/enamad.png";


</script>


<template>
  <v-footer class="d-flex flex-column pa-0 bg-grey-lighten-1">
    <section class="d-none d-md-flex align-center pa-3">
      <v-btn to="/" color="white" variant="text" class="mx-2" rounded="xl">
        <h4>صفحه اصلی</h4>
      </v-btn>
      <v-btn to="/page/53/درباره-ما" color="white" variant="text" class="mx-2" rounded="xl">
        <h4>درباره ما</h4>
      </v-btn>
      <img :src="enemad" width="80" />
      <v-btn to="/page/99/تماس-با-ما" color="white" variant="text" class="mx-2" rounded="xl">
        <h4>تماس با ما</h4>
      </v-btn>
      <v-btn to="/page/168/شرایط-و-قوانین" color="white" variant="text" class="mx-2" rounded="xl">
        <h4>شرایط و قوانین</h4>
      </v-btn>
    </section>




    <div class="px-4 py-2 bg-black text-center w-100">
      تمامی حقوق و مزایای این سایت متعلق به موسسه آلاء می باشد.
      طراحی و اجرا
      <a href="" class="text-red"><a href="http://sahab-eng.ir" target="_blank">
        <strong>شرکت سحاب</strong></a>
      </a>
    </div>
  </v-footer>
</template>

