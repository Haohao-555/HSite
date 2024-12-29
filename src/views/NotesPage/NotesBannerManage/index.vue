<template>
  <el-card>
    <adminTitle title="轮播图管理">
      <template #default>
        <el-button type="primary" size="small" @click="showUploadImgDialog">上传</el-button>
      </template>
    </adminTitle>
    <vhTable ref="tableRef" :height="'calc(100vh - 212px)'" :load="loading" :data="tableData" :showColumn="showColumn"
      :columnList="columnList" :operation="operation" @sortChange="handleSortChange" :indexMethod="indexMethod"
      :defaultSort="defaultSort" />
    <!-- 上传图片 -->
    <el-dialog draggable v-model="showImgDialog" :title="editstate ? '编辑图片' : '上传图片'" :before-close="closeUploadDialog">
      <el-upload :disabled="editstate" class="avatar-uploader" action="/notesApi/upload" :show-file-list="false"
        :on-success="handleAvatarSuccess">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
          <Plus />
        </el-icon>
      </el-upload>
      <div style="margin-top: 12px">
        <el-radio-group v-model="form.top" v-if="imageUrl && !editstate">
          <el-radio :label="true">置顶</el-radio>
          <el-radio :label="false">不置顶</el-radio>
        </el-radio-group>
        <el-input v-if="imageUrl" type="textarea" :rows="6" placeholder="请输入 css" v-model="form.style" />
      </div>
      <template #footer>
        <div>
          <el-button size="small" @click="closeUploadDialog">取消</el-button>
          <el-button size="small" type="primary" @click="sumbitSaveBanner">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getBanner, updateBanner, saveBanner, delBanner } from '@/api/admin'
import { ElMessage } from 'element-plus'
import { useTable, vhTable } from '@/components/vhTable'
import TimeColumn from '@/views/components/TableColumnsContent/TimeColumn'
const showImgDialog = ref(false)
const editstate = ref(false)

const imageUrl = ref('')
const form = ref({
  url: '',
  style: '',
  top: false
})

// 表格相关配置
const defaultSort = ref({
  prop: 'top',
  order: 'descending'
})
const showProp = ref([
  'index',
  'originUrl',
  'top',
  'isDelete',
  'createdAt',
  'updatedAt'
])
const tableColumns = ref([
  {
    label: '图片',
    prop: 'originUrl',
    component: {
      enable: true,
      label: '图片',
      value: (row, prop, i, column) => {
        return (
          <el-image loading="lazy" class="img-item" fit="cover" src={row.originUrl} />
        )
      }
    },
    minWidth: '200'
  },
  {
    label: '位置',
    prop: 'top',
    component: {
      enable: true,
      label: '位置',
      value: (row, prop, i, column) => {
        return (
          <div style={{
            width: '80px',
            justifyContent: 'space-between',
            display: 'flex',
            alignItems: 'center'
          }}>
            {row.top && <el-tag>置顶</el-tag>}
            <el-switch v-model={row.top}
              onChange={() => updateBanners(row)} />
          </div>
        )
      }
    },
    minWidth: '100px',
    sortMethod: (a, b, ord) => {
      const prev = a.top ? 1 : 0
      const next = b.top ? 1 : 0
      return prev - next
    }
  },
  {
    label: '状态',
    prop: 'isDelete',
    component: {
      enable: true,
      label: '状态',
      value: (row, prop, i, column) => {
        return (
          <div style={{
            width: '80px',
            justifyContent: 'space-between',
            display: 'flex',
            alignItems: 'center'
          }}>
            {row.isDelete && <el-tag>隐藏</el-tag>}
            <el-switch v-model={row.isDelete} size="small" onChange={() => updateBanners(row)} />
          </div>
        )
      }
    },
    minWidth: '100px'
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    component: {
      enable: true,
      label: '创建时间',
      value: (row, prop, i) => <TimeColumn row={row} field={prop} relativeTime />
    }
  },
  {
    label: '更新时间',
    prop: 'updatedAt',
    component: {
      enable: true,
      label: '更新时间',
      value: (row, prop, i) => <TimeColumn row={row} field={prop} relativeTime />
    }
  }
])

const operation = ref([
  {
    event: (row, index) => editImg(row),
    icon: 'Edit'
  },
  {
    event: (row, index) => delImg(row),
    type: 'danger',
    icon: 'Delete',
    isConfirm: true
  }
])
const fetchApi = async () => {
  const res = await getBanner()
  if (res.errorno === 0) {
    return {
      data: res.data.rows
    }
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

const resetForm = () => {
  form.value = {
    url: '',
    style: '',
    top: false
  }
  imageUrl.value = ''
  editstate.value = false
}

const handleAvatarSuccess = (res, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  form.value.url = res.name
}

const sumbitSaveBanner = async () => {
  if (editstate.value) {
    await updateBanners(form.value)
  } else {
    await saveBanner(form.value)
    ElMessage.success('上传成功')
    getTableData()
  }

  showImgDialog.value = false
  resetForm()
}

const editImg = async (item) => {
  showImgDialog.value = true
  editstate.value = true
  form.value = { ...item }
  imageUrl.value = item.originUrl
}

const delImg = async (row) => {
  const res = await delBanner({ id: row.id })
  if (res.errorno === 0) {
    ElMessage.success('删除成功')
  }
  getTableData()
  console.log(row, 'delImg', delBanner)
}

const showUploadImgDialog = async () => {
  editstate.value = false
  showImgDialog.value = true
}
const updateBanners = async (data) => {
  console.log(data)
  await updateBanner(data)
  ElMessage.success('更新成功')
  getTableData()
}

const closeUploadDialog = () => {
  resetForm()
  showImgDialog.value = false
}

onMounted(() => {
  getTableData()
})
</script>
<style lang="scss" scoped>
.avatar-uploader {
  border: 1px dashed var(--qz-admin-border-color);
  border-radius: 3px;
  display: flex;
  justify-content: center;
  height: 300px;
  width: 80%;
  margin: auto;
}

.avatar-uploader .avatar {
  flex: 1;
  height: 300px;
  width: 100%;
  display: block;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.img-item {
  width: 140px;
  overflow: hidden;
  border-radius: 4px;
  // aspect-ratio: 1;
}
</style>
