<template>
  <el-dialog v-model="showDetailDialog" draggable :before-close="close">
    <template #header>
      <adminTitle :title="noteInfo.title">
        <template #default>
          <div style="margin-left: auto; display: flex; gap: 12px;">
            <el-tag type="info" v-if="noteInfo.imgLen !== 0">图片：{{ noteInfo.imgLen }} 张 {{ noteInfo.showImg
              }}</el-tag>
            <el-tag type="info" v-if="!noteInfo.site">四跃初酒</el-tag>
            <el-tag type="info">游客：{{ noteInfo.notesAuth.tourist ? '可看' : '不可看' }}</el-tag>
            <el-tag type="info">账号：{{ noteInfo.notesAuth.account ? '可看' : '不可看' }}</el-tag>
          </div>
        </template>
      </adminTitle>
    </template>
    <el-scrollbar height="400px">
      <div style="padding-right: 12px;" v-html="currentSelectRow.content"></div>
    </el-scrollbar>
    <div style="display: flex; justify-content: end;">
      <el-tag>{{ noteInfo.createdAt }}（{{ $filters.relativeTime(noteInfo.createdAt) }}）</el-tag>
    </div>
    <template #footer>
      <el-button @click="prev" :disabled="currentIndex === 0">上一篇</el-button>
      <el-button @click="next" :disabled="currentIndex === noteData.length - 1">下一篇</el-button>
      <el-button @click="onEdit(currentSelectRow)" type="primary">编辑</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, defineExpose } from 'vue'
import { getNotesauth } from '@/utils/notes'
const emits = defineEmits(['edit'])

const showDetailDialog = ref(false)
const noteData = ref([])
const currentSelectRow = ref({})
const currentIndex = ref(0)
const noteInfo = ref({
  title: '',
  titleType: '',
  imgLen: '',
  showImg: '',
  site: '',
  notesAuth: ''
})

const computedNoteInfo = (row) => {
  const auth = getNotesauth(row)
  const content = {
    title: row.title ? row.title.content : '',
    titleType: row.title ? row.title.type : '',
    showImg: row.showImg ? '公开' : '私有',
    imgLen: row.images.length,
    site: row.site,
    createdAt: row.createdAt,
    notesAuth: auth
  }
  return content
}

const next = () => {
  currentIndex.value = ++currentIndex.value
  updateRow()
}
const prev = () => {
  currentIndex.value = --currentIndex.value
  updateRow()
}
const onEdit = (row) => {
  emits('edit', row)
}

const updateRow = () => {
  currentSelectRow.value = noteData.value[currentIndex.value] || {}
  noteInfo.value = computedNoteInfo(currentSelectRow.value)
}

const showDialog = (data = [], index = 0) => {
  showDetailDialog.value = true
  noteData.value = data
  currentIndex.value = index
  updateRow()
}

const close = (done) => {
  currentIndex.value = 0
  noteData.value = []
  done()
}

defineExpose({
  showDialog
})
</script>
<style lang="scss" scoped></style>
