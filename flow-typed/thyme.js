import type { $Request } from './npm/express_v4.16.x';

declare class ThymeRequest mixins $Request {
  body: { [key: string]: null | string | boolean | number };
}
