// @flow

import fs from 'fs';
import path from 'path';

import { File } from '../database';

import { decrypt, encrypt } from './encryption';

const fileDir = '../../tmp/';

export function remove(file: string): Promise<any> {
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

export function read(file: string): Promise<any> {
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

export async function readFile(type: string, userId: string): Promise<any> {
  const fileEntry = await File.findOne({
    where: {
      type,
      UserId: userId,
    },
    order: [['createdAt', 'DESC']],
  });

  if (!fileEntry) {
    return {};
  }

  return read(fileEntry.id);
}

export async function cleanupFiles(type: string, userId: string) {
  const filesToDelete = await File.findAll({
    where: {
      type,
      UserId: userId,
    },
    order: [['createdAt', 'DESC']],
    offset: 5,
  });

  filesToDelete.forEach((file) => {
    // remove file
    remove(file.id);

    // remove database entry
    file.destroy();
  });

  return true;
}

export async function saveFile(type: string, userId: string, content: string) {
  const fileEntry = await File.create({
    type,
    UserId: userId,
  });

  try {
    await cleanupFiles(type, userId);
  } catch (e) {
    // silently fail
  }

  return write(fileEntry.id, content);
}
