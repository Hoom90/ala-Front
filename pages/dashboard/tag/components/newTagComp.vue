<script setup>

</script>

<template>
  <v-dialog transition="dialog-top-transition" width="400">
    <template v-slot:activator="{ props }">
      <v-btn class="bg-blue-grey-lighten-1" size="large" v-bind="props">
        <v-icon class="ml-2">mdi-plus-circle-multiple</v-icon>
        ایجاد برچسب جدید
      </v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-form @submit.prevent="createCategory">
        <v-card>
          <v-toolbar
              class="bg-blue-grey-lighten-1"
              title="برچسب جدید"
          ></v-toolbar>
          <v-card-text>
            <v-text-field variant="outlined" label="عنوان"></v-text-field>


            <v-textarea variant="outlined" label="توضیحات"></v-textarea>
          </v-card-text>
          <v-card-actions class="px-10 pb-10">
            <v-btn
                type="submit"
                variant="text"
                @click="isActive.value = false"
                class="bg-blue-grey-lighten-1"
                block
            >ذخیره</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </template>
  </v-dialog>
</template>
