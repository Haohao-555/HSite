<template>
  <el-card class="manage_notetitle_page">
    <adminTitle title="标题管理">
      <template #default>
        <el-button class="btn" type="primary" size="small" @click="showAddTitle = true">新建</el-button>
      </template>
    </adminTitle>
    <vhTable ref="tableRef" :height="'calc(100vh - 210px)'" :load="loading" :data="tableData" :showColumn="showColumn"
      :columnList="columnList" :operation="operation" :indexMethod="indexMethod" @sortChange="handleSortChange" />
  </el-card>
  <!-- 新建标题 -->
  <el-dialog v-model="showAddTitle" title="新建标题" draggable>
    <el-form :model="addform" :rules="formRules" ref="addformRef" size="small">
      <el-form-item prop="title" label="标题">
        <el-input v-model="addform.title" />
      </el-form-item>
      <el-form-item prop="type" label="类型">
        <el-select v-model="addform.type" placeholder="请选择类型">
          <el-option v-for="item in typeList" :key="item.value" :label="item.value" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="private" label="私有">
        <el-switch v-model="addform.private" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="showAddTitle = false">取消</el-button>
      <el-button type="primary" size="small" @click="addTitleSubmit">确定</el-button>
    </template>
  </el-dialog>
  <!-- 编辑标题 -->
  <el-dialog v-model="showEditTitle" title="编辑标题" draggable>
    <el-form :model="editform" :rules="formRules" ref="editformRef" size="small">
      <el-form-item prop="title" label="标题">
        <el-input v-model="editform.title" />
      </el-form-item>
      <el-form-item prop="type" label="类型">
        <el-select v-model="editform.type" placeholder="请选择类型">
          <el-option v-for="item in typeList" :key="item.value" :label="item.value" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="private" label="私有">
        <el-switch v-model="editform.private" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" @click="showEditTitle = false">取消</el-button>
      <el-button type="primary" size="small" @click="editTitleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTitle } from '@/api/home'
import { createTitle, editTitle, delTitle } from '@/api/admin'
import { useTable, vhTable } from '@/components/vhTable'
import { ElMessage } from 'element-plus'
import { setItem } from '@/utils/storage'
import { NOTE_MANAGE } from '@/constant'
import TimeColumn from '@/views/components/TableColumnsContent/TimeColumn'

const router = useRouter()
const addformRef = ref(null)
const editformRef = ref(null)
const showAddTitle = ref(false)
const showEditTitle = ref(false)

const addform = ref({
  title: '',
  type: 'primary',
  private: false
})
const formRules = ref({
  title: {
    required: true,
    trigger: 'blur',
    message: '不能为空'
  },
  type: {
    required: true,
    trigger: 'blur',
    message: '不能为空'
  }
})
const editform = ref({})

const typeList = ref([
  { value: 'primary' },
  { value: 'success' },
  { value: 'danger' },
  { value: 'warning' },
  { value: 'info' }
])

// 表格相关配置
const showProp = ref([
  'index',
  'content',
  'type',
  'private',
  'total',
  'createdAt'
])
const tableColumns = ref([
  {
    label: '内容',
    prop: 'content',
    component: {
      enable: true,
      label: '内容',
      value: (row, prop, i, column) => {
        return (<el-tag type={row.type}>{row.content}</el-tag>)
      }
    }
  },
  {
    label: '类型',
    prop: 'type',
    minWidth: '100'
  },
  {
    label: '属性',
    prop: 'private',
    component: {
      enable: true,
      label: '属性',
      value: (row, prop, i, column) => {
        const type = row.private ? 'info' : 'success'
        return (
          <el-tag type={type}>{
            row.private ? '私有' : '公开'
          }</el-tag>
        )
      }
    },
    minWidth: '80'
  },
  {
    label: '日记总数',
    prop: 'total',
    minWidth: '80',
    align: 'right'
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    component: {
      enable: true,
      label: '创建时间',
      value: (row, prop, i) => <TimeColumn row={row} field={prop} relativeTime />
    }
  }
])
const operation = ref([
  {
    event: (row, index) => onView(row),
    type: 'primary',
    icon: 'View'
  },
  {
    event: (row, index) => onEdit(row),
    icon: 'Edit'
  },
  {
    event: (row, index) => onDelect(row),
    type: 'danger',
    icon: 'Delete',
    isConfirm: true
  }
])
const fetchApi = async () => {
  const res = await getTitle()
  return {
    data: res.data.rows
  }
}
const {
  getTableData,
  tableData,
  columnList,
  showColumn,
  loading,
  indexMethod
} = useTable({
  defaultColumn: showProp,
  column: tableColumns,
  fetchApi,
  hasPagination: false
})
// end

const addTitleSubmit = () => {
  addformRef.value.validate(async (valid) => {
    if (!valid) return
    const res = await createTitle({
      type: addform.value.type,
      content: addform.value.title,
      private: addform.value.private
    })
    if (res.errorno === 0) ElMessage.success('创建标题成功')
    showAddTitle.value = false
    getTableData()
  })
}

const editTitleSubmit = () => {
  editformRef.value.validate(async (valid) => {
    if (!valid) return
    const res = await editTitle({
      id: editform.value.id,
      type: editform.value.type,
      content: editform.value.title,
      private: editform.value.private
    })
    if (res.errorno === 0) ElMessage.success('编辑标题成功')
    showEditTitle.value = false
    getTableData()
  })
}

const onEdit = (row) => {
  editform.value = {
    id: row.id,
    title: row.content,
    type: row.type,
    private: row.private
  }
  showEditTitle.value = true
}

const onView = (row) => {
  setItem(NOTE_MANAGE, {
    titleid: [row.id]
  })

  router.push({
    path: '/nmanage/manageNote'
  })
  console.log(row, 'onView')
}

const onDelect = async (row) => {
  const res = await delTitle({ id: row.id })
  if (res.errorno === 1001) {
    ElMessage.error('该标题下存在日记，不能删除')
  } else {
    getTableData()
  }
}
onMounted(() => {
  getTableData()
})
</script>
<style lang="scss" scoped>
.manage_notetitle_page {
  box-sizing: border-box;
}
</style>
