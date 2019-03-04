// @flow

import fs from 'fs';
import path from 'path';

import { File, User } from '../database';

import { decrypt, encrypt } from './encryption';

const fileDir = '../../tmp/';

function remove(file: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.unlink(
      path.resolve(__dirname, fileDir, file),
      (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      },
    );
  });
}

function read(file: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(__dirname, fileDir, file),
      'utf8', (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            resolve({});
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

export async function readFile(type: string, userId: string) {
  const fileEntry = await File.findOne({
    where: {
      type,
      UserId: userId,
    },
    order: ['createdAt', 'DESC'],
  });

  if (!fileEntry) {
    return {};
  }

  return read(fileEntry.id);
}

export async function saveFile(type: string, userId: string, content: string) {
  const fileEntry = await File.create({
    type,
    UserId: userId,
  });

  return write(fileEntry.id, content);
}

export async function migrateOld() {
  const users = await User.all();

  return Promise.all(users.map(async (user) => {
    const content = await read(user.id);

    if (Object.keys(content).length > 0) {
      // there is some content here
      await saveFile('state', user.id, JSON.stringify(content));
      await remove(user.id);
    }

    const tempContent = await read(`temp_${user.id}`);

    if (Object.keys(tempContent).length > 0) {
      // there is some content here
      await saveFile('tempItem', user.id, JSON.stringify(tempContent));
      await remove(`temp_${user.id}`);
    }
  }));
}
