import { KeyboardMessage, WheelMessage, MouseMessage, TouchMessage, CanvasPosition } from '@/types/webworker';
import { Scene } from '@/render/scene';

export const enum MouseButton {
  Left = 0,
  Center = 1,
  Right = 2,
  Four = 3,
  Five = 4,
  Move = 100
}

export class InputModel {
  private static instance: InputModel;

  private keys: Set<string> = new Set();
  private mouse: Map<MouseButton, [CanvasPosition, Partial<CanvasPosition>]> = new Map();
  private touch: [Partial<CanvasPosition>, Partial<CanvasPosition>] = [{
    x: undefined,
    y: undefined
  }, {
    x: undefined,
    y: undefined
  }];
  private scene?: Scene;

  static getInstance(): InputModel {
    if (!InputModel.instance)
      InputModel.instance = new InputModel();
    
    return InputModel.instance;
  }

  getKeysState(codes: string[]): boolean {
    return codes.some(code => InputModel.instance.keys.has(code));
  }

  getMouseState(button: MouseButton): [CanvasPosition, Partial<CanvasPosition>] | undefined {
    return InputModel.instance.mouse.get(button);
  }

  setScene(scene: Scene) {
    InputModel.instance.scene = scene;
  };

  keyboardHandler({info, code}: KeyboardMessage) {
    switch(info){
    case 'keydown': {
      switch(code) {
      case 'KeyK':
        InputModel.instance.scene?.switchCamera();
        break;
      default:
        InputModel.instance.keys.add(code);
      }
      break;
    }
    case 'keyup': {
      InputModel.instance.keys.delete(code);
      break;
    }
    default:
    }
  }

  mouseHandler({info, x, y, button}: MouseMessage) {
    switch(info){
    case 'mousedown': {
      InputModel.instance.mouse.set(button, [{x, y}, {x: undefined, y: undefined}]);
      break;
    }
    case 'mouseover': {
      InputModel.instance.mouse.set(button, [{x, y}, {x: undefined, y: undefined}]);
      break;
    }
    case 'mousemove': {
      const state = InputModel.instance.mouse.get(button);
      if (!state)
        break;

      InputModel.instance.mouse.forEach((_, key) => 
        InputModel.instance.mouse.set(key, [{x, y}, state[0]])
      );
      break;
    }
    case 'mouseout': {
      InputModel.instance.mouse.delete(button);
      break;
    }
    case 'mouseup': {
      InputModel.instance.mouse.delete(button);
      break;
    }
    default:
    }
  }

  touchHandler({x, y}: TouchMessage) {
    Object.assign(InputModel.instance.touch, [{x, y}, InputModel.instance.touch[0]]);
  }

  wheelHandler({deltaY}: WheelMessage) {
    InputModel.instance.scene?.getCamera()?.zoom(Math.sign(deltaY));
  }
}