<script setup>
import noimage from "@/assets/img/no-image-icon.png"
import imageComp from "@/components/image.vue"
const props = defineProps(["modelValue","customeClass"])
const emits = defineEmits(["update:modelValue"])

const state = reactive({
  uploadImage: false,
  imageFile: noimage,
  uploadButtonText: 'انتخاب تصویر',
  imageIsUploaded: false,
})

//#region UPLOAD
const fileUploadSelect = (event) => {
  state.uploadImage = true
  const file = event.target.files[0]
  if (file) {
    state.imageFile = URL.createObjectURL(file)
    let formData = new FormData();
    formData.append("file", file);
    uploadFile(formData)
  }

}

async function uploadFile(formData) {
  const onUploadProgress = (event) => {
    const percentage = Math.round((100 * event.loaded) / event.total);
    state.uploadButtonText = `درحال ذخیره: ${percentage}%`
    if (percentage > 98) {
      setTimeout(() => {
        uploadButtonText('ذخیره شد')
      }, 2000);
      
    }
  };
  
  await axiosApi(40).post('user/Files', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  }).then(r => {
    state.modelValue = r.data
  }).catch(e => {
    uploadButtonText('خطا در ذخیره کردن تصویر')
    common.showError(e?.data?.messages)
  }).finally(() => state.uploadImage = false)
  emits("update:modelValue", state.modelValue)
}

const uploadButtonText = (text) => {
  state.uploadButtonText = text
  setTimeout(() => {
    state.uploadButtonText = 'انتخاب تصویر'
  }, 4000);
}
//#endregion

</script>

<template>
  <div class=" text-center ma-4">
    <label>
      <imageComp :src="props.modelValue" :path="state.imageFile" :no-image="noimage" :customClass="`mx-auto mb-3 ${props.customeClass}`"></imageComp>
      <input type="file" class="d-none" @change="fileUploadSelect" accept="image/png, image/gif, image/jpeg"
        v-if="!state.uploadImage">
      <v-alert border="start" border-color="deep-purple accent-4" elevation="2" class="mx-auto pa-2 cursor-pointer"
        width="155px">
        {{ state.uploadButtonText }}
      </v-alert>
    </label>
  </div>
</template>

<style></style>