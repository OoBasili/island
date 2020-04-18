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
  Main = 'main',
  Resize = 'resize',
  Unload = 'unload'
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
export interface CanvasMessage extends BaseMessage {
  canvas: OffscreenCanvas;
}
