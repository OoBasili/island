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
 * Message for mouse events.
 * @param {number} offsetX Provides the offset in the X coordinate of the mouse
 * pointer between that event and the padding edge of the target node.
 * @param {number} offsetY Provides the offset in the Y coordinate of the mouse
 * pointer between that event and the padding edge of the target node.
 */
export interface MouseMessage extends BaseEventMessage {
  offsetX: number;
  offsetY: number;
}

/**
 * Message for touch events.
 * @param {number} clientX X coordinate of the touch point relative to the left
 * edge of the browser viewport, not including any scroll offset.
 * @param {number} clientY Y coordinate of the touch point relative to the top
 * edge of the browser viewport, not including any scroll offset.
 */
export interface TouchMessage extends BaseEventMessage {
  clientX?: number;
  clientY?: number;
}

/**
 * Message for wheel events.
 * @param {number} deltaY Delta in Y axis.
 */
export interface WheelMessage extends BaseEventMessage {
  deltaY: number;
}
