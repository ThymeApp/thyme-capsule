// @flow

import fs from 'fs';
import path from 'path';

import type { ThymeRequest } from './types';

const fileDir = '../tmp/';

function read(file: string): Promise<JSON> {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, fileDir, file), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(JSON.parse(data));
    });
  });
}

function write(file: string, contents: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(__dirname, fileDir, file), contents, 'utf8', (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(true);
    });
  });
}

export const saveJson = async ({ body, user }: ThymeRequest): Promise<boolean> => {
  if (!user || !user.id) {
    throw new Error('No user in auth token');
  }

  return write(`${user.id}.json`, JSON.stringify(body));
};

export const retrieveJson = async ({ user }: ThymeRequest): Promise<JSON> => {
  if (!user || !user.id) {
    throw new Error('No user in auth token');
  }

  try {
    return await read(`${user.id}.json`);
  } catch (e) {
    throw new Error('Error getting state');
  }
};
