// @flow

import Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite::memory:', { logging: false });

export const User = sequelize.define('User', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  email: Sequelize.STRING,
  password: Sequelize.STRING,
}, {
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
  ],
});

User.validEmail = (email: string) => {
  const re = /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i;
  return email.match(re);
};

User.prototype.toObject = function toObject() {
  return {
    id: this.id,
    email: this.email,
  };
};

sequelize.sync();

export default sequelize;
