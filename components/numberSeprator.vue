<script setup lang="ts">
const props = defineProps(['modelValue', 'sepration'])
const emit = defineEmits(['update:modelValue'])
const state = reactive({
  input: '0',
})
watch(() => state.input, () =>{
  if(state.input.length > 2){
    emit('update:modelValue', state.input.replaceAll(',', ''))
  }
})
watch(() => props.modelValue, () => {
  state.input = parseInt(props.modelValue.replaceAll(',', '')).toLocaleString()
  })
</script>

<template>
<v-text-field variant="outlined" v-model="state.input"></v-text-field>
</template>
