<template>
  <div class="title-column">
    <div class="edit-content" v-if="edit">
      <TitleSelect v-model="titleVal" />
      <el-button icon="Check" type="primary" circle @click="submit"></el-button>
      <el-button icon="Close" circle @click="cancel"></el-button>
    </div>
    <div class="val" v-else>
      <el-tag v-if="title" :type="title.type ? title.type : 'info'">{{ title.content }}</el-tag>
    </div>
  </div>
</template>
<script setup>
import { defineProps, watch, ref, defineEmits } from 'vue'
import TitleSelect from '@/views/components/TitleSelect'
const emits = defineEmits(['cancel', 'submit'])
const props = defineProps({
  val: {
    type: String,
    default: ''
  },
  title: {
    type: Object,
    default: () => ({})
  },
  edit: {
    type: Boolean,
    default: false
  }
})

const titleVal = ref('')
watch(() => props.val, (val) => {
  titleVal.value = val
}, { immediate: true })

const submit = () => {
  emits('submit', titleVal.value)
}

const cancel = () => {
  emits('cancel')
}
</script>
<style lang="scss" scoped>
.title-column {
  .edit-content {
    display: flex;
    gap: 6px;

    .el-button {
      margin: 0px;
    }
  }
}
</style>
