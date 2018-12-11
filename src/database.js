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

export const Customer = sequelize.define('Customer', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  name: Sequelize.STRING,
  address: Sequelize.STRING,
  postalCode: Sequelize.STRING,
  city: Sequelize.STRING,
  country: Sequelize.STRING,
  stripeCustomerId: Sequelize.STRING,
});

Customer.belongsTo(User);

Customer.prototype.toObject = function toObject() {
  return {
    id: this.id,
    name: this.name,
    address: this.address,
    postalCode: this.postalCode,
    city: this.city,
    country: this.country,
    stripeCustomerId: this.stripeCustomerId,
  };
};

export const StripeLog = sequelize.define('StripeLog', {
  type: Sequelize.STRING,
  event: Sequelize.JSON,
});


export default sequelize;
