import { Shader } from '@/types/webgl';
import defaultFs from '@/shaders/default.fs';
import defaultVs from '@/shaders/default.vs';

export const DEFAULT_VS: Shader = {
  type: WebGL2RenderingContext.VERTEX_SHADER,
  value: defaultVs
};

export const DEFAULT_FS: Shader = {
  type: WebGL2RenderingContext.FRAGMENT_SHADER,
  value: defaultFs
};
