<template>
  <div>
    <h2>原始对象: {{ state }}</h2>
    <button @click="changeOriginal">修改原对象</button>

    <h3>toRef 示例</h3>
    <p>单个属性 ref: {{ ageRef }}</p>
    <button @click="changeToRef">修改 toRef</button>

    <h3>toRefs 示例</h3>
    <p>解构后的属性: {{ name }} - {{ age }}</p>
    <button @click="changeToRefs">修改 toRefs</button>
  </div>
</template>

<script setup>
import { reactive, toRef, toRefs, unref, isRef } from 'vue'

// 原始响应式对象
const state = reactive({
  name: 'Alice',
  age: 25,
  job: 'Engineer'
})

const { name: name1 } = state
console.log(isRef(name1), unref(name1))
console.log(isRef(state), 'state')
console.log(unref(state), 'state')
// ----------------------
// 1. toRef 的使用
// ----------------------
const ageRef = toRef(state, 'age') // 只处理单个属性

// ----------------------
// 2. toRefs 的使用
// ----------------------
const { name, age } = toRefs(state) // 解构整个对象

// 修改原对象
const changeOriginal = () => {
  state.age += 1
  state.name = 'Bob'
}

// 修改 toRef 的 ref
const changeToRef = () => {
  ageRef.value += 2 // 会同步到原对象
}

// 修改 toRefs 解构的 ref
const changeToRefs = () => {
  name.value = 'Charlie' // 会同步到原对象
}
</script>
