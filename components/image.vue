<script setup>
import no_image from '@/assets/img/no-image-icon.png'
const config = useRuntimeConfig()
const props = defineProps(['src', 'path', 'customClass', 'noImage', 'ratio', 'isThumbnail','alt'])
const emits = defineEmits(["update:modelValue"])

const image = ref(no_image)

onMounted(() => {
  if (props.src && props.src != '')
    image.value = config.public.baseURL + apiPath.File.url + (props.isThumbnail ? 'thumbnail/' : '') + props.src
  else if (props.path && props.path != '')
    image.value = props.path
  else if (props.noImage && props.noImage != '')
    image.value = props.noImage
})

watch(() => (props.path, props.src), () => {
  if (props.src && props.src != '')
    image.value = config.public.baseURL + apiPath.File.url + props.src
  else if (props.path && props.path != '')
    image.value = props.path
})
</script>
<template>
  <v-img :src="image" :class="props.customClass" :aspect-ratio="props.ratio??0" :alt="props.alt ?? 'مرکز مشاوره و خدمات روانشناختی آلاء'" />
</template>
<style>
img {
  object-fit: cover !important;
}
</style>