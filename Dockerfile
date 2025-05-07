FROM solanalabs/solana:v1.16.0

# Install Rust and Cargo
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)" && \
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH" && \
    rustup component add rustfmt && \
    cargo install --git https://github.com/project-serum/anchor avm --locked --force && \
    avm install latest && \
    avm use latest

# Set up working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the program
RUN cd solana-program && \
    cargo build-bpf

# Set up entry point
ENTRYPOINT ["/bin/bash"]
