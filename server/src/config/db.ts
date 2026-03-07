import { createClient } from '@supabase/supabase-js';
import { config } from './env';

if (!config.supabaseUrl || !config.supabaseKey) {
    throw new Error('SUPABASE_URL and SUPABASE_KEY environment variables are required');
}

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

export default supabase;
