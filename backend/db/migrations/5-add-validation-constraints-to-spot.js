'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('Spots', 'address', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });

    await queryInterface.changeColumn('Spots', 'city', {
      type: Sequelize.STRING(100),
    });

    await queryInterface.changeColumn('Spots', 'state', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });

    await queryInterface.changeColumn('Spots', 'country', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });

    await queryInterface.changeColumn('Spots', 'lat', {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
      },
    });

    await queryInterface.changeColumn('Spots', 'lng', {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
      },
    });

    await queryInterface.changeColumn('Spots', 'name', {
      type: Sequelize.STRING(100),
      validate: {
        len: [1, 50], // Name must be between 1 and 50 characters.
      },
    });

    await queryInterface.changeColumn('Spots', 'description', {
      type: Sequelize.STRING(200),
    });

    await queryInterface.changeColumn('Spots', 'price', {
      type: Sequelize.DECIMAL,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes (remove constraints)
    await queryInterface.changeColumn('Spots', 'address', {
      type: Sequelize.STRING(100),
    });

    await queryInterface.changeColumn('Spots', 'city', {
      type: Sequelize.STRING(100),
    });

    await queryInterface.changeColumn('Spots', 'state', {
      type: Sequelize.STRING(100),
    });

    await queryInterface.changeColumn('Spots', 'country', {
      type: Sequelize.STRING(100),
    });

    await queryInterface.changeColumn('Spots', 'lat', {
      type: Sequelize.DECIMAL,
    });

    await queryInterface.changeColumn('Spots', 'lng', {
      type: Sequelize.DECIMAL,
    });

    await queryInterface.changeColumn('Spots', 'name', {
      type: Sequelize.STRING(100),
    });

    await queryInterface.changeColumn('Spots', 'description', {
      type: Sequelize.STRING(200),
    });

    await queryInterface.changeColumn('Spots', 'price', {
      type: Sequelize.DECIMAL,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
   await queryInterface.changeColumn('Spots', 'address', {
    type: Sequelize.STRING(100),
  });

  await queryInterface.changeColumn('Spots', 'city', {
    type: Sequelize.STRING(100),
  });

  await queryInterface.changeColumn('Spots', 'state', {
    type: Sequelize.STRING(100),
  });

  await queryInterface.changeColumn('Spots', 'country', {
    type: Sequelize.STRING(100),
  });

  await queryInterface.changeColumn('Spots', 'lat', {
    type: Sequelize.DECIMAL,
  });

  await queryInterface.changeColumn('Spots', 'lng', {
    type: Sequelize.DECIMAL,
  });

  await queryInterface.changeColumn('Spots', 'name', {
    type: Sequelize.STRING(100),
  });

  await queryInterface.changeColumn('Spots', 'description', {
    type: Sequelize.STRING(200),
  });

  await queryInterface.changeColumn('Spots', 'price', {
    type: Sequelize.DECIMAL,
  })
  }
}
