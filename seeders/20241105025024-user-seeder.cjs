'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const hashedPassword1 = await bcrypt.hash('123Admin', 10);
      const hashedPassword2 = await bcrypt.hash('123Fac', 10);
      const hashedPassword3 = await bcrypt.hash('123Mat', 10);
      const hashedPassword4 = await bcrypt.hash('123Max', 10);

      await queryInterface.bulkInsert(
        'Users',
        [
          {
            name: 'Admin',
            email: 'admin@admin.com',
            password: hashedPassword1,
            rol: 'padre',
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: 'facu',
            email: 'facu@facu.com',
            password: hashedPassword2,
            rol: 'estudiante',
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: 'mat',
            email: 'mat@mat.com',
            password: hashedPassword3,
            rol: 'estudiante',
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: 'max',
            email: 'max@max.com',
            password: hashedPassword4,
            rol: 'estudiante',
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error durante al iniciar el seeder user:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('Users', null, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error al deshacer el seeder:', error);
      throw error;
    }
  },
};
