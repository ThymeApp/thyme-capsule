// @flow

import { User } from '../database';
import { saveFile, read, remove } from '../helpers/files';

export default async function migrateOld() {
  const users = await User.findAll();

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
