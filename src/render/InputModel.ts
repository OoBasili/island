import { Camera } from './Camera';
import { KeyboardMessage, WheelMessage } from '@/types/webworker';

export class InputModel {
  private static instance: InputModel;
  private camera?: Camera;

  static getInstance(): InputModel {
    if (!InputModel.instance)
      InputModel.instance = new InputModel();
    
    return InputModel.instance;
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }

  keyboardHandler(data: KeyboardMessage) {
    switch(data.code) {
    case 'ArrowUp':
      this.camera?.moveOXZ(1, 0);
      break;
    case 'ArrowDown':
      this.camera?.moveOXZ(-1, 0);
      break;
    case 'ArrowRight':
      this.camera?.moveOXZ(0, 1);
      break;
    case 'ArrowLeft':
      this.camera?.moveOXZ(0, -1);
      break;
    case 'KeyA':
      this.camera?.rotate(1, 0);
      break;
    case 'KeyD':
      this.camera?.rotate(-1, 0);
      break;
    case 'KeyW':
      this.camera?.rotate(0, 1);
      break;
    case 'KeyS':
      this.camera?.rotate(0, -1);
      break;
    default:
    }
  }

  wheelHandler(data: WheelMessage) {
    this.camera?.zoom(Math.sign(data.deltaY));
  }
}