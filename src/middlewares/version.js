// @flow

import fetch from 'node-fetch';
import type { $Request, $Response } from 'express';

const currentVersion = async (req: $Request, res: $Response) => {
  const version = await fetch(process.env.APP_PACKAGE_LOCATION)
    .then(response => response.json())
    .then(data => data.version)
    .catch(() => '0.0.0');

  res.end(JSON.stringify(version));
};

export default currentVersion;
