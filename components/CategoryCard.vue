<script setup>
const props = defineProps(['modelValue', 'rules' , 'disabled'])
const emits = defineEmits(['update:modelValue'])

const state = reactive({
  categoryList: [],
  selectedCategories: props.modelValue,
  selectedreadonlyCategories: null,
})

watch(() => props.modelValue, () => {
  state.selectedCategories = props.modelValue
})
/**
 * Get Category List
 * @returns {Promise<void>}
 */
const getAllCategory = async () => {
  await axiosApi().get(apiPath.Category.get.all)
  .then((res) => {
    state.categoryList = res.data;
    state.selectedreadonlyCategories = state.categoryList?.data.filter(x=>state.selectedCategories.includes(x.id))
  }).catch((error) => {
    common.showError(error?.data?.messages)
  });
}
getAllCategory()
</script>

<template>
  <!-- <v-card class="mb-5">
    <v-card-title>دسته بندی</v-card-title>
    <v-divider></v-divider>
    <v-card-text> -->
      <!-- {{ state.categoryList }} -->
      <v-autocomplete v-model="state.selectedCategories" variant="outlined" chips closable-chips multiple :rules="props.rules"
        label="انتخاب دسته" :items="state.categoryList" item-title="fullTitle" item-value="id"
        @update:model-value="emits('update:modelValue', state.selectedCategories)" v-if="!props.disabled ?? true">
        <template v-slot:item="{ props, item }">
          <!-- {{ props }} -->
          <v-list-item v-bind="props" :class="{ 'text-center selected': !item?.raw?.selectable }"
            :disabled="!item?.raw?.selectable" :title="item?.raw?.fullTitle"></v-list-item>
        </template>

      </v-autocomplete>
      <v-list v-else>
          <v-list-item v-for="(item, index) in state.selectedreadonlyCategories" :title="item.fullTitle" :key="index"></v-list-item>
      </v-list>
    <!-- </v-card-text>
  </v-card> -->
</template>

<style scoped>
.selected {
  background-color: rgb(0, 119, 255);
}
</style>