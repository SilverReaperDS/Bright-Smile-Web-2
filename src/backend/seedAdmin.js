// src/backend/seedAdmin.js
// Run once to create the admin user in MongoDB:
//   node src/backend/seedAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@brightsmile.com';
const ADMIN_PASSWORD = 'BrightSmile2025!';

  async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/brightSmile');

  const existing = await User.findOne({ username: ADMIN_USERNAME });
  if (existing) {
    console.log('Admin already exists. Nothing changed');
    process.exit(0);
  }

  const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);
  await User.create({
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: 'admin',
  });

  console.log('🎉 Admin user created successfully!');
  console.log(`   Username: ${ADMIN_USERNAME}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log('   ⚠️  Change this password after first login!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
