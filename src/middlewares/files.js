// @flow

import fs from 'fs';
import path from 'path';
import { isAfter } from 'date-fns';

import type { ThymeRequest } from '../types';

import { encrypt, decrypt } from '../helpers/encryption';

const fileDir = '../../tmp/';

function read(file: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(__dirname, fileDir, file),
      'utf8', (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            resolve('{}');
            return;
          }

          reject(err);
          return;
        }

        resolve(JSON.parse(decrypt(data)));
      },
    );
  });
}

function write(file: string, contents: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      path.resolve(__dirname, fileDir, file),
      encrypt(contents),
      'utf8',
      (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(true);
      },
    );
  });
}

export const saveJson = async ({ body, user }: ThymeRequest): Promise<boolean> => {
  if (!user || !user.id) {
    throw new Error('No user in auth token');
  }

  return write(user.id, JSON.stringify(body));
};

export const retrieveJson = async ({ user }: ThymeRequest): Promise<any> => {
  if (!user || !user.id) {
    throw new Error('No user in auth token');
  }

  if (!user.premium) {
    throw new Error('Not a premium user');
  }

  try {
    return read(user.id);
  } catch (e) {
    throw new Error('Error getting state');
  }
};

export const saveTempItem = async ({ body, user }: ThymeRequest): Promise<boolean> => {
  if (!user || !user.id) {
    throw new Error('No user in auth token');
  }

  const fileName = `temp_${user.id}`;

  try {
    const currentTempItem = await read(fileName);

    if (isAfter(currentTempItem.updatedAt, body.updatedAt)) {
      return false;
    }
  } catch (e) {
    // fail silently
  }

  return write(fileName, JSON.stringify(body));
};
