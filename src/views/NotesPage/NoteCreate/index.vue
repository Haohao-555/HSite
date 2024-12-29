<template>
  <div class="create_note_page">
    <adminTitle title="创建日记" />
    <el-form :model="form" size="small" ref="formRef" :rules="rules" label-position="right" label-width="80px">
      <el-form-item label="标题" prop="titleid">
        <TitleSelect ref="titleSelectRef" v-model="form.titleid" placeholder="请选择一个标题" />
      </el-form-item>
      <el-form-item label="站点" prop="site">
        <el-radio-group v-model="form.site">
          <el-radio :label="true">二十一</el-radio>
          <el-radio :label="false">四跃初酒 - 日记</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload v-model:file-list="fileList" :multiple="true" :limit="9" class="avatar-uploader"
          action="/notesApi/upload" list-type="picture-card" :on-remove="handleRemove" :on-success="handleSuccess"
          :on-exceed="handleExceed">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="form.content" type="textarea" :rows="10" />
      </el-form-item>
      <el-form-item label="日记私有" prop="private">
        <el-switch v-model="form.private" />
      </el-form-item>
      <el-form-item label="图片私有" prop="showImg">
        <el-switch v-model="form.showImg" />
      </el-form-item>
      <el-form-item label="谁可看">
        <NoteAuth :row="row" />
      </el-form-item>
      <div class="btn-group">
        <el-button type="primary" @click="sumbit">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createNote } from '@/api/home'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { setItem } from '@/utils/storage'
import { NOTE_MANAGE } from '@/constant'
import TitleSelect from '@/views/components/TitleSelect'
import NoteAuth from '@/views/NotesPage/components/NoteAuth'
import { useStore } from 'vuex'
const router = useRouter()
const store = useStore()
const formRef = ref(null)
const titleSelectRef = ref(null)
const titleList = computed(() => store.getters.titleList)
const form = ref({
  titleid: '',
  site: true,
  private: true,
  showImg: false,
  content: '',
  imgList: []
})
const rules = ref({
  content: {
    required: true,
    trigger: 'blur',
    message: '不能为空'
  },
  titleid: {
    required: true,
    trigger: 'blur',
    message: '不能为空'
  }
})
const fileList = ref([])

const row = computed(() => {
  const title = titleList.value.find(title => title.id === form.value.titleid) || {}
  return {
    title,
    site: form.value.site,
    private: form.value.private
  }
})

const cancel = () => { }

const handleRemove = (uploadFile, uploadFiles) => {
  const i = form.value.imgList.findIndex(
    (item) => item.fileName === uploadFile.name
  )
  if (i !== -1) {
    form.value.imgList.splice(i, 1)
  }
  console.log(form.value.imgList)
}

const handleSuccess = (res, file) => {
  if (res.errorno === 0) {
    form.value.imgList.push({
      name: res.name,
      fileName: file.name
    })
  }
}

const handleExceed = (res) => {
  ElMessage.warning('超出上传限制')
}

const sumbit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    const res = await createNote({
      content: form.value.content,
      private: form.value.private,
      titleid: form.value.titleid,
      imgList: form.value.imgList.map((item) => item.name),
      showImg: !form.value.showImg,
      site: form.value.site
    })
    if (res.errorno === 0) {
      setItem(NOTE_MANAGE, { titleid: [form.value.titleid] })
      router.push({
        path: '/nmanage/manageNote'
      })
      ElMessage.success('创建日记成功')
    } else {
      ElMessage.error(res.message)
    }
  })
}
</script>
<style lang="scss" scoped>
.create_note_page {
  padding: 10px;
  box-sizing: border-box;
  height: calc(100vh - 120px);

  .btn-group {
    display: flex;
    justify-content: end;
  }
}
</style>
