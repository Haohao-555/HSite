<template>
   <div class="beat-text" ref="textDOM">{{text}}</div>
</template>
<script setup>
import { onMounted, defineProps, ref } from 'vue'
const props = defineProps({
  text: {
    type: String,
    default: () => {
      return '跳动的文字'
    }
  }
})
const textDOM = ref(null)
const init = () => {
  const letters = props.text.split('')
  textDOM.value.textContent = ''
  letters.forEach((letter, i) => {
    const span = document.createElement('span')
    span.textContent = letter
    span.style.animationDelay = `${i / 10}s`
    textDOM.value.append(span)
  })
}
onMounted(() => {
  init()
})
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Baloo+Bhaijaan&display=swap');
.beat-text {
  display: flex;
  font-weight: bold;
  font-family: 'Baloo Bhaijaan', cursive;
  span {
    transform: translateY(6px);
    animation: bounce 0.3s ease infinite alternate;
  }
}
@keyframes bounce {
  to {
    transform: translateY(-3px);
  }
}
</style>
