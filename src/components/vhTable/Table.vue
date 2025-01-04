<template>
  <div class="table-container">
    <el-table ref="tableRef" v-loading="props.load" :data="tableData"
      :height="props.height ? props.height : defaultConfig.tableHeight" :stripe="defaultConfig.stripe"
      :border="defaultConfig.border" @sort-change="handleSortChange" @selection-change="handleSelectionChange"
      :default-sort="props.defaultSort">

      <!-- selection -->
      <el-table-column v-if="props.showColumn.includes('selection')" :fixed="defaultConfig.selectionFixed"
        type="selection" />

      <!-- index -->
      <el-table-column v-if="props.showColumn.includes('index')" :width="defaultConfig.indexWidth"
        :label="defaultConfig.indexLabel" :fixed="defaultConfig.indexFixed" :index="props.indexMethod" type="index" />

      <!-- 其他列 -->
      <template v-for="(column, i) in props.columnList" :key="i">
        <el-table-column v-if="props.showColumn.includes(column.prop)" :min-width="column.minWidth ? column.minWidth : defaultConfig.columnMinWidth
          " :showOverflowTooltip="column.showOverflowTooltip" :sortable="column.sortable ? 'custom' : false"
          :fixed="column.fixed" :align="column.align" :prop="column.prop">
          <template #header>
            <component v-if="column.component && column.component.enable" :is="renderLabel(column)" />
            <span v-else>
              {{
                typeof column.label === 'function'
                  ? column.label(column)
                  : column.label
              }}
            </span>
          </template>
          <template #default="scope">
            <component v-if="column.component && column.component.enable" :is="renderValue(column, scope)" />
            <span v-else>
              {{
                typeof column.value === 'function'
                  ? column.value(scope.row, column.prop, scope.$index)
                  : scope.row[column.prop]
              }}
            </span>
          </template>
        </el-table-column>
      </template>

      <!-- 操作列 -->
      <el-table-column v-if="props.operation && props.operation.length != 0" :label="defaultConfig.operationLabel"
        :fixed="defaultConfig.operationFixed" :width="defaultConfig.operationWidth">
        <template #default="scope">
          <template v-for="(oper, i) in operation" :key="i">
            <template v-if="!oper.isConfirm">
              <el-button v-if="
                typeof oper.hidden === 'function'
                  ? !oper.hidden(scope.row, scope.$index)
                  : true
              " :disabled="typeof oper.disabled === 'function'
                ? oper.disabled(scope.row, scope.$index)
                : false
                " :size="defaultConfig.operationSize" :type="oper.type" :icon="oper.icon"
                @click="handleOperEvent(oper, scope.row, scope.$index)">{{
                  typeof oper.label === 'function'
                    ? oper.label(scope.row, scope.$index)
                    : oper.label
                }}</el-button>
            </template>
            <template v-else>
              <el-popconfirm confirm-button-text="是" cancel-button-text="否" title="确定删除？"
                @confirm="handleOperEvent(oper, scope.row, scope.$index)">
                <template #reference>
                  <el-button v-if="
                    typeof oper.hidden === 'function'
                      ? !oper.hidden(scope.row, scope.$index)
                      : true
                  " :disabled="typeof oper.disabled === 'function'
                    ? oper.disabled(scope.row, scope.$index)
                    : false
                    " :size="defaultConfig.operationSize" :type="oper.type" :icon="oper.icon">{{
                      typeof oper.label === 'function'
                        ? oper.label(scope.row, scope.$index)
                        : oper.label
                    }}</el-button>
                </template>
              </el-popconfirm>
            </template>
          </template>
        </template>
      </el-table-column>

    </el-table>
  </div>

  <!-- 分页器 -->
  <div class="pagination-container">
    <el-pagination v-if="props.hasPagination" v-model:current-page="pageNum" v-model:page-size="pageSize"
      :total="props.pagination.total" :size="defaultConfig.paginationSize" :page-size="props.pagination.pageSizes"
      :background="props.pagination.background" :layout="props.pagination.layout" @change="handlePaginationChange" />
  </div>
</template>
<script setup>
import {
  defineEmits,
  defineProps,
  ref,
  reactive,
  watch,
  nextTick
} from 'vue'
const props = defineProps({
  load: {
    type: Boolean,
    default: () => false
  },
  showColumn: {
    type: Array,
    default: () => []
  },
  columnList: {
    type: Array,
    default: () => []
  },
  indexMethod: {
    type: Function,
    default: () => { }
  },
  operation: {
    type: Array,
    default: () => []
  },
  height: {
    type: Number,
    default: 0
  },
  data: {
    type: Array,
    default: () => []
  },
  hasPagination: {
    type: Boolean,
    default: () => false
  },
  pagination: {
    type: Object,
    default: () => { }
  },
  defaultSort: {
    type: Object,
    default: () => { }
  }
})

const emits = defineEmits([
  'paginationChange',
  'selectionChange',
  'selectable',
  'sortChange'
])

const defaultConfig = reactive({
  stripe: true,
  border: true,
  tableHeight: 500,
  selectionFixed: 'left',
  radioFixed: 'left',
  radioWidth: 55,
  indexFixed: 'left',
  indexLabel: '#',
  indexWidth: 55,
  columnMinWidth: 180,
  operationLabel: '操作',
  operationWidth: 200,
  operationFixed: 'right',
  operationSize: 'small',
  paginationSize: 'small'
})

const tableRef = ref(null)
const order = ref('ascending')
const orderProp = ref('')
const remoteSortColumn = ref([])
const tableData = ref([])
const columnMap = ref({})
const pageNum = ref(0)
const pageSize = ref(10)

watch(
  () => props.defaultSort,
  () => {
    if (props.defaultSort) {
      const { prop, order: ord } = props.defaultSort
      order.value = ord
      orderProp.value = prop
    }
  },
  {
    immediate: true
  }
)

watch(
  () => props.data,
  () => {
    tableData.value = props.data
    if (
      orderProp.value &&
      order.value &&
      !remoteSortColumn.value.includes(orderProp.value)
    ) {
      nextTick(() => {
        tableRef.value && tableRef.value.sort(orderProp.value, order.value)
      })
    }
  },
  {
    immediate: true
  }
)

watch(
  () => props.columnList,
  (column) => {
    columnMap.value = column.reduce((acc, cur) => {
      acc[cur.prop] = {
        ...cur
      }
      return acc
    }, {})
    remoteSortColumn.value = column.reduce((acc, cur) => {
      if (cur.remote) {
        acc.push(cur.prop)
      }
      return acc
    }, [])
  },
  {
    immediate: true
  }
)

watch(
  () => props.pagination,
  (pagination) => {
    if (props.hasPagination) {
      pageNum.value = pagination.pageNum
      pageSize.value = pagination.pageSize
    }
  },
  {
    immediate: true,
    deep: true
  }
)

const renderLabel = (column) => {
  const { component = {} } = column
  const label = component.label ? component.label : ''
  if (typeof label === 'function') {
    const component = label(column)
    return typeof component === 'string'
      ? renderCustomComponent(component, 'cell')
      : component
  }
  return renderCustomComponent(label, 'cell')
}

const renderValue = (column, scope) => {
  const { component = {} } = column
  const value = component.value
  if (typeof value === 'function') {
    const component = value(scope.row, column.prop, scope.$index, column)
    return typeof component === 'string'
      ? renderCustomComponent(component, 'cell')
      : component
  }
  return value
    ? renderCustomComponent(value, 'cell')
    : renderCustomComponent(scope.row[column.prop], 'cell')
}

const renderCustomComponent = (text, customClass = '') => {
  return <span>{text}</span>
}

const defaultSortMethod = (a, b, prop) => {
  const sortType = columnMap.value[prop].sortType || 'string'

  if (sortType === 'number') {
    return a[prop] - b[prop]
  }

  return a[prop].localeCompare(b[prop])
}

const handleSortChange = ({ column, prop, order: ord }) => {
  let sortData = []

  if (ord == null) {
    const ord = order.value === 'ascending' ? 'descending' : 'ascending'
    order.value = ord
  }

  order.value = ord
  orderProp.value = prop

  // *不管是否为远程排序，都往外抛
  emits('sortChange', { column, prop, order: order.value })

  const sortMethod = columnMap.value[prop].sortMethod
  if (typeof sortMethod !== 'function') {
    sortData = tableData.value.sort((a, b) => {
      return ord === 'ascending'
        ? defaultSortMethod(a, b, prop)
        : defaultSortMethod(b, a, prop)
    })
  } else {
    sortData = tableData.value.sort((a, b) => {
      return sortMethod(a, b, order.value)
    })
  }

  tableData.value = sortData
}

const handlePaginationChange = () => {
  emits('paginationChange', {
    pageSize: pageSize.value,
    pageNum: pageNum.value
  })
}

const handleSelectionChange = (selection) => {
  emits('selectionChange', selection)
}

const handleOperEvent = (oper, row, i) => {
  if (typeof oper.event === 'function') {
    oper.event(row, i)
  }
}

</script>
<style lang="scss" scoped>
.pagination-container {
  display: flex;
  justify-content: end;
  margin-top: 12px;
}
</style>
