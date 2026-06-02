const { sequelize, User, Role, OtpVerification } = require('./src/models');
require('dotenv').config();

const checkDatabase = async () => {
  try {
    console.log('🔍 Checking database...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Check tables
    const tables = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'dbo'
    `);
    
    console.log('\n📋 Existing tables:');
    tables[0].forEach(table => {
      console.log(`  - ${table.TABLE_NAME}`);
    });

    // Check roles
    const roleCount = await Role.count();
    console.log(`\n👥 Roles count: ${roleCount}`);
    
    if (roleCount > 0) {
      const roles = await Role.findAll();
      console.log('Roles:');
      roles.forEach(role => {
        console.log(`  - ${role.role_name}`);
      });
    }

    // Check users
    const userCount = await User.count();
    console.log(`\n👤 Users count: ${userCount}`);

    console.log('\n✅ Database check completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

checkDatabase();
