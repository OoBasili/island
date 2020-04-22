import {
  CanvasMessage,
  ResizeMessage,
  BaseMessage,
  MessageType,
  KeyboardMessage,
  WheelMessage,
  MouseMessage,
  TouchMessage
} from '@/types/webworker';

import { RenderModel } from '@/render/render-model';
import { InputModel } from '@/render/input-model';
import { Scene } from '@/render/scene';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ctx: Worker = self as any;

function render(scene: Scene, now: number, then = 0) {
  scene.simulate(now-then);
  scene.draw();
  RenderModel.getInstance().setReqId(requestAnimationFrame(time => render(scene, time, now)));
}
  
ctx.onmessage = (e: MessageEvent) => {
  const data: BaseMessage = e.data;
  switch (data.type) {
  case MessageType.Main:
    RenderModel.getInstance().setReqId(
      requestAnimationFrame(time => render(new Scene(data as CanvasMessage), time))
    );
    break;
  case MessageType.Resize:
    RenderModel.getInstance().reshape((data as ResizeMessage).size);
    break;
  case MessageType.Unload: {
    const reqId = RenderModel.getInstance().getReqId();
    reqId && cancelAnimationFrame(reqId);
    break;
  }
  case MessageType.KeyboardEvent:
    InputModel.getInstance().keyboardHandler(data as KeyboardMessage);
    break;
  case MessageType.MouseEvent:
    InputModel.getInstance().mouseHandler(data as MouseMessage);
    break;
  case MessageType.TouchEvent:
    InputModel.getInstance().touchHandler(data as TouchMessage);
    break;
  case MessageType.WheelEvent:
    InputModel.getInstance().wheelHandler(data as WheelMessage);
    break;
  default:
    throw new Error(`No handler for type: ${data.type}`);
  }
};
