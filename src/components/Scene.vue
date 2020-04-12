<template>
  <div class="scene" ref="scene"/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';

@Component<Scene>({
  mounted() {
    const el = this.$refs.scene as Element;
    this.camera = new THREE.PerspectiveCamera(
      35,
      el.clientWidth / el.clientHeight,
      0.1,
      3000,
    );
    this.renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(this.renderer.domElement);

    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshLambertMaterial({ color: 0xF3FFE2 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, -100, -1000);

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(light);

    const light2 = new THREE.PointLight(0xffffff);
    this.scene.add(light2);
    this.scene.add(cube);

    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.y += 0.01;

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  },
})
export default class Scene extends Vue {
  private camera!: THREE.PerspectiveCamera;

  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();

  private scene: THREE.Scene = new THREE.Scene();
}
</script>

<style scoped lang="scss">
.scene {
  width: 100%;
  height: 100%;
}
</style>
