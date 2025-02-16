<template>
  <el-card class="manage_note_page">
    <adminTitle title="管理日记">
      <template #default>
        <div class="tag-list">
          <el-tag type="danger" v-if="query.showHistorytoday" closable @close="getTableData">历史今天</el-tag>
          <div v-if="!query.showHistorytoday" class="filter-oper">
            <el-tag type="danger" v-if="query.id.length != 0" closable @close="clearNotesID">查询条件存在【指定日记】</el-tag>
            <el-tag type="info" v-if="query.private.length != 0">日记：{{ query.private.includes('1') ? '私有;' : '' }} {{
              query.private.includes('2') ? '公开;' : '' }}</el-tag>
            <el-tag type="info" v-if="query.site.length != 0">站点：{{ query.site.includes('1') ? '二十一;' : '' }} {{
              query.site.includes('2') ? '四跃初酒;' : '' }}</el-tag>
            <el-tag type="info" v-if="query.showImg.length != 0">图片：{{ query.showImg.includes('1') ? '私有;' : '' }} {{
              query.showImg.includes('2') ? '公开;' : '' }}</el-tag>
            <el-tag v-if="query.content.trim().length != 0" closable @close="clearBlurContent">内容：%{{
              query.content.trim() }}%</el-tag>
            <div style="cursor: pointer;" @click="showAdvQueryDialog">
              <svg-icon icon="filter" />
            </div>
          </div>
        </div>
      </template>
    </adminTitle>
    <div class="filter_container">
      <el-form v-if="!query.showHistorytoday" :model="query" :rules="queryRules" ref="formRef" :inline="true"
        size="small">
        <el-form-item prop="title" label="标题">
          <TitleSelect multiple v-model="query.titleid" />
        </el-form-item>
        <el-form-item label="创建时间">
          <TimeSelect v-model="query.createdDate" />
        </el-form-item>
      </el-form>
      <div class="btn_group">
        <el-button @click="exportSelectedData({ isOpenWorker: false, iszip: false, limit: 1 })"
          :disabled="loading">导出选中</el-button>
        <el-tooltip content="恢复到系统初始条件">
          <el-button @click="reset" :loading="loading" type="warning" plain
            :disabled="query.showHistorytoday">重置</el-button>
        </el-tooltip>
        <el-tooltip content="若条件中处在【指定日记】会进行移除">
          <el-button type="primary" @click="search" :loading="loading" :disabled="query.showHistorytoday">查询</el-button>
        </el-tooltip>
        <el-button @click="toCreateNotePage" type="danger" plain>创建日记</el-button>
        <el-tooltip content="历史今天">
          <el-badge v-if="query.historyNotesId.length != 0" :value="query.historyNotesId.length">
            <div @click="getHistorytodayNotesList">
              <svg-icon icon="bell" />
            </div>
          </el-badge>
        </el-tooltip>
        <column-select class="columnSelect" :showProp="showColumn" :columnList="columnList"
          @columnChange="columnChange" />
      </div>
    </div>
    <div class="content_container">
      <div class="table_container">
        <vhTable ref="tableRef" :height="'calc(100vh - 278px)'" :load="loading" :data="tableData" :issortable="true"
          :showColumn="showColumn" :columnList="columnList" :indexMethod="indexMethod" :operation="operation"
          :pagination="pagination" :hasPagination="pagination.enable" @paginationChange="getTableData"
          @selectionChange="onSelectionChange" @sortChange="handleSortChange" @sortRowChange="sortRowChange" />
      </div>
    </div>
    <!-- 高级条件弹窗 -->
    <AdvQueryDialog ref="advQueryDialogRef" />
    <!-- 内容详情弹窗 -->
    <DetailDialog ref="detailDialogRef" @edit="onEdit" />
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { getNotesList, delNotes, updateNote, getHistorytodayNotes, editTitle } from '@/api/admin'
import { getItem, setItem } from '@/utils/storage'
import { getNotesauth } from '@/utils/notes'
import { NOTE_MANAGE, HISTORYTODAY } from '@/constant'

import { useTable, vhTable, columnSelect } from '@/components/vhTable'
import AdvQueryDialog from './Dialog/AdvQueryDialog'
import DetailDialog from './Dialog/DetailDialog.vue'
import { ElMessage } from 'element-plus'
import TitleSelect from '@/views/components/TitleSelect'
import TimeSelect from '@/views/components/TimeSelect'
import NoteAuth from '@/views/NotesPage/components/NoteAuth'
import ImgColumn from '@/views/components/TableColumnsContent/ImgColumn'
import TimeColumn from '@/views/components/TableColumnsContent/TimeColumn'
import SiteColumn from '@/views/components/TableColumnsContent/SiteColumn'
import AttrColumn from '@/views/components/TableColumnsContent/AttrColumn'
import TitleColumn from '@/views/components/TableColumnsContent/TitleColumn'
import TableHeaderByEdit from '@/views/components/TableColumnsHeader/TableHeaderByEdit'
const router = useRouter()

const formRef = ref(null)
const detailDialogRef = ref(null)
const advQueryDialogRef = ref(null)

const isHistorytoday = async () => {
  const res = await getHistorytodayNotes()
  query.value.historyNotesId = res.data.rows.map(item => item.id)
}

const set_condition = () => {
  const confition = getItem(NOTE_MANAGE)
  let init_confition = query.value
  if (confition) {
    init_confition = Object.assign(init_confition, confition)
  }
  query.value = init_confition
}

// 表格相关配置
const showProp = ref([
  'index',
  'selection',
  'title',
  'content',
  'createdAt',
  'images',
  'auth',
  'title_private',
  'private',
  'site'
])
const tableColumns = ref([
  {
    label: '标题',
    value: (row, prop, i) => row.title.content,
    component: {
      enable: true,
      showEdit: false,
      label: (column) => {
        return (
          <TableHeaderByEdit
            column={column}
            onChange={() => { column.component.showEdit = !column.component.showEdit }}
          />
        )
      },
      value: (row, prop, i, column) => {
        return (
          <TitleColumn
            title={row.title}
            val={row.titleid}
            edit={column.component.showEdit}
            onCancel={() => { column.component.showEdit = false; getTableData() }}
            onSubmit={(titleid) => { row.titleid = titleid; handleEdit(row) }}
          />
        )
      }
    },
    prop: 'title',
    minWidth: '240px',
    fixed: 'left'
  },
  {
    label: '内容',
    showOverflowTooltip: true,
    prop: 'content',
    minWidth: '400px'
  },
  {
    label: '谁可看',
    prop: 'auth',
    value: (row, prop, i) => getNotesauth(row),
    component: {
      enable: true,
      label: '谁可看',
      value: (row, prop, i) => <NoteAuth row={row} />
    },
    minWidth: 300
  },
  {
    label: '图片',
    component: {
      enable: true,
      label: '图片',
      value: (row, prop, i) => <ImgColumn row={row} />
    },
    prop: 'images',
    minWidth: '120px'
  },
  {
    label: '标题属性',
    value: (row, prop, i) => row.title.private,
    component: {
      enable: true,
      showEdit: false,
      label: (column) => {
        return (
          <TableHeaderByEdit
            column={column}
            onChange={() => { column.component.showEdit = !column.component.showEdit }}
          />
        )
      },
      value: (row, prop, i, column) => {
        return (
          <AttrColumn
            val={row.title.private}
            publicAtr={false}
            edit={column.component.showEdit}
            onChange={() => { row.title.private = !row.title.private; handleEditTitle(row) }}
          />
        )
      }
    },
    prop: 'title_private',
    minWidth: '90px'
  },
  {
    label: '图片属性',
    component: {
      enable: true,
      showEdit: false,
      label: (column) => {
        return (
          <TableHeaderByEdit
            column={column}
            onChange={() => { column.component.showEdit = !column.component.showEdit }}
          />
        )
      },
      value: (row, prop, i, column) => {
        if (row.images.length === 0) return (<div></div>)
        return (
          <AttrColumn
            val={row.showImg}
            edit={column.component.showEdit}
            onChange={() => { row.showImg = !row.showImg; handleEdit(row) }}
          />
        )
      }
    },
    prop: 'showImg',
    minWidth: '100px'
  },
  {
    label: '日记属性',
    component: {
      enable: true,
      showEdit: false,
      label: (column) => {
        return (
          <TableHeaderByEdit
            column={column}
            onChange={() => { column.component.showEdit = !column.component.showEdit }}
          />
        )
      },
      value: (row, prop, i, column) => {
        return (
          <AttrColumn
            val={row.private}
            edit={column.component.showEdit}
            publicAtr={false}
            onChange={() => { row.private = !row.private; handleEdit(row) }}
          />
        )
      }
    },
    prop: 'private',
    minWidth: '100px'
  },
  {
    label: '站点',
    component: {
      enable: true,
      showEdit: false,
      label: (column) => {
        return (
          <TableHeaderByEdit
            column={column}
            onChange={() => { column.component.showEdit = !column.component.showEdit }}
          />
        )
      },
      value: (row, prop, i, column) => {
        return (
          <SiteColumn
            row={row}
            edit={column.component.showEdit}
            onChange={() => { row.site = !row.site; handleEdit(row) }}
          />
        )
      }
    },
    prop: 'site',
    align: 'right',
    minWidth: '110px'
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    component: {
      enable: true,
      label: '创建时间',
      value: (row, prop, i) => <TimeColumn row={row} field={prop} relativeTime />
    },
    minWidth: '240px'
  }
])
const operation = ref([
  {
    event: (row, index) => onSelect(row, index),
    type: 'primary',
    icon: 'View'
  },
  {
    event: (row, index) => onEdit(row, index),
    type: 'icon',
    icon: 'Edit'
  },
  {
    event: (row, index) => onDelect(row, index),
    type: 'danger',
    icon: 'Delete',
    isConfirm: true
  }
])
const pagination = ref({
  enable: true,
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true,
  total: 0,
  pageNum: 1,
  pageSize: 50,
  pageSizes: [10, 20, 50, 100]
})
const fetchApi = async ({ pageSize, pageNum }) => {
  // 关闭历史记录查询
  setItem(HISTORYTODAY, false)
  query.value.showHistorytoday = false

  if (!pageSize) pageSize = pagination.value.pageSize
  if (!pageNum) pageNum = pagination.value.pageNum
  const params = Object.assign(formatQuery(), {
    page: pageNum,
    pageSize: pageSize
  })

  const res = await getNotesList(params)
  if (res.errorno === 0) {
    pagination.value.total = res.data.total
    pagination.value.pageSize = pageSize
    pagination.value.pageNum = pageNum

    return {
      data: res.data.list,
      total: res.data.total,
      pageSize: pageSize,
      pageNum: pageNum
    }
  }
}
const {
  getTableData,
  tableData,
  indexMethod,
  onSelectionChange,
  columnList,
  showColumn,
  loading,
  columnChange,
  exportSelectedData
} = useTable({
  defaultColumn: showProp,
  column: tableColumns,
  fetchApi,
  hasPagination: true
})

const onSelect = (row, i) => {
  detailDialogRef.value.showDialog(tableData.value, i)
}

const onEdit = (row) => {
  router.push({
    path: '/notesdetail',
    query: {
      id: row.id
    }
  })
}

const onDelect = async (row) => {
  const res = await delNotes({ id: row.id })
  if (res.errorno === 0) {
    ElMessage.success('删除成功')
    getTableData({ pageNum: 1 })
  }
}

const handleEdit = async (row) => {
  const res = await updateNote({
    id: row.id,
    titleid: row.titleid,
    site: row.site,
    content: row.content,
    private: row.private,
    showImg: row.showImg
  })
  if (res.errorno === 0) ElMessage.success('更新日记成功')
  getTableData()
}

const handleEditTitle = async (row) => {
  const res = await editTitle({
    id: row.titleid,
    type: row.title.type,
    content: row.title.content,
    private: row.title.private
  })
  if (res.errorno === 0) ElMessage.success('编辑标题成功')
  getTableData()
}
// end

// 表单相关配置
const query = ref({
  id: [], // 日记 id
  titleid: [], // 标题
  createdDate: '', // 创建日期
  private: ['1', '2'], // 是否私有
  site: ['1', '2'], // 站点
  showImg: ['1', '2'], // 是否展示图片墙
  content: '', // 内容 （模糊搜索）
  historyNotesId: [], // 历史日记 id,
  showHistorytoday: false // 是否查询历史记录
})
const queryRules = ref({
  site: {
    required: true,
    trigger: 'blur',
    message: '不能为空'
  },
  private: {
    required: true,
    trigger: 'blur',
    message: '不能为空'
  },
  showImg: {
    required: true,
    trigger: 'blur',
    message: '不能为空'
  }
})

const search = async () => {
  // 把指定 id 设置为空
  query.value.id = []
  formRef.value.validate(async (valid) => {
    if (!valid) return
    getTableData({ pageNum: 1 })
  })
}
const clearBlurContent = async () => {
  query.value.content = ''
  getTableData()
}
const clearNotesID = async () => {
  query.value.id = []
  getTableData()
}
const showAdvQueryDialog = () => {
  advQueryDialogRef.value.showDialog(query.value, queryRules.value)
}

const toCreateNotePage = () => {
  router.push({
    path: '/nmanage/createNote'
  })
}
// end

const formatQuery = () => {
  const {
    id,
    titleid,
    showImg,
    createdDate,
    site,
    content,
    private: privates,
    historyNotesId,
    showHistorytoday
  } = query.value
  const params = {}

  let currentQuery = {}

  if (titleid) params.titleid = titleid
  if (createdDate) params.createdDate = createdDate
  if (content) params.content = content.trim()
  if (id) params.id = id

  currentQuery = Object.assign({
    historyNotesId,
    showHistorytoday
  }, params)

  if (!['1', '2'].every((num) => privates.includes(num))) {
    params.private = privates[0]
    currentQuery.private = [privates[0]]
  }

  if (!['1', '2'].every((num) => site.includes(num))) {
    params.site = site[0]
    currentQuery.site = [site[0]]
  }
  if (!['1', '2'].every((num) => showImg.includes(num))) {
    params.showImg = showImg[0]
    currentQuery.site = [showImg[0]]
  }

  setItem(NOTE_MANAGE, currentQuery)

  return params
}

const getHistorytodayNotesList = async () => {
  loading.value = true

  // 开启历史模式
  setItem(HISTORYTODAY, true)
  query.value.showHistorytoday = true

  const res = await getNotesList({ id: query.value.historyNotesId })
  loading.value = false

  tableData.value = res.data.list
  pagination.value.total = res.data.total
}

const initSystem = async () => {
  await isHistorytoday()
  await set_condition()

  if (query.value.showHistorytoday) {
    getHistorytodayNotesList()
  } else {
    getTableData()
  }
}

const reset = () => {
  const baseQuery = {
    id: [],
    titleid: [], // 标题
    createdDate: '', // 创建日期
    private: ['1', '2'], // 是否私有
    site: ['1', '2'], // 站点
    showImg: ['1', '2'], // 是否展示图片墙
    content: '' // 内容 （模糊搜索）
  }
  // 关闭历史查询
  setItem(HISTORYTODAY, false)
  query.value.showHistorytoday = false
  query.value = Object.assign(query.value, baseQuery)

  getTableData()
}

const sortRowChange = ({ newIndex, oldIndex, data }) => {
  console.log(newIndex, oldIndex, data)
}

onMounted(async () => {
  await initSystem()
})
</script>
<style lang="scss" scoped>
.manage_note_page {
  box-sizing: border-box;

  .tag-list {
    display: flex;
    gap: 6px;

    .el-tag {
      margin: 0 6px;
    }

    .filter-oper {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .filter_container {
    display: flex;
    margin-bottom: 12px;

    .el-form-item {
      margin-bottom: 0px;
    }

    .btn_group {
      display: flex;
      align-items: center;
      margin-left: auto;

      .el-badge {
        margin-left: 12px;
        margin-right: 12px;
      }
    }
  }

  .content_container {
    .table_container {
      margin-bottom: 12px;
    }
  }
}

::v-deep .el-icon {
  cursor: pointer
}
</style>
