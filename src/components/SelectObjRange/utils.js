import Mock from 'mockjs'

export const useTree = () => {
  const Random = Mock.Random
  Random.extend({
    depart: function (date) {
      const departments = [
        '市场拓展部',
        '人力资源部',
        '财务规划部',
        '产品研发部',
        '客户服务部',
        '信息技术部',
        '品牌管理部',
        '供应链管理部',
        '数据分析部',
        '战略投资部',
        '运营支持部',
        '法律事务部',
        '公共关系部',
        '培训发展部',
        '质量管理部',
        '创新实验室',
        '销售运营部',
        '国际业务部',
        '企业文化部',
        '采购管理部',
        '项目管理部',
        '技术研发部',
        '用户体验部',
        '风险管理部',
        '行政后勤部',
        '数字营销部',
        '商务合作部',
        '生产制造部',
        '环境安全部',
        '创意设计部'
      ]
      return this.pick(departments)
    }
  })

  let data = []
  let dataMap = {}

  const createData = (maxDeep, maxChildren, minNodesNumber, deep = 1, key = 'node') => {
    return Array.from({ length: minNodesNumber }).fill(deep).map(() => {
      // 判断是否是叶子节点
      const isLeaf = deep === maxDeep
      // 动态设置 type 的值
      const type = deep === 1 ? 1 : (isLeaf ? 3 : 2)

      const labelKey = deep === 1 ? Random.city() : (isLeaf ? Random.cfirst() + Random.clast() : Random.depart())
      // 生成子节点数量
      const childrenNumber = isLeaf ? 0 : Math.round(Math.random() * maxChildren)
      const nodeKey = `${Random.id()}`

      return {
        id: nodeKey,
        label: `${labelKey}`,
        data: {
          type: type // 根据层级设置 type
        },
        children: childrenNumber ? createData(maxDeep, maxChildren, childrenNumber, deep + 1, nodeKey) : undefined
      }
    })
  }
  const flattenTree = (tree, pid = 'node-0') => {
    return tree.reduce((acc, node) => {
      // 当前节点的扁平化数据
      const flattenedNode = {
        id: node.id,
        label: node.label,
        data: node.data,
        pid: pid // 添加父节点 ID
      }
      // 将当前节点加入结果数组
      acc.push(flattenedNode)

      // 如果有子节点，递归处理子节点
      if (node.children) {
        const flattenedChildren = flattenTree(node.children, node.id) // 当前节点的 ID 作为子节点的 pid
        acc.push(...flattenedChildren)
      }

      return acc
    }, [])
  }

  const getPath = (node) => {
    if (node.pid === 'node-0') return node.label // 根节点
    const parent = dataMap[node.pid] // 查找父节点
    return `${getPath(parent)}/${node.label}` // 拼接路径
  }

  const getData = () => {
    if (data.length === 0) {
      data = flattenTree(createData(3, 3, 100))
      dataMap = data.reduce((acc, cur) => {
        acc[`${cur.id}`] = cur
        return acc
      }, {})
    }
    return data.map((item) => {
      item.data.path = getPath(item)
      return item
    })
  }

  const searchData = (key) => {
    const filterData = data.filter((item) => item.label.includes(key))

    const result = filterData.map(item => {
      item.data.path = getPath(item)
      return {
        ...item
      }
    })
    return result
  }

  const getLoadData = (pid = 'node-0') => {
    const data = getData()
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const res = data.filter(item => item.pid === pid).map(item => {
          delete item.children
          return item
        })
        resolve(res)
      }, 1000)
    })
  }

  return {
    getData,
    searchData,
    getLoadData
  }
}
