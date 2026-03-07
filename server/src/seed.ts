import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const testUsers = [
    {
        name: 'Test Student',
        email: 'test2501@cgc.edu',
        phone: '9876500000',
        password: 'Abcd@99881',
        role: 'student',
        roll_number: '2501003106',
        room_number: '101',
        block: 'A',
    },
    {
        name: 'Rahul Sharma',
        email: 'rahul@cgc.edu',
        phone: '9876543210',
        password: 'password123',
        role: 'student',
        roll_number: '2026001',
        room_number: '201',
        block: 'A',
    },
    {
        name: 'Priya Sharma',
        email: 'priya@cgc.edu',
        phone: '9876543211',
        password: 'password123',
        role: 'parent',
        roll_number: 'PARENT001',
    },
    {
        name: 'Dr. Vikram Singh',
        email: 'vikram@cgc.edu',
        phone: '9876543212',
        password: 'password123',
        role: 'warden',
        roll_number: 'WARDEN001',
        assigned_block: 'A',
    },
    {
        name: 'Admin User',
        email: 'admin@cgc.edu',
        phone: '9876543213',
        password: 'password123',
        role: 'admin',
        roll_number: 'ADMIN001',
    },
];

async function seed() {
    try {
        console.log('🔌 Connecting to Supabase...');

        // Clear existing users
        const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
        if (deleteError) {
            console.error('⚠️  Could not clear users (may be empty):', deleteError.message);
        } else {
            console.log('🗑️  Cleared existing users');
        }

        // Insert test users
        for (const userData of testUsers) {
            const hashedPassword = await bcrypt.hash(userData.password, 12);
            const { data, error } = await supabase
                .from('users')
                .insert({
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    password: hashedPassword,
                    role: userData.role,
                    roll_number: userData.roll_number,
                    room_number: (userData as any).room_number,
                    block: (userData as any).block,
                    assigned_block: (userData as any).assigned_block,
                })
                .select()
                .single();
            if (error) {
                console.error(`❌ Failed to create ${userData.role} ${userData.name}: ${error.message}`);
            } else {
                console.log(`👤 Created ${userData.role}: ${userData.name} (${userData.roll_number})`);
            }
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
    }
    process.exit(0);
}

seed();
