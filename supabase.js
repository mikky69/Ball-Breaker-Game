// Import configuration
const config = require('./config');

// Initialize Supabase client
const supabase = supabase.createClient(
  config.supabase.url,
  config.supabase.key
);

// Log configuration (remove in production)
console.log('Supabase initialized in', config.server.env, 'mode');

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
