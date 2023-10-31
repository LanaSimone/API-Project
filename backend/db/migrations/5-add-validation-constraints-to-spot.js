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
      validate: {
        notNull: {
          msg: 'Street address is required',
        },
      },
    });

    await queryInterface.changeColumn('Spots', 'city', {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'City is required',
        },
      },
    });

    await queryInterface.changeColumn('Spots', 'state', {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'State is required',
        },
      },
    });

    await queryInterface.changeColumn('Spots', 'country', {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Country is required',
        },
      },
    });

    await queryInterface.changeColumn('Spots', 'lat', {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Latitude is not valid',
        },
        isFloat: {
          msg: 'Latitude must be a valid number',
        },
      },
    });

    await queryInterface.changeColumn('Spots', 'lng', {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Longitude is not valid',
        },
        isFloat: {
          msg: 'Longitude must be a valid number',
        },
      },
    });

    await queryInterface.changeColumn('Spots', 'name', {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name is required',
        },
        len: {
          args: [1, 50],
          msg: 'Name must be less than 50 characters',
        },
      },
    });

    await queryInterface.changeColumn('Spots', 'description', {
      type: Sequelize.STRING(200),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Description is required',
        },
      },
    });

    await queryInterface.changeColumn('Spots', 'price', {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Price per day is required',
        },
        isFloat: {
          msg: 'Price must be a valid number',
        },
      },
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
