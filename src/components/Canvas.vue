<template>
  <canvas ref='canvas'/>
</template>

<script lang='ts'>
import Worker from 'worker-loader!@/render/render.ts';

import { Vue, Component } from 'vue-property-decorator';
import { MessageType } from '@/types/webworker';

@Component
export default class Canvas extends Vue {
  private worker = new Worker();

  private sendSize = (): void => {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    this.worker.postMessage({
      type: MessageType.Resize,
      size: {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        pixelRatio: window.devicePixelRatio
      }
    });
  }

  private mounted(): void {
    const canvas = this.$refs.canvas as HTMLCanvasElement;

    this.addListeners();
    this.sendSize();

    const offscreen = canvas.transferControlToOffscreen();
    this.worker.postMessage({
      type: MessageType.Main,
      canvas: offscreen
    }, [offscreen]);
  }

  private addListeners(): void {
    window.addEventListener('resize', this.sendSize);
    window.addEventListener('beforeunload', this.unload);
  }

  private removeListeners(): void {
    window.removeEventListener('resize', this.sendSize);
    window.removeEventListener('beforeunload', this.unload);
  }

  private unload = (): void => {
    this.worker.postMessage({
      type: MessageType.Unload
    });
    this.removeListeners();
  }

  private beforeDestroy(): void {
    this.unload();
  }
}
</script>

<style lang='sass'>
  canvas
    height: 100%
    width: 100%
    display: block
</style>
