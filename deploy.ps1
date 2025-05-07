param(
    [string]$Environment = "docker"  # or "native"
)

# Set paths based on environment
if ($Environment -eq "docker") {
    $basePath = "/app"
    $sedCmd = "sed -i"
} else {
    $basePath = $PSScriptRoot
    $sedCmd = "sed -i ''"
}

$solanaProgramPath = Join-Path $basePath "solana-program"
$serverPath = Join-Path $basePath "server"

# Navigate to the solana-program directory
Set-Location $solanaProgramPath

# Build the program
Write-Host "Building the program..." -ForegroundColor Cyan
try {
    cargo build-bpf --bpf-out-dir dist/program
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
} catch {
    Write-Host "Error building program: $_" -ForegroundColor Red
    exit 1
}

# Deploy the program
Write-Host "Deploying the program..." -ForegroundColor Cyan
try {
    $deployOutput = solana program deploy dist/program/ball_nft_program.so --url devnet --output json
    if ($LASTEXITCODE -ne 0) {
        throw "Deployment failed"
    }
    
    $programId = ($deployOutput | ConvertFrom-Json).programId
    if (-not $programId) {
        throw "Failed to get program ID from deployment"
    }
    
    Write-Host "Program deployed with ID: $programId" -ForegroundColor Green
    
    # Save the program ID
    $env:PROGRAM_ID = $programId
    "PROGRAM_ID=$programId" | Out-File -FilePath (Join-Path $basePath ".env") -Force
    
    # Update the program ID in the source files
    $libRsPath = Join-Path $solanaProgramPath "src/lib.rs"
    $serverJsPath = Join-Path $serverPath "index.js"
    
    (Get-Content $libRsPath) -replace 'YourProgramID11111111111111111111111111111', $programId | Set-Content $libRsPath
    (Get-Content $serverJsPath) -replace 'YourProgramID11111111111111111111111111111', $programId | Set-Content $serverJsPath
    
    Write-Host "Program ID updated in all files!" -ForegroundColor Green
    
} catch {
    Write-Host "Error deploying program: $_" -ForegroundColor Red
    exit 1
}
