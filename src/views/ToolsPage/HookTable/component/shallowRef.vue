<template>
  <div>
    <h3>ref vs shallowRef</h3>
    <p>ref: {{ refValue.count }}</p>
    <p>shallowRef: {{ shallowRefValue.count }}</p>
    <button @click="changeRefInner">修改 ref 内部属性</button>
    <button @click="changeShallowRefInner">修改 shallowRef 内部属性</button>
    <button @click="changeShallowRefValue">替换 shallowRef 整个值</button>

    <h3>reactive vs shallowReactive</h3>
    <p>reactive.nested: {{ reactiveObj.nested.count }}</p>
    <p>shallowReactive.nested: {{ shallowReactiveObj.nested.count }}</p>
    <button @click="changeReactiveNested">修改 reactive 嵌套属性</button>
    <button @click="changeShallowReactiveNested">修改 shallowReactive 嵌套属性</button>
    <button @click="changeShallowReactiveValue">替换 shallowReactive 整个值</button>

  </div>
</template>

<script setup>
import { ref, shallowRef, reactive, shallowReactive } from 'vue'

// ----------------------
// 1. ref vs shallowRef
// ----------------------
const refValue = ref({ count: 0 }) // 深层响应式
const shallowRefValue = shallowRef({ count: 0 }) // 仅监听 .value 变化

const changeRefInner = () => {
  refValue.value.count++ // 触发更新
}

const changeShallowRefInner = () => {
  shallowRefValue.value.count++ // ❌ 不会触发更新
}

const changeShallowRefValue = () => {
  shallowRefValue.value = { count: 100 } // ✅ 触发更新
}

// ----------------------
// 2. reactive vs shallowReactive
// ----------------------
const reactiveObj = reactive({
  nested: { count: 0 } // 深层响应式
})

const shallowReactiveObj = shallowReactive({
  nested: { count: 0 } // 仅顶层响应式
})

const changeReactiveNested = () => {
  reactiveObj.nested.count++ // ✅ 触发更新
}

const changeShallowReactiveNested = () => {
  shallowReactiveObj.nested.count++ // ❌ 不会触发更新
}
const changeShallowReactiveValue = () => {
  shallowReactiveObj.nested = { count: 1 } // ✅ 触发更新
}
</script>
