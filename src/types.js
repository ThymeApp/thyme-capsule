// @flow
import type { $Request } from 'express';

export type ThymeRequest = {
  body: { [key: string]: null | string | boolean | number };
  user?: { id: string, update: (updates: any) => any };
} & $Request;
