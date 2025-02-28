<template>
  <div>
    <p>原始对象: {{ rawObject }}</p>
    <p>响应式对象: {{ reactiveObj }}</p>
    <p>只读对象: {{ readonlyObj }}</p>
    <p>只读包裹响应式对象: {{ readonlyReactiveObj }}</p>
  </div>
</template>

<script setup>
import { reactive, readonly, isProxy, isReactive, isReadonly } from 'vue'

// 原始对象
const rawObject = { name: 'Alice' }

// 响应式对象
const reactiveObj = reactive(rawObject)

// 只读对象（直接包裹原始对象）
const readonlyObj = readonly(rawObject)

// 只读包裹响应式对象
const readonlyReactiveObj = readonly(reactive({ age: 25 }))

// 检测函数
const check = (obj, name) => {
  console.log(`----- ${name} -----`)
  console.log('isProxy:', isProxy(obj))
  console.log('isReactive:', isReactive(obj))
  console.log('isReadonly:', isReadonly(obj))
}

// 执行检测
check(rawObject, '原始对象')
// 全部返回 false
check(reactiveObj, '响应式对象')
// isProxy: true, isReactive: true, isReadonly: false
check(readonlyObj, '只读对象')
// isProxy: true, isReactive: false, isReadonly: true
check(readonlyReactiveObj, '只读包裹响应式对象')
// isProxy: true, isReactive: true, isReadonly: true
</script>
