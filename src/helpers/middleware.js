// @flow

import type { $Response } from 'express';
import type { ThymeRequest } from '../types';

function catchError(errCode: number = 500, next: (req: ThymeRequest) => Promise<any>) {
  return async (req: ThymeRequest, res: $Response) => {
    try {
      res.json(await next(req));
    } catch (e) {
      res.status(errCode).json({ message: e.message });
    }
  };
}

export default catchError;
