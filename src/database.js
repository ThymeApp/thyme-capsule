import Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });

export const User = sequelize.define('User', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
});

sequelize.sync();

export default sequelize;
