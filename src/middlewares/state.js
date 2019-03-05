// @flow

import { isAfter } from 'date-fns';

import type { ThymeRequest } from '../types';

import { readFile, saveFile } from '../helpers/files';

export const saveJson = async ({ body, user }: ThymeRequest): Promise<boolean> => {
  if (!user || !user.id) {
    throw new Error('No user in auth token');
  }

  return saveFile('state', user.id, JSON.stringify(body));
};

export const retrieveJson = async ({ user }: ThymeRequest): Promise<any> => {
  if (!user || !user.id) {
    throw new Error('No user in auth token');
  }

  if (!user.premium) {
    throw new Error('Not a premium user');
  }

  try {
    return readFile('state', user.id);
  } catch (e) {
    throw new Error('Error getting state');
  }
};

export const saveTempItem = async (userId: string, item: any): Promise<boolean> => {
  try {
    const currentTempItem = await readFile('tempItem', userId);

    if (currentTempItem.updatedAt && isAfter(currentTempItem.updatedAt, item.updatedAt)) {
      return false;
    }
  } catch (e) {
    // fail silently
  }

  return saveFile('tempItem', userId, JSON.stringify(item));
};

export const retrieveTempItem = async ({ user }: ThymeRequest): Promise<any> => {
  if (!user || !user.id) {
    throw new Error('No user in auth token');
  }

  if (!user.premium) {
    throw new Error('Not a premium user');
  }

  try {
    return readFile('tempItem', user.id);
  } catch (e) {
    throw new Error('Error getting temporary item');
  }
};
