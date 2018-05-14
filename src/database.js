import Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });

export const User = sequelize.define('User', {
  email: Sequelize.STRING,
  password: Sequelize.STRING,
});

User.validEmail = (email) => {
  const re = /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i;
  return email.match(re);
};

sequelize.sync();

export default sequelize;
