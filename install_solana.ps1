# Install-Solana.ps1
# This script provides two methods to work with Solana:
# 1. Using Docker (recommended) - No installation required
# 2. Native installation (if Docker is not available)

param(
    [switch]$UseDocker
)

# Set default value for UseDocker
if (-not $UseDocker) {
    $UseDocker = $true
}

# Check if running as administrator (only needed for native installation)
if (-not $UseDocker) {
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if (-not $isAdmin) {
        Write-Host "Please run this script as Administrator for native installation" -ForegroundColor Red
        exit 1
    }
}

function Install-WithDocker {
    Write-Host "=== Setting up Solana with Docker ===" -ForegroundColor Cyan
    
    # Check if Docker is installed and running
    try {
        docker info 2>&1
        if ($LASTEXITCODE -ne 0) {
            throw "Docker is not running"
        }
    } catch {
        Write-Host "Docker is not installed or not running. Please install Docker Desktop from https://www.docker.com/products/docker-desktop" -ForegroundColor Red
        Write-Host "After installation, start Docker Desktop and run this script again." -ForegroundColor Yellow
        exit 1
    }

    # Build and run the Docker container
    try {
        Write-Host "Building Docker image..." -ForegroundColor Yellow
        docker build -t solana-dev .
        
        Write-Host "`n=== Docker Setup Complete! ===" -ForegroundColor Green
        Write-Host "To start the development environment, run:" -ForegroundColor Cyan
        Write-Host "  .\run_solana.ps1" -ForegroundColor White -BackgroundColor DarkGray
    } catch {
        Write-Host "Error setting up Docker: $_" -ForegroundColor Red
        exit 1
    }
}

function Install-Native {
    Write-Host "=== Installing Solana CLI Natively ===" -ForegroundColor Cyan
    
    try {
        # 1. Install Rust
        Write-Host "Installing Rust..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri https://win.rustup.rs -OutFile rustup-init.exe
        .\rustup-init.exe -y
        Remove-Item rustup-init.exe -Force
        
        # Add Rust to PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # 2. Install Solana CLI
        Write-Host "Installing Solana CLI..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri https://release.solana.com/v1.16.0/solana-install-x86_64-pc-windows-msvc.exe -OutFile solana-install.exe
        .\solana-install.exe v1.16.0
        Remove-Item solana-install.exe -Force
        
        # 3. Configure Solana
        Write-Host "Configuring Solana CLI..." -ForegroundColor Yellow
        solana config set --url devnet
        
        # Create keypair if it doesn't exist
        $keypairPath = "$env:APPDATA\solana\id.json"
        if (-not (Test-Path $keypairPath)) {
            Write-Host "Creating new Solana keypair..." -ForegroundColor Yellow
            solana-keygen new --no-bip39-passphrase
        }
        
        # Airdrop SOL
        Write-Host "Requesting devnet SOL..." -ForegroundColor Yellow
        solana airdrop 1
        
        Write-Host "\n=== Native Installation Complete! ===" -ForegroundColor Green
        Write-Host "Solana CLI is now installed and configured." -ForegroundColor Green
        Write-Host "Your public key: $(solana-keygen pubkey)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "Error during installation: $_" -ForegroundColor Red
        exit 1
    }
}

# Main script
Write-Host "=== Solana Development Setup ===" -ForegroundColor Cyan

if ($UseDocker) {
    Install-WithDocker
} else {
    Install-Native
}

# Common next steps
Write-Host "`n=== Next Steps ===" -ForegroundColor Green
Write-Host "1. Start the server: cd server && npm run dev" -ForegroundColor Cyan
Write-Host "2. Open game.html in your browser" -ForegroundColor Cyan
Write-Host "3. Connect your Phantom wallet" -ForegroundColor Cyan
Write-Host "4. Try minting an NFT!" -ForegroundColor Cyan
