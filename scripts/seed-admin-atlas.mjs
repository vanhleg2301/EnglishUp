import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://english-app-user:SGr3ZjOzhgcqQviG@cluster0.dfmwbjs.mongodb.net/english-app?retryWrites=true&w=majority&appName=Cluster0';
const EMAIL = 'admin@admin.com';
const PASSWORD = '123456';
const NAME = 'Admin';

const client = new MongoClient(MONGODB_URI);

try {
  await client.connect();
  console.log('Connected to Atlas');
  const db = client.db();
  const users = db.collection('users');

  const existing = await users.findOne({ email: EMAIL });
  if (existing) {
    console.log('User already exists, updating role to admin...');
    await users.updateOne({ email: EMAIL }, { $set: { role: 'admin' } });
    console.log('Done.');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(PASSWORD, 12);

  await users.insertOne({
    email: EMAIL,
    password: hashedPassword,
    name: NAME,
    role: 'admin',
    subscription: {
      status: 'active',
      plan: 'yearly',
      expiresAt: null,
    },
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log(`Admin user created: ${EMAIL} / ${PASSWORD}`);
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await client.close();
}
