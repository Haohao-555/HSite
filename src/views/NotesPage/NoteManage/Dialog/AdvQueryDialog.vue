<template>
  <el-dialog v-model="showAdvancedQuery" title="高级条件" :before-close="cancel" draggable>
    <el-form :model="query" :rules="queryRules" ref="advformRef" size="small">
      <el-form-item prop="site" label="站点">
        <el-checkbox-group v-model="query.site">
          <el-checkbox value="1" name="type">二十一</el-checkbox>
          <el-checkbox value="2" name="type">四跃初酒</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="private" label="日记">
        <el-checkbox-group v-model="query.private">
          <el-checkbox value="1" name="type">私有</el-checkbox>
          <el-checkbox value="2" name="type">公开</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="showImg" label="图片">
        <el-checkbox-group v-model="query.showImg">
          <el-checkbox value="1" name="type">私有</el-checkbox>
          <el-checkbox value="2" name="type">公开</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="content" label="内容">
        <el-input v-model="query.content" type="textarea" :rows="10" placeholder="支持模糊查询" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button type="primary" size="small" @click="advSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, defineExpose } from 'vue'
const emits = defineEmits(['cancel', 'submit'])

const showAdvancedQuery = ref(false)
const advformRef = ref(null)
const query = ref({})
const queryRules = ref({})

const cancel = () => {
  emits('cancel')
  query.value = {}
  queryRules.value = {}
  showAdvancedQuery.value = false
  if (!advformRef.value) return
  advformRef.value.resetFields()
}

const advSubmit = () => {
  advformRef.value.validate(async (valid) => {
    if (!valid) return
    showAdvancedQuery.value = false
    emits('submit')
    query.value = {}
    queryRules.value = {}
  })
}

const showDialog = (form = {}, rules = {}) => {
  showAdvancedQuery.value = true
  query.value = form
  queryRules.value = rules
}

defineExpose({
  showDialog
})
</script>
