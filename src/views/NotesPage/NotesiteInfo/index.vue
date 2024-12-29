<template>
  <div class="note_info_page">
    <adminTitle title="基本信息" />
    <el-form class="form-container" :model="baseInfoform" :rules="baseInfoformRules" ref="baseInfoformRef" size="small"
      label-width="100px" label-position="right" :disabled="baseinfo_diabled">
      <el-form-item prop="logoTitle" label="站点名">
        <el-input name="logoTitle" type="text" v-model="baseInfoform.logoTitle" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="motto" label="座右铭">
        <el-input name="motto" type="text" v-model="baseInfoform.motto"></el-input>
      </el-form-item>
      <el-form-item prop="notesCardContent" label="卡片置顶内容">
        <el-input name="motto" type="textarea" v-model="baseInfoform.notesCardContent" :rows="10"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn-group">
      <el-button @click="triggerbaseState" size="small">{{
        baseinfo_diabled ? '编辑' : '取消'
      }}</el-button>
      <el-button type="primary" :disabled="baseinfo_diabled" size="small" @click="submit_baseinfo">提交</el-button>
    </div>
    <el-divider content-position="right">end</el-divider>
    <adminTitle title="密钥管理" />
    <el-form size="small" :model="baseInfoform" :rules="baseInfoformRules" ref="baseInfoformRef">
      <el-form-item prop="token" label="密钥">
        <el-input name="logoTitle" type="text" v-model="baseInfoform.token" :disabled="token_disabled"></el-input>
      </el-form-item>
      <div class="btn-group">
        <el-button @click="triggerTokenState" size="small">{{
          token_disabled ? '编辑' : '取消'
        }}</el-button>
        <el-button type="primary" @click="submit_baseinfo" :disabled="token_disabled">提交</el-button>
      </div>
    </el-form>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSiteInfo } from '@/api/home'
import { updateSite } from '@/api/admin'
const baseInfoformRef = ref(null)
const baseInfoform = ref({})
const baseinfo_diabled = ref(true)
const token_disabled = ref(true)
const baseInfoformRules = ref({
  motto: [
    {
      required: true,
      trigger: 'blur',
      message: '不能为空'
    }
  ],
  token: [
    {
      required: true,
      trigger: 'blur',
      message: '不能为空'
    }
  ]
})

const getsiteInfo = async () => {
  const res = await getSiteInfo()
  if (res.errorno === 0) {
    baseInfoform.value = res.data
  }
}

const submit_baseinfo = () => {
  baseInfoformRef.value.validate(async (valid) => {
    if (!valid) return
    const res = await updateSite(baseInfoform.value)
    if (res.errorno === 0) {
      ElMessage.success('更新站点信息成功')
      const { token, motto, notesCardContent } = res.data
      baseInfoform.value.token = token
      baseInfoform.value.motto = motto
      baseInfoform.value.notesCardContent = notesCardContent
    } else {
      ElMessage.error(res.message)
    }
    baseinfo_diabled.value = true
    token_disabled.value = true
  })
}

const triggerbaseState = async () => {
  const state = !baseinfo_diabled.value

  if (state) {
    await getsiteInfo()
  }
  baseinfo_diabled.value = state
}

const triggerTokenState = async () => {
  const state = !token_disabled.value
  if (state) {
    await getsiteInfo()
  }
  token_disabled.value = state
}
onMounted(() => {
  getsiteInfo()
})
</script>
<style lang="scss" scoped>
.note_info_page {
  padding: 10px;
  box-sizing: border-box;

  .btn-group {
    display: flex;
    justify-content: end;
  }
}
</style>
