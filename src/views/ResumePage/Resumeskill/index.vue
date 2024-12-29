<template>
  <div class="skill-page">
    <adminTitle title="技能特长">
      <template #default>
        <el-button size="small" type="warning" @click="addSkill">新增</el-button>
      </template>
    </adminTitle>
    <el-collapse v-model="activeNames">
      <el-collapse-item class="skill_item" v-for="(skill, i) in skillList" :key="i" :name="i">
        <template #title>
          <div style="margin-left: 12px;">
            <el-tag>🚀 {{ skill.content }}</el-tag>
          </div>
        </template>
        <el-form :model="skill" size="small" label-position="right" label-width="80px" style="margin-right: 12px;"
          :disabled="skill.disabled">
          <el-form-item label="内容" prop="content">
            <el-input v-model="skill.content" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-group">
          <el-button v-if="skill.isEdit" type="danger" @click="delResumeSkill(skill.id)" size="small">删除</el-button>
          <el-button size="small" type="primary" @click="sumbit(skill)">{{
            skill.disabled ? '编辑' : '提交'
          }}</el-button>
          <el-button size="small" @click="cancel(skill)">取消</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import {
  getResumeSkill,
  saveResumeSkill,
  updateResumeSkill,
  deleteResumeSkill
} from '@/api/admin'
import { ElMessage } from 'element-plus'

const activeNames = ref(-1)
// 技能特长
const skillList = ref([])

const addSkill = () => {
  skillList.value.push({
    disabled: false,
    isEdit: false,
    isHidden: false,
    content: '代填充'
  })
  activeNames.value = skillList.value.length - 1
}

const getResumeSkillList = async () => {
  const res = await getResumeSkill()
  skillList.value = res.data.rows.map((item) => {
    item.disabled = true
    item.isEdit = true
    return item
  })
}

const sumbit = async (skill) => {
  if (skill.disabled) {
    skill.disabled = false
  } else {
    if (skill.isEdit) {
      // 编辑
      await updateResumeSkill(skill)
      ElMessage.success('编辑成功')
    } else {
      // 创建
      await saveResumeSkill(skill)
      ElMessage.success('创建成功')
    }
    getResumeSkillList()
  }
}

const cancel = async (skill) => {
  if (skill.isEdit) {
    skill.disabled = true
  } else {
    const i = skillList.value.findIndex((item) => !item.isEdit)
    if (i) skillList.value.splice(i, 1)
  }
}
const delResumeSkill = async (id) => {
  await deleteResumeSkill({ id })
  ElMessage.success('删除成功')
  getResumeSkillList()
}
onMounted(() => {
  getResumeSkillList()
})
</script>
<style lang="scss" scoped>
.skill-page {
  padding-right: 12px;
  padding-bottom: 12px;
  box-sizing: border-box;
  height: calc(100vh - 120px);
}

.btn-group {
  display: flex;
  justify-content: end;
  margin-bottom: 12px;
  margin-right: 12px;
}
</style>
