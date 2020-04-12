<template>
  <Scene />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Scene from './components/Scene.vue';

@Component({
  components: {
    Scene,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
  html {
    height: 100%;
  }
  body {
    margin: 0;
    height: 100%;
  }
</style>
