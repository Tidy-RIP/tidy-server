'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        'Subjects',
        [
          {
            subjectName: 'Matemáticas',
            description: 'Estudio de números, formas y patrones',
            name_teacher: 'Johanna Dellagnolo',
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            subjectName: 'Programacion',
            description: '',
            name_teacher: 'Seba Bogarín',
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            subjectName: 'Proyecto Integrador',
            description: 'Trello, Jira y Proyectos',
            name_teacher: 'Miguel Badaracco',
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error al iniciar el seeder subjects:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('Subjects', null, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error al deshacer los seeders:', error);
      throw error;
    }
  },
};
