<template>
  <canvas ref='canvas' tabindex='1'/>
</template>

<script lang='ts'>
import Worker from 'worker-loader!@/render/render.ts';

import { Vue, Component } from 'vue-property-decorator';
import { MessageType } from '@/types/webworker';
import { preventDefault } from '@/scripts/common/helpers';
import { MouseButton } from '@/render/input-model';

@Component
export default class Canvas extends Vue {
  private worker = new Worker();

  private beforeMount(): void {
    window.addEventListener('resize', this.sendSize);
    window.addEventListener('beforeunload', this.unload);
  }

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

  private key = (event: KeyboardEvent) => this.worker.postMessage({
    type: MessageType.KeyboardEvent,
    info: event.type,
    code: event.code
  });

  private mouse = (event: MouseEvent) => {
    ['mousedown', 'mouseup'].includes(event.type) && console.log(event.button);
    this.worker.postMessage({
      type: MessageType.MouseEvent,
      info: event.type,
      button: ['mousedown', 'mouseup'].includes(event.type) ? event.button : MouseButton.Move,
      x: event.offsetX,
      y: event.offsetY
    });
  }

  private touch = (event: TouchEvent) => this.worker.postMessage({
    type: MessageType.TouchEvent,
    info: event.type,
    x: event.targetTouches[0]?.clientX,
    y: event.targetTouches[0]?.clientY
  });

  private wheel = (event: WheelEvent) => this.worker.postMessage({
    type: MessageType.WheelEvent,
    info: event.type,
    deltaY: event.deltaY
  });

  private mounted(): void {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    const offscreen = canvas.transferControlToOffscreen();

    this.addCanvasListeners(canvas);
    this.worker.postMessage({
      type: MessageType.Main,
      size: {
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        pixelRatio: window.devicePixelRatio
      },
      canvas: offscreen
    }, [offscreen]);
  }

  private addCanvasListeners(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('keydown', this.key);
    canvas.addEventListener('keyup', this.key);
    canvas.addEventListener('mousedown', this.mouse);
    canvas.addEventListener('mouseup', this.mouse);
    canvas.addEventListener('mouseover', this.mouse);
    canvas.addEventListener('mousemove', this.mouse);
    canvas.addEventListener('mouseout', this.mouse);
    canvas.addEventListener('wheel', this.wheel);
    canvas.addEventListener('touchstart', this.touch);
    canvas.addEventListener('touchmove', this.touch);
    canvas.addEventListener('touchend', this.touch);
    canvas.addEventListener('touchcancel', this.touch);
    canvas.addEventListener('contextmenu', preventDefault);
  }

  private removeListeners(): void {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
  
    canvas.removeEventListener('keydown', this.key);
    canvas.removeEventListener('keyup', this.key);
    canvas.removeEventListener('mousedown', this.mouse);
    canvas.removeEventListener('mouseup', this.mouse);
    canvas.removeEventListener('mouseover', this.mouse);
    canvas.removeEventListener('mousemove', this.mouse);
    canvas.removeEventListener('mouseout', this.mouse);
    canvas.removeEventListener('wheel', this.wheel);
    canvas.removeEventListener('touchstart', this.touch);
    canvas.removeEventListener('touchmove', this.touch);
    canvas.removeEventListener('touchend', this.touch);
    canvas.removeEventListener('touchcancel', this.touch);
    canvas.removeEventListener('contextmenu', preventDefault);

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
    outline: none
    cursor: url(../assets/cursor.png), auto
    &:active
      cursor: none
</style>
