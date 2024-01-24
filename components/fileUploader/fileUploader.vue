<script setup>
const props = defineProps(["imageIds","disabled"])
const emits = defineEmits(["update:modelValue"])

const state = reactive({
  disable: props.disabled,
  imageIds: props.imageIds,
  imageFiles: [],
  // uploadImage: false,
  uploadButtonText: 'انتخاب تصویر',
  // imageIsUploaded: false,
})

//#region UPLOAD
const fileUploadSelect = (event) => {
  // state.uploadImage = true
  if(!state.imageIds){
    state.imageIds = []
  }
  let files = event.target.files
  if (files) {
    for(let i=0;i<files.length;i++){
      state.imageIds.push(files[i].name)
      state.imageFiles.push(files[i])
    }
    emits("update:modelValue", state.imageFiles)
    //   let formData = new FormData();
    //   formData.append("file", file);
    //   uploadFile(formData)
  }
}

// async function uploadFile(formData) {
//   const onUploadProgress = (event) => {
//     const percentage = Math.round((100 * event.loaded) / event.total);
//     state.uploadButtonText = `درحال ذخیره: ${percentage}%`
//     if (percentage > 98) {
//       setTimeout(() => {
//         uploadButtonText('ذخیره شد')
//       }, 2000);
      
//     }
//   };
  
//   await axiosApi(40).post('admin/Files', formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//     onUploadProgress,
//   }).then(r => {
//     state.imageIds = r.data
//   }).catch(e => {
//     uploadButtonText('خطا در ذخیره کردن تصویر')
//     common.showError(e?.data?.messages)
//   }).finally(() => state.uploadImage = false)
//   emits("update:modelValue", state.imageIds)
// }

// const uploadButtonText = (text) => {
//   state.uploadButtonText = text
//   setTimeout(() => {
//     state.uploadButtonText = 'انتخاب تصویر'
//   }, 4000);
// }
//#endregion

const removeFile = (item) =>{
  const index = state.imageIds.indexOf(item);
  state.imageIds.splice(index, 1);
}

</script>
<template>
  <v-list>
    <v-list-item v-for="(item,index) in state.imageIds" :key="index" :title="item" 
    append-icon="mdi-close" @click="removeFile(item)" :disabled="state.disable ?? false">
    </v-list-item>
  </v-list>
  <label>
    <input type="file" class="d-none mt-5" @change="fileUploadSelect" accept="image/png, image/gif, image/jpeg"
      v-if="!state.uploadImage" multiple :disabled="state.disable ?? false">

    <v-alert border="start" border-color="deep-purple accent-4" elevation="2" class="mx-auto pa-2 cursor-pointer text-center"
      width="155px">
      {{ state.uploadButtonText }}
    </v-alert>
  </label>
</template>