// @flow

import type { $Request, $Response } from 'express';

const currentVersion = (req: $Request, res: $Response) => {
  res.end('1.0.0');
};

export default currentVersion;
