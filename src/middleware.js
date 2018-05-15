// @flow

import type { $Request, $Response } from 'express';

function catchError(errCode: number = 500, next: (req: $Request) => {}) {
  return async (req: $Request, res: $Response) => {
    try {
      res.json(await next(req));
    } catch (e) {
      res.status(errCode).json({ message: e.message });
    }
  };
}

export default catchError;
