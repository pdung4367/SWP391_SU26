const { sequelize } = require('./src/models');
require('dotenv').config();

const addTimestamps = async () => {
  try {
    console.log('🔄 Adding timestamps to users table...');

    // Check if columns exist
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('created_at', 'updated_at')
    `);

    const existingColumns = results.map(r => r.COLUMN_NAME);

    if (!existingColumns.includes('created_at')) {
      await sequelize.query(`
        ALTER TABLE users 
        ADD created_at DATETIME DEFAULT GETDATE()
      `);
      console.log('✅ Added created_at column');
    } else {
      console.log('ℹ️  created_at column already exists');
    }

    if (!existingColumns.includes('updated_at')) {
      await sequelize.query(`
        ALTER TABLE users 
        ADD updated_at DATETIME DEFAULT GETDATE()
      `);
      console.log('✅ Added updated_at column');
    } else {
      console.log('ℹ️  updated_at column already exists');
    }

    // Update existing rows
    await sequelize.query(`
      UPDATE users 
      SET created_at = GETDATE(), updated_at = GETDATE() 
      WHERE created_at IS NULL OR updated_at IS NULL
    `);
    console.log('✅ Updated existing rows');

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

addTimestamps();
