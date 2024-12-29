<template>
  <el-card class="account-manage-page">
    <adminTitle title="账号管理">
      <template #default>
        <el-button type="primary" @click="showAddDialog">新建</el-button>
      </template>
    </adminTitle>
    <vhTable :height="'calc(100vh - 210px)'" :load="loading" :data="tableData" :showColumn="showColumn"
      :columnList="columnList" :operation="operation" :indexMethod="indexMethod" @sortChange="handleSortChange" />
  </el-card>
  <addAccountDialog ref="addAccountDialogRef" @submit="onAdd" />
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue'
import { getAccountList, updateAccount, delAccount, addAccount } from '@/api/admin'
import { useTable, vhTable } from '@/components/vhTable'
import addAccountDialog from './component/addAccountDialog'
import { ElMessage } from 'element-plus'
const instance = getCurrentInstance()
const addAccountDialogRef = ref(null)
const showProp = ref(['index', 'account', 'password', 'auth', 'createdAt', 'updatedAt'])
const tableColumns = ref([
  {
    label: '账号',
    prop: 'account',
    component: {
      enable: true,
      showEdit: false,
      label: (column) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>账号</span>
            <el-icon onClick={() => { column.component.showEdit = !column.component.showEdit }}><Edit /></el-icon>
          </div>
        )
      },
      value: (row, prop, i, column) => {
        if (column.component.showEdit) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <el-input v-model={row[prop]} />
              <el-button onClick={() => { column.component.showEdit = false; onUpdate(row) }}>确定</el-button>
            </div>
          )
        } else {
          return <span>{row[prop]}</span>
        }
      }
    }
  },
  {
    label: '密码',
    prop: 'password',
    component: {
      enable: true,
      showEdit: false,
      label: (column) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>账号</span>
            <el-icon onClick={() => { column.component.showEdit = !column.component.showEdit }}><Edit /></el-icon>
          </div>
        )
      },
      value: (row, prop, i, column) => {
        if (column.component.showEdit) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <el-input v-model={row[prop]} />
              <el-button onClick={() => { column.component.showEdit = false; onUpdate(row) }}>确定</el-button>
            </div>
          )
        } else {
          return <span>{row[prop]}</span>
        }
      }
    }
  },
  {
    label: '权限',
    prop: 'auth',
    component: {
      enable: true,
      label: '权限',
      value: (row, prop, i) => {
        const auth = row[prop]
        const type = +auth === 1 ? 'info' : 'success'
        return (
          <el-tag type={type}>{+auth === 1 ? '普通权限' : '超级权限'}</el-tag>
        )
      }
    }
  },
  {
    prop: 'createdAt',
    label: '创建时间'
  },
  {
    prop: 'updatedAt',
    label: '创建时间',
    value: (row, prop, i) => {
      const { $filters } = instance.appContext.config.globalProperties
      return $filters.relativeTime(row[prop])
    }
  }
])
const operation = ref([
  {
    event: (row, index) => onDelect(row),
    type: 'danger',
    icon: 'Delete',
    isConfirm: true
  }
])
const fetchApi = async () => {
  const res = await getAccountList()
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

const onDelect = async (row) => {
  const res = await delAccount({ id: row.id })
  if (res.errorno === 1002) {
    ElMessage.error('账号 id 不能为空')
  } else {
    ElMessage.success('删除成功')
    getTableData()
  }
}
const onUpdate = async (row) => {
  const res = await updateAccount({
    account: row.account,
    password: row.password,
    id: row.id
  })
  if (res.errorno === 0) ElMessage.success('更新成功')
  getTableData()
}

const onAdd = async (data) => {
  const res = await addAccount(data)
  if (res.errorno === 0) ElMessage.success('添加成功')
  getTableData()
}

const showAddDialog = async () => {
  addAccountDialogRef.value.show()
}
onMounted(() => {
  getTableData()
})
</script>
<style lang="scss" scoped></style>
