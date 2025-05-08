<<<<<<< HEAD
// Import configuration
const config = require('./config');

// Initialize Supabase client
const supabase = supabase.createClient(
  config.supabase.url,
  config.supabase.key
);

// Log configuration (remove in production)
console.log('Supabase initialized in', config.server.env, 'mode');
=======
// Supabase configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
>>>>>>> 9fcd87850b59634e752d74c1102e8c1e91df8c53

// Save score to Supabase
async function saveScoreToLeaderboard(score, mode, walletAddress) {
    try {
        const { data, error } = await supabase
            .from('leaderboard')
            .insert([
                { 
                    wallet_address: walletAddress,
                    score: score,
                    mode: mode,
                    timestamp: new Date().toISOString()
                }
            ]);
            
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error saving score:', error);
        return null;
    }
}

// Get top scores from Supabase
async function getTopScores(mode = 'single', limit = 10) {
    try {
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .eq('mode', mode)
            .order('score', { ascending: false })
            .limit(limit);
            
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching scores:', error);
        return [];
    }
}

// Get user's personal best scores
async function getUserScores(walletAddress, mode = 'single', limit = 10) {
    try {
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .eq('wallet_address', walletAddress)
            .eq('mode', mode)
            .order('score', { ascending: false })
            .limit(limit);
            
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching user scores:', error);
        return [];
    }
}

export { saveScoreToLeaderboard, getTopScores, getUserScores };
