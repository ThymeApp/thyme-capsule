// @flow

import fs from 'fs';
import path from 'path';

import type { ThymeRequest } from './types';

import { encrypt, decrypt } from './encryption';

const fileDir = '../tmp/';

function read(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(__dirname, fileDir, file),
      'utf8', (err, data) => {
        if (err) {
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

export const retrieveJson = async ({ user }: ThymeRequest): Promise<string> => {
  if (!user || !user.id) {
    throw new Error('No user in auth token');
  }

  try {
    return await read(user.id);
  } catch (e) {
    throw new Error('Error getting state');
  }
};
