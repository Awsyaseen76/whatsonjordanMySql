// 'use strict';

module.exports = {
  up: function(queryInterface, Sequelize){
    return queryInterface.bulkInsert('expenseTypes', [
      { type: 'Salary', createdAt: new Date(), updatedAt: new Date() }, 
      { type: 'Rent', createdAt: new Date(), updatedAt: new Date() }
    ], {});
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: function(queryInterface, Sequelize){
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
