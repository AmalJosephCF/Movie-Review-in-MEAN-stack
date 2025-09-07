import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin', 10);

      const admin = new User({
        name: 'Admin',
        username: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });

      await admin.save();
      console.log('✅ Default admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (err) {
    console.error('Error creating admin user:', err.message);
  }
};

export default createAdmin;
