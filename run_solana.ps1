param(
    [switch]$NoBuild = $false,
    [string]$Command = ""
)

# Check if Docker is running
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Docker is not installed or not in PATH. Please install Docker Desktop from https://www.docker.com/products/docker-desktop" -ForegroundColor Red
    exit 1
}

# Build the Docker image if needed
if (-not $NoBuild) {
    Write-Host "Building Docker image..." -ForegroundColor Cyan
    docker build -t solana-dev .
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to build Docker image" -ForegroundColor Red
        exit 1
    }
}

# Prepare the command to run in the container
$containerCommand = @"
echo '=== Solana Development Environment ===' &&
echo 'Solana version: ' && solana --version &&
echo 'Rust version: ' && rustc --version &&
echo 'Cargo version: ' && cargo --version &&
echo '\nProject directory: /app' &&
echo 'Type "exit" to quit' &&

# Check if we have a specific command to run
if [ -n "$Command" ]; then
    echo "\nExecuting: $Command\n"
    eval "$Command"
else
    echo '\nAvailable commands:'
    echo '  solana --help'
    echo '  cargo build-bpf'
    echo '  ./deploy.ps1 -Environment docker'
    echo '  solana config set --url devnet'
    echo '  solana-keygen new --no-bip39-passphrase'
    echo '  solana airdrop 1'
    echo '  node server/index.js'
    /bin/bash
fi
"@

# Run the Docker container
Write-Host "Starting Solana development environment..." -ForegroundColor Cyan
Write-Host "Type 'exit' to quit the container when done." -ForegroundColor Yellow

try {
    docker run -it --rm `
        -v "${PWD}:/app" `
        -w /app `
        -e "Command=$Command" `
        solana-dev `
        /bin/bash -c $containerCommand
} catch {
    Write-Host "Error running Docker container: $_" -ForegroundColor Red
    exit 1
}
