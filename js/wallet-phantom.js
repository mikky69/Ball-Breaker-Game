// Phantom Wallet Connection Logic (browser safe)
function isPhantomInstalled() {
    return window.solana && window.solana.isPhantom;
}
async function connectWallet() {
    const walletErrorDiv = document.getElementById('walletError');
    walletErrorDiv.textContent = '';
    if (!isPhantomInstalled()) {
        walletErrorDiv.textContent = 'Phantom Wallet not installed!';
        return;
    }
    // Use the new Solana wallet API if available
    if (window.solana.connect && typeof window.solana.connect === 'function') {
        window.solana.connect({ onlyIfTrusted: false }).then(function(resp) {
            const walletAddress = resp.publicKey ? resp.publicKey.toString() : '';
            document.getElementById('walletAddress').textContent = 'Connected: ' + walletAddress;
            document.getElementById('phantomWallet').style.display = 'none';
            document.getElementById('disconnectWallet').style.display = 'inline-block';
            if (typeof loadPowerupCount === 'function') loadPowerupCount();
            let el = document.getElementById('powerupCount');
            if (el && typeof powerupCount !== 'undefined') el.innerText = 'Powerpoint ' + Math.max(0, powerupCount);
        }).catch(function(err) {
            walletErrorDiv.textContent = 'Wallet connection failed!';
            console.error(err);
        });
    } else if (window.solana.request) {
        // Fallback for wallets using the new standard
        window.solana.request({ method: 'connect' }).then(function(resp) {
            const walletAddress = resp.publicKey ? resp.publicKey.toString() : '';
            document.getElementById('walletAddress').textContent = 'Connected: ' + walletAddress;
            document.getElementById('phantomWallet').style.display = 'none';
            document.getElementById('disconnectWallet').style.display = 'inline-block';
            if (typeof loadPowerupCount === 'function') loadPowerupCount();
            let el = document.getElementById('powerupCount');
            if (el && typeof powerupCount !== 'undefined') el.innerText = 'Powerpoint ' + Math.max(0, powerupCount);
        }).catch(function(err) {
            walletErrorDiv.textContent = 'Wallet connection failed!';
            console.error(err);
        });
    } else {
        walletErrorDiv.textContent = 'Phantom Wallet API not available!';
    }
}
function disconnectWallet() {
    if (window.solana && window.solana.disconnect) {
        window.solana.disconnect();
    }
    document.getElementById('walletAddress').textContent = '';
    document.getElementById('phantomWallet').style.display = '';
    document.getElementById('disconnectWallet').style.display = 'none';
    if (typeof onWalletDisconnect === 'function') onWalletDisconnect();
}
document.addEventListener('DOMContentLoaded', function() {
    // Always rebind after dynamic script injection
    setTimeout(function() {
        const connectBtn = document.getElementById('phantomWallet');
        const disconnectBtn = document.getElementById('disconnectWallet');
        if (connectBtn) connectBtn.onclick = connectWallet;
        if (disconnectBtn) disconnectBtn.onclick = disconnectWallet;
        if (window.solana && window.solana.isConnected && window.solana.publicKey) {
            document.getElementById('walletAddress').textContent = 'Connected: ' + window.solana.publicKey.toString();
            document.getElementById('phantomWallet').style.display = 'none';
            document.getElementById('disconnectWallet').style.display = 'inline-block';
        }
    }, 0);
});
