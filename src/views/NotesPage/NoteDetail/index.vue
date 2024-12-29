<template>
  <div class="notes_detail_page">
    <adminTitle title="内容详情管理">
      <template #default>
        <div class="btn-group">
          <el-popconfirm confirm-button-text="是" cancel-button-text="否" title="确定删除？" @confirm="onDel"
            @cancel="cancelEvent">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button size="small" @click="back">返回</el-button>
        </div>
      </template>
    </adminTitle>
    <el-scrollbar :height="'calc(100vh - 220px)'">
      <div class="edit_content" v-load="loading">
        <el-form :model="detailForm" size="small" :rules="detailRules" :disabled="disabled" ref="detailRef">
          <el-form-item prop="titleid" label="标题">
            <TitleSelect ref="titleSelectRef" v-model="detailForm.titleid" placeholder="请选择一个标题" />
          </el-form-item>
          <el-form-item prop="images" label="照片" v-if="detailForm.images && detailForm.images.length != 0">
            <div class="imgList">
              <el-image v-for="(item, key) in detailForm.images" :key="key" loading="lazy" class="img_item" fit="cover"
                :src="item.url" :preview-src-list="detailForm.originImgUrl"></el-image>
            </div>
          </el-form-item>
          <el-form-item prop="site" label="站点">
            <el-radio-group v-model="detailForm.site">
              <el-radio :label="true">二十一</el-radio>
              <el-radio :label="false">四跃初酒 - 日记</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="content" label="内容">
            <el-input v-model="detailForm.content" type="textarea" :autosize="{ minRows: 6, maxRows: 100 }" />
          </el-form-item>
          <el-form-item prop="createdAt" label="创建日期">
            <el-date-picker v-model="detailForm.createdAt" type="date" size="small" :disabled="true"
              value-format="YYYY-MM-DD" />
          </el-form-item>
          <el-form-item prop="privates" label="日记私有">
            <el-switch v-model="detailForm.privates" />
          </el-form-item>
          <el-form-item prop="showImg" label="图片私有" v-if="detailForm.images && detailForm.images.length != 0">
            <el-switch v-model="detailForm.showImg" />
          </el-form-item>
          <el-form-item label="谁可看">
            <NoteAuth :row="row" />
          </el-form-item>
        </el-form>
      </div>
    </el-scrollbar>
    <div class="btn-group">
      <el-button @click="triggerState" size="small">{{
        disabled ? '编辑' : '取消'
      }}</el-button>
      <el-button type="primary" @click="sumbit" size="small" :disabled="disabled">提交</el-button>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getNotesList, delNotes, updateNote } from '@/api/admin'
import TitleSelect from '@/views/components/TitleSelect'
import NoteAuth from '@/views/NotesPage/components/NoteAuth'
import { getNotesauth } from '@/utils/notes'
import { useStore } from 'vuex'
const detailRef = ref(null)
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const id = computed(() => route.query.id)
const disabled = ref(false)
const titleSelectRef = ref(null)
const store = useStore()
const detailForm = ref({})
const detailRules = ref({
  content: {
    required: true,
    trigger: 'blur',
    message: '不能为空'
  }
})

const titleList = computed(() => store.getters.titleList)
const row = computed(() => {
  const title = titleList.value.find(title => title.id === detailForm.value.titleid) || {}
  return {
    title,
    site: detailForm.value.site,
    private: detailForm.value.private
  }
})

const getNotesDetail = async () => {
  const res = await getNotesList({ id: id.value })
  if (res.errorno === 0) {
    const data = res.data.list[0]
    data.privates = data.private
    data.showImg = !data.showImg
    const auth = getNotesauth(data)
    data.auth = auth
    detailForm.value = data
  }
}

const onDel = async () => {
  const res = await delNotes({ id: id.value })
  if (res.errorno === 0) {
    ElMessage.success('删除成功')
    router.back()
  }
}

const back = async () => {
  router.back()
}

const triggerState = async () => {
  const state = !disabled.value
  if (state) {
    await getNotesDetail()
  }
  disabled.value = state
}

const sumbit = async () => {
  detailRef.value.validate(async (valid) => {
    if (!valid) return
    const res = await updateNote({
      id: detailForm.value.id,
      titleid: detailForm.value.titleid,
      site: detailForm.value.site,
      content: detailForm.value.content,
      private: detailForm.value.privates,
      showImg: !detailForm.value.showImg
    })
    if (res.errorno === 0) ElMessage.success('更新日记成功')
    await getNotesDetail()
    disabled.value = true
  })
}

onMounted(async () => {
  loading.value = true
  await getNotesDetail()
  loading.value = false
})
</script>
<style lang="scss" scoped>
.notes_detail_page {
  padding: 10px;
  box-sizing: border-box;

  .edit_content {
    padding: 0 12px;

    .imgList {
      flex: 1;
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(9, 1fr);

      .img_item {
        border-radius: 4px;
        aspect-ratio: 1;
      }
    }
  }

  .btn-group {
    display: flex;
    justify-content: end;
  }
}
</style>
