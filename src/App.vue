<template>
  <Canvas/>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import Canvas from './components/Canvas.vue';

@Component({
  components: {
    Canvas
  }
})
export default class App extends Vue {}
</script>

<style lang='sass'>
  html, body
    height: 100%
    margin: 0
</style>
