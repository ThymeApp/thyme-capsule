// @flow

import Sequelize from 'sequelize';

const connectionUrl = process.env.ENV === 'test'
  ? 'sqlite::memory:'
  : process.env.DATABASE_URL || '';

const sequelize = new Sequelize(connectionUrl, {
  logging: process.env.ENV === 'development' ? console.log : () => {}, // eslint-disable-line
  operatorsAliases: false,
});

export const User = sequelize.define('User', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  email: Sequelize.STRING,
  password: Sequelize.STRING(60),
  premium: Sequelize.BOOLEAN,
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

export default sequelize;
