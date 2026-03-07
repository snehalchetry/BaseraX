---
description: Seed the Supabase database with test users and data
---
Whenever the database schema changes or you need a fresh set of test accounts for all roles (Student, Parent, Warden, Admin), you can run the seed script.

// turbo-all
1. Run the seed script:
```bash
cd c:\HostelERP\server
npx tsx src/seed.ts
```

2. Verify the output. The script will clear existing users and recreate them, printing the login credentials to the console.
