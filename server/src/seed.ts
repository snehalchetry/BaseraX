import mongoose from 'mongoose';
import { config } from './config/env';
import User from './models/User';

const testUsers = [
    {
        name: 'Test Student',
        email: 'test2501@cgc.edu',
        phone: '9876500000',
        password: 'Abcd@99881',
        role: 'student',
        rollNumber: '2501003106',
        roomNumber: '101',
        block: 'A',
    },
    {
        name: 'Rahul Sharma',
        email: 'rahul@cgc.edu',
        phone: '9876543210',
        password: 'password123',
        role: 'student',
        rollNumber: '2026001',
        roomNumber: '201',
        block: 'A',
    },
    {
        name: 'Priya Sharma',
        email: 'priya@cgc.edu',
        phone: '9876543211',
        password: 'password123',
        role: 'parent',
        rollNumber: 'PARENT001',
    },
    {
        name: 'Dr. Vikram Singh',
        email: 'vikram@cgc.edu',
        phone: '9876543212',
        password: 'password123',
        role: 'warden',
        rollNumber: 'WARDEN001',
        assignedBlock: 'A',
    },
    {
        name: 'Admin User',
        email: 'admin@cgc.edu',
        phone: '9876543213',
        password: 'password123',
        role: 'admin',
        rollNumber: 'ADMIN001',
    },
];

async function seed() {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('✅ Connected to MongoDB');

        // Clear existing users
        await User.deleteMany({});
        console.log('🗑️  Cleared existing users');

        // Insert test users
        for (const userData of testUsers) {
            await User.create(userData);
            console.log(`👤 Created ${userData.role}: ${userData.name} (${userData.rollNumber})`);
        }

        console.log('\n🎉 Seed complete! Login credentials:\n');
        console.log('┌────────────┬──────────────┬──────────────┐');
        console.log('│ Role       │ Roll Number  │ Password     │');
        console.log('├────────────┼──────────────┼──────────────┤');
        console.log('│ Student    │ 2501003106   │ Abcd@99881   │');
        console.log('│ Student    │ 2026001      │ password123  │');
        console.log('│ Parent     │ PARENT001    │ password123  │');
        console.log('│ Warden     │ WARDEN001    │ password123  │');
        console.log('│ Admin      │ ADMIN001     │ password123  │');
        console.log('└────────────┴──────────────┴──────────────┘');
    } catch (err) {
        console.error('❌ Seed failed:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seed();
