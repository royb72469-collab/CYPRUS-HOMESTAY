import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epmdbvwqdxgazlzauzyt.supabase.co';
const supabaseKey = 'sb_secret_k-bYYSiw704-ZgsD0irCqg_OPhxjYxD';

export const supabase = createClient(supabaseUrl, supabaseKey);
