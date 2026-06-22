const { sequelize } = require('./src/models');
require('dotenv').config();

const resetDatabase = async () => {
  try {
    console.log('🔄 Resetting database...');
    
    // Drop all tables
    await sequelize.drop({ cascade: true });
    console.log('✅ All tables dropped');

    // Sync database (create all tables)
    await sequelize.sync({ force: false });
    console.log('✅ Database tables synced');

    // Create default roles
    const { Role } = require('./src/models');
    await Role.bulkCreate([
      { role_name: 'Admin', description: 'Administrator' },
      { role_name: 'Landlord', description: 'Property Owner' },
      { role_name: 'Tenant', description: 'Renter' },
    ]);
    console.log('✅ Default roles created');

    console.log('✅ Database reset completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    console.error(error);
    process.exit(1);
  }
};

resetDatabase();
