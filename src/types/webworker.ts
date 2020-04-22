import { MouseButton } from '@/render/input-model';

/**
 * Size type.
 * @param {number} width Width of something.
 * @param {number} height Height of something.
 * @param {number} pixelRatio The ratio of the resolution in physical
 * pixels to the resolution in CSS pixels for the current display device
 */
export interface SizeOptions {
  width: number;
  height: number;
  pixelRatio: number;
}

/**
 * Types of message.
 */
export const enum MessageType {
  Main,
  Resize,
  Unload,
  KeyboardEvent,
  MouseEvent,
  TouchEvent,
  WheelEvent
}

/**
 * Base type of postmessage.
 * @param {MessageType} type Type of the message.
 */
export interface BaseMessage {
  type: MessageType;
}

/**
 * Size type of postmessage.
 * @param {SizeOptions} size Transferable size of something.
 */
export interface ResizeMessage extends BaseMessage {
  size: SizeOptions;
}

/**
 * Canvas type of postmessage.
 * @param {OffscreenCanvas} canvas OffscreenCanvas for GL usage.
 */
export interface CanvasMessage extends ResizeMessage {
  canvas: OffscreenCanvas;
}

/**
 * Base event message events.
 * @param {string} info Type of current event.
 */
export interface BaseEventMessage extends BaseMessage {
  info: string;
}

/**
 * Message for key events.
 * @param {string} code Property represents a physical key on the keyboard.
 */
export interface KeyboardMessage extends BaseEventMessage {
  code: string;
}

/**
 * Position for mouse or touch events.
 * @param {number} x Provides the offset in the X coordinate of the
 * pointer between that event and the padding edge of the canvas.
 * @param {number} y Provides the offset in the Y coordinate of the
 * pointer between that event and the padding edge of the canvas.
 */
export interface CanvasPosition {
  x: number;
  y: number;
}

/**
 * Message for mouse events.
 * @param {MouseButton} button Indicates which button was pressed on the mouse to trigger the event.
 * @param {CanvasPosition} position Provides the offset in the X, Y coordinates from start of canvas.
 */
export interface MouseMessage extends BaseEventMessage, CanvasPosition {
  button: MouseButton;
}

/**
 * Message for touch events.
 */
export interface TouchMessage extends BaseEventMessage, Partial<CanvasPosition> {}

/**
 * Message for wheel events.
 * @param {number} deltaY Delta in Y axis.
 */
export interface WheelMessage extends BaseEventMessage {
  deltaY: number;
}
