#!/bin/bash

set -Eeuo pipefail
IFS=$'\n\t'

PROJECT_ZIP_URL="https://github.com/JackCubas/ProyectoPDP/archive/refs/heads/multiajuste.zip"
DEFAULT_BACKEND_DIR="/opt/node_js_api_mysql"
DEFAULT_FRONTEND_BASE="/var/www/html"
DEFAULT_FRONTEND_SUBDIR="pdp"
DEFAULT_BACKEND_PORT=3000
DEFAULT_FRONTEND_PORT=443
DEFAULT_DB_NAME="firma_app"
DEFAULT_DB_ROOT_USER="root"
DEFAULT_DB_ROOT_PASSWORD="admin"
APACHE_SITE_NAME="proyectopdp-ssl"
BACKEND_SERVICE_NAME="proyectopdp-backend"
BACKEND_PORT="$DEFAULT_BACKEND_PORT"

SUCCESS=false
TEMP_PROJECT_DIR=""
PROJECT_SOURCE_DIR=""
BACKEND_SERVICE_CREATED=false
APACHE_CONFIGURED=false
DB_CONFIGURED=false
REPO_DOWNLOADED=false
SUDO_CMD=""
DB_CLIENT=""
DB_ROOT_AUTH="socket"

if [ "$EUID" -eq 0 ]; then
    SUDO_CMD=""
elif command -v sudo >/dev/null 2>&1; then
    SUDO_CMD="sudo"
else
    echo "This installer requires root or sudo privileges."
    exit 1
fi

run_as_root() {
    if [ -n "$SUDO_CMD" ]; then
        "$SUDO_CMD" "$@"
    else
        "$@"
    fi
}

log_info() { echo "[INFO] $1"; }
log_success() { echo "[OK] $1"; }
log_warning() { echo "[WARN] $1"; }
log_error() { echo "[ERROR] $1" >&2; }
log_header() {
    echo
    echo "============================================================"
    echo " $1"
    echo "============================================================"
    echo
}
log_step() { echo "> $1"; }

ask_yes_no() {
    local prompt="$1"
    local default_answer="${2:-yes}"
    local reply=""

    if [ "$default_answer" = "yes" ]; then
        echo -n "$prompt [Y/n]: "
    else
        echo -n "$prompt [y/N]: "
    fi

    read -r reply
    reply="${reply:-$default_answer}"
    [[ "$reply" =~ ^[Yy]([Ee][Ss])?$ ]]
}

validate_port() {
    local port="$1"
    [[ "$port" =~ ^[0-9]+$ ]] && [ "$port" -ge 1 ] && [ "$port" -le 65535 ]
}

detect_server_ip() {
    local ip
    ip="$(hostname -I 2>/dev/null | awk '{print $1}')"
    [ -n "$ip" ] || ip="127.0.0.1"
    echo "$ip"
}

normalize_path() {
    realpath -m "$1"
}

cleanup() {
    if [ "$SUCCESS" = true ]; then
        return
    fi

    log_warning "Installation failed. Starting cleanup..."

    if [ "$BACKEND_SERVICE_CREATED" = true ]; then
        run_as_root systemctl stop "$BACKEND_SERVICE_NAME" >/dev/null 2>&1 || true
        run_as_root systemctl disable "$BACKEND_SERVICE_NAME" >/dev/null 2>&1 || true
        run_as_root rm -f "/etc/systemd/system/${BACKEND_SERVICE_NAME}.service" || true
        run_as_root systemctl daemon-reload >/dev/null 2>&1 || true
    fi

    if [ "$APACHE_CONFIGURED" = true ]; then
        run_as_root a2dissite "${APACHE_SITE_NAME}.conf" >/dev/null 2>&1 || true
        run_as_root rm -f "/etc/apache2/sites-available/${APACHE_SITE_NAME}.conf" || true
        run_as_root systemctl reload apache2 >/dev/null 2>&1 || true
    fi

    if [ "$DB_CONFIGURED" = true ] && [ -n "$DB_CLIENT" ]; then
        if [ "$DB_ROOT_AUTH" = "password" ]; then
            "$DB_CLIENT" -u "$DEFAULT_DB_ROOT_USER" -p"$DEFAULT_DB_ROOT_PASSWORD" -e "DROP DATABASE IF EXISTS ${DEFAULT_DB_NAME};" >/dev/null 2>&1 || true
        else
            "$DB_CLIENT" -u "$DEFAULT_DB_ROOT_USER" -e "DROP DATABASE IF EXISTS ${DEFAULT_DB_NAME};" >/dev/null 2>&1 || true
        fi
    fi

    if [ -n "$TEMP_PROJECT_DIR" ] && [ -d "$TEMP_PROJECT_DIR" ]; then
        run_as_root rm -rf "$TEMP_PROJECT_DIR" || true
    fi

    if [ -n "${INSTALL_DIR:-}" ] && [ -d "$INSTALL_DIR" ] && [ "$REPO_DOWNLOADED" = true ]; then
        run_as_root rm -rf "$INSTALL_DIR" || true
    fi

    log_error "Cleanup complete. Review the logs and try again."
}

on_error() {
    log_error "Error at line $1: $BASH_COMMAND"
    cleanup
    exit 1
}

trap 'on_error $LINENO' ERR
trap 'cleanup; exit 1' INT TERM

install_base_packages() {
    log_header "System Preparation"

    if [ ! -f /etc/debian_version ]; then
        log_error "This script only supports Debian-based systems."
        exit 1
    fi

    log_step "Updating package lists..."
    run_as_root apt-get update -y

    if ask_yes_no "Do you want to run a full upgrade before continuing?" "no"; then
        log_step "Upgrading system packages..."
        run_as_root apt-get upgrade -y
    fi

    log_step "Installing base packages..."
    run_as_root apt-get install -y curl git build-essential unzip wget openssl ca-certificates gnupg lsb-release
    log_success "Base packages installed"
}

download_project() {
    log_header "Downloading Project"

    TEMP_PROJECT_DIR="$(mktemp -d)"
    local zip_file="${TEMP_PROJECT_DIR}/project.zip"

    log_step "Downloading source archive..."
    if ! wget -qO "$zip_file" "$PROJECT_ZIP_URL"; then
        log_error "Failed to download project archive"
        exit 1
    fi

    log_step "Extracting project archive..."
    unzip -q "$zip_file" -d "$TEMP_PROJECT_DIR"

    PROJECT_SOURCE_DIR="$(find "$TEMP_PROJECT_DIR" -maxdepth 1 -type d -name 'ProyectoPDP-*' | head -n 1 || true)"
    if [ -z "$PROJECT_SOURCE_DIR" ] || [ ! -d "$PROJECT_SOURCE_DIR" ]; then
        log_error "Could not locate the extracted project directory"
        exit 1
    fi

    REPO_DOWNLOADED=true
    log_success "Project downloaded to $PROJECT_SOURCE_DIR"
}

prepare_target_directory() {
    local target_dir="$1"
    local label="$2"

    if [ -d "$target_dir" ] && [ -n "$(find "$target_dir" -mindepth 1 -maxdepth 1 -print -quit 2>/dev/null)" ]; then
        log_warning "$label directory already exists and is not empty: $target_dir"
        if ask_yes_no "Do you want to backup the existing $label directory and continue?" "no"; then
            local backup_dir="${target_dir}.backup.$(date +%s)"
            log_step "Moving existing directory to $backup_dir..."
            run_as_root mv "$target_dir" "$backup_dir"
            log_success "Backup created at $backup_dir"
        else
            log_error "Installation cancelled to avoid overwriting existing files"
            exit 1
        fi
    fi

    run_as_root mkdir -p "$target_dir"
}

ensure_apache() {
    if ! command -v apache2 >/dev/null 2>&1; then
        log_step "Installing Apache..."
        run_as_root apt-get install -y apache2
    else
        log_success "Apache is already installed"
    fi

    log_step "Starting Apache..."
    run_as_root systemctl enable apache2 >/dev/null 2>&1 || true
    run_as_root systemctl start apache2

    log_step "Enabling Apache modules..."
    run_as_root a2enmod proxy >/dev/null 2>&1 || true
    run_as_root a2enmod proxy_http >/dev/null 2>&1 || true
    run_as_root a2enmod ssl >/dev/null 2>&1 || true
    run_as_root a2enmod rewrite >/dev/null 2>&1 || true
    run_as_root a2enmod headers >/dev/null 2>&1 || true
}

ensure_nodejs() {
    local node_major="0"
    if command -v node >/dev/null 2>&1; then
        node_major="$(node -v | sed 's/^v//' | cut -d. -f1)"
        if [ "$node_major" -ge 20 ]; then
            log_success "Node.js $(node -v) is already installed"
            return
        fi
    fi

    log_step "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | run_as_root bash - >/dev/null 2>&1
    run_as_root apt-get install -y nodejs
    log_success "Node.js installed: $(node -v)"
}

ensure_mariadb() {
    log_step "Installing MariaDB..."
    run_as_root apt-get install -y mariadb-server mariadb-client

    local db_service="mariadb"
    if ! systemctl list-unit-files | grep -q '^mariadb\.service'; then
        db_service="mysql"
    fi

    log_step "Starting MariaDB service..."
    run_as_root systemctl enable "$db_service" >/dev/null 2>&1 || true
    run_as_root systemctl start "$db_service"

    if ! run_as_root systemctl is-active --quiet "$db_service"; then
        log_error "MariaDB service did not start correctly"
        exit 1
    fi

    if command -v mariadb >/dev/null 2>&1; then
        DB_CLIENT="mariadb"
    else
        DB_CLIENT="mysql"
    fi

    if "$DB_CLIENT" -u "$DEFAULT_DB_ROOT_USER" -p"$DEFAULT_DB_ROOT_PASSWORD" -e "SELECT 1;" >/dev/null 2>&1; then
        DB_ROOT_AUTH="password"
    elif "$DB_CLIENT" -u "$DEFAULT_DB_ROOT_USER" -e "SELECT 1;" >/dev/null 2>&1; then
        DB_ROOT_AUTH="socket"
    else
        log_error "Unable to connect to MariaDB as root"
        exit 1
    fi

    log_success "MariaDB service is running"
}

db_root_exec() {
    local sql_statement="$1"
    if [ "$DB_ROOT_AUTH" = "password" ]; then
        "$DB_CLIENT" -u "$DEFAULT_DB_ROOT_USER" -p"$DEFAULT_DB_ROOT_PASSWORD" -e "$sql_statement"
    else
        "$DB_CLIENT" -u "$DEFAULT_DB_ROOT_USER" -e "$sql_statement"
    fi
}

db_root_import() {
    local database_name="$1"
    local sql_file="$2"
    if [ "$DB_ROOT_AUTH" = "password" ]; then
        "$DB_CLIENT" -u "$DEFAULT_DB_ROOT_USER" -p"$DEFAULT_DB_ROOT_PASSWORD" "$database_name" < "$sql_file"
    else
        "$DB_CLIENT" -u "$DEFAULT_DB_ROOT_USER" "$database_name" < "$sql_file"
    fi
}

configure_mariadb() {
    local sql_file="$1"

    log_header "Configuring MariaDB"

    ensure_mariadb
    DB_CONFIGURED=true

    if [ "$DB_ROOT_AUTH" = "socket" ]; then
        log_step "Setting MariaDB root password for repeatable access..."
        db_root_exec "ALTER USER '${DEFAULT_DB_ROOT_USER}'@'localhost' IDENTIFIED BY '${DEFAULT_DB_ROOT_PASSWORD}'; FLUSH PRIVILEGES;"
        DB_ROOT_AUTH="password"
    fi

    log_step "Hardening default MariaDB installation..."
    db_root_exec "DELETE FROM mysql.user WHERE User='';"
    db_root_exec "DELETE FROM mysql.user WHERE User='${DEFAULT_DB_ROOT_USER}' AND Host!='localhost';"
    db_root_exec "DROP DATABASE IF EXISTS test;"
    db_root_exec "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
    db_root_exec "FLUSH PRIVILEGES;"

    local mariadb_conf="/etc/mysql/mariadb.conf.d/50-server.cnf"
    if [ -f "$mariadb_conf" ]; then
        log_step "Setting MariaDB bind-address to 0.0.0.0..."
        if grep -q '^bind-address' "$mariadb_conf"; then
            run_as_root sed -i 's/^bind-address.*/bind-address = 0.0.0.0/' "$mariadb_conf"
        else
            echo 'bind-address = 0.0.0.0' | run_as_root tee -a "$mariadb_conf" >/dev/null
        fi
        run_as_root systemctl restart mariadb
    fi

    log_step "Creating database ${DEFAULT_DB_NAME} if needed..."
    db_root_exec "CREATE DATABASE IF NOT EXISTS ${DEFAULT_DB_NAME};"

    if [ -f "$sql_file" ]; then
        log_step "Importing database schema from $(basename "$sql_file")..."
        db_root_import "$DEFAULT_DB_NAME" "$sql_file"
    else
        log_warning "SQL file not found: $sql_file"
    fi

    log_success "MariaDB configured successfully"
}

configure_frontend() {
    local frontend_source="$1"
    local backend_ip="$2"
    local backend_port="$3"

    log_header "Configuring Frontend"

    ensure_apache

    local frontend_dir_input=""
    local frontend_dir="${DEFAULT_FRONTEND_BASE}/${DEFAULT_FRONTEND_SUBDIR}"

    echo -n "Frontend directory inside Apache document root [default: ${frontend_dir}]: "
    read -r frontend_dir_input
    if [ -n "$frontend_dir_input" ]; then
        if [[ "$frontend_dir_input" = /* ]]; then
            frontend_dir="$frontend_dir_input"
        else
            frontend_dir="${DEFAULT_FRONTEND_BASE}/${frontend_dir_input}"
        fi
    fi

    frontend_dir="$(normalize_path "$frontend_dir")"
    prepare_target_directory "$frontend_dir" "frontend"

    log_step "Copying frontend files to $frontend_dir..."
    run_as_root cp -a "$frontend_source/." "$frontend_dir/"
    run_as_root chown -R www-data:www-data "$frontend_dir"
    log_success "Frontend files copied"

    if [ -f "$frontend_dir/JS/config.js" ]; then
        log_step "Updating frontend backend configuration..."
        run_as_root sed -i "s|const BACKEND_IP = '.*';|const BACKEND_IP = '${backend_ip}';|" "$frontend_dir/JS/config.js"
        run_as_root sed -i "s|const BACKEND_PORT = [0-9]*;|const BACKEND_PORT = ${backend_port};|" "$frontend_dir/JS/config.js"
        log_success "Frontend configured for backend at ${backend_ip}:${backend_port}"
    else
        log_warning "JS/config.js not found in frontend; skipping backend URL update"
    fi

    local server_ip
    server_ip="$(detect_server_ip)"

    local frontend_port_input=""
    local frontend_port="$DEFAULT_FRONTEND_PORT"
    echo -n "Apache frontend port [default: ${DEFAULT_FRONTEND_PORT}]: "
    read -r frontend_port_input
    frontend_port="${frontend_port_input:-$DEFAULT_FRONTEND_PORT}"
    if ! validate_port "$frontend_port"; then
        log_error "Invalid frontend port: $frontend_port"
        exit 1
    fi

    local ssl_dir="/etc/apache2/ssl"
    local cert_file="${ssl_dir}/apache.crt"
    local key_file="${ssl_dir}/apache.key"

    log_step "Generating self-signed certificate if needed..."
    run_as_root mkdir -p "$ssl_dir"
    if [ ! -f "$cert_file" ] || [ ! -f "$key_file" ]; then
        run_as_root openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout "$key_file" -out "$cert_file" -subj "/C=ES/ST=State/L=City/O=ProjectPDP/OU=IT/CN=${server_ip}" >/dev/null 2>&1
    fi

    if [ "$frontend_port" != "443" ]; then
        if ! grep -q "Listen ${frontend_port}" /etc/apache2/ports.conf 2>/dev/null; then
            echo "Listen ${frontend_port}" | run_as_root tee -a /etc/apache2/ports.conf >/dev/null
        fi
    fi

    local apache_site_file="/etc/apache2/sites-available/${APACHE_SITE_NAME}.conf"
    log_step "Creating Apache virtual host..."
    run_as_root tee "$apache_site_file" >/dev/null <<EOF
<VirtualHost *:${frontend_port}>
    ServerName ${server_ip}
    ServerAdmin webmaster@localhost
    DocumentRoot ${frontend_dir}

    SSLEngine on
    SSLCertificateFile ${cert_file}
    SSLCertificateKeyFile ${key_file}

    ProxyPreserveHost On
    ProxyPass /api http://${backend_ip}:${backend_port}/api
    ProxyPassReverse /api http://${backend_ip}:${backend_port}/api

    <Directory ${frontend_dir}>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog \${APACHE_LOG_DIR}/${APACHE_SITE_NAME}-error.log
    CustomLog \${APACHE_LOG_DIR}/${APACHE_SITE_NAME}-access.log combined
</VirtualHost>
EOF

    run_as_root a2ensite "${APACHE_SITE_NAME}.conf" >/dev/null 2>&1 || true

    log_step "Testing Apache configuration..."
    if ! run_as_root apache2ctl configtest >/dev/null 2>&1; then
        log_error "Apache configuration test failed"
        exit 1
    fi

    run_as_root systemctl reload apache2
    APACHE_CONFIGURED=true
    log_success "Apache configured successfully"
    log_success "Frontend available at: https://${server_ip}:${frontend_port}/"
}

configure_backend() {
    local backend_source="$1"

    log_header "Configuring Backend"

    local backend_dir_input=""
    local backend_dir="$DEFAULT_BACKEND_DIR"
    echo -n "Backend installation directory [default: ${DEFAULT_BACKEND_DIR}]: "
    read -r backend_dir_input
    backend_dir="${backend_dir_input:-$DEFAULT_BACKEND_DIR}"
    if [[ "$backend_dir" != /* ]]; then
        backend_dir="/opt/${backend_dir}"
    fi

    backend_dir="$(normalize_path "$backend_dir")"
    prepare_target_directory "$backend_dir" "backend"

    log_step "Copying backend files to $backend_dir..."
    run_as_root cp -a "$backend_source/." "$backend_dir/"
    log_success "Backend files copied"

    local sql_file="${backend_source}/firma_app.sql"
    if [ ! -f "$sql_file" ] && [ -f "$backend_dir/firma_app.sql" ]; then
        sql_file="$backend_dir/firma_app.sql"
    fi

    configure_mariadb "$sql_file"
    ensure_nodejs

    log_step "Installing Node.js dependencies..."
    (cd "$backend_dir" && npm install)
    log_success "Node.js dependencies installed"

    local backend_port_input=""
    local backend_port="$DEFAULT_BACKEND_PORT"
    echo -n "Backend port [default: ${DEFAULT_BACKEND_PORT}]: "
    read -r backend_port_input
    backend_port="${backend_port_input:-$DEFAULT_BACKEND_PORT}"
    if ! validate_port "$backend_port"; then
        log_error "Invalid backend port: $backend_port"
        exit 1
    fi
    BACKEND_PORT="$backend_port"

    if command -v ss >/dev/null 2>&1 && ss -tuln 2>/dev/null | grep -q ":${backend_port} "; then
        log_warning "Port ${backend_port} is already in use"
        if ! ask_yes_no "Continue anyway?" "no"; then
            exit 1
        fi
    fi

    local backend_service_file="/etc/systemd/system/${BACKEND_SERVICE_NAME}.service"
    log_step "Creating backend systemd service..."
    run_as_root tee "$backend_service_file" >/dev/null <<EOF
[Unit]
Description=ProjectPDP Backend API
After=network.target mariadb.service
Requires=mariadb.service

[Service]
Type=simple
WorkingDirectory=${backend_dir}
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

    run_as_root systemctl daemon-reload
    run_as_root systemctl enable "$BACKEND_SERVICE_NAME"
    run_as_root systemctl start "$BACKEND_SERVICE_NAME"
    BACKEND_SERVICE_CREATED=true

    if run_as_root systemctl is-active --quiet "$BACKEND_SERVICE_NAME"; then
        log_success "Backend service started successfully"
    else
        log_warning "Backend service did not report as active. Check: journalctl -u ${BACKEND_SERVICE_NAME} -f"
    fi

    if command -v ufw >/dev/null 2>&1; then
        log_step "Opening backend port in firewall..."
        run_as_root ufw allow "${backend_port}/tcp" >/dev/null 2>&1 || true
    fi

    log_success "Backend available at: http://$(detect_server_ip):${backend_port}"
}

main() {
    clear || true
    echo "============================================================"
    echo " ProjectPDP Debian Installer"
    echo "============================================================"

    install_base_packages
    download_project

    local install_backend=true
    local install_frontend=true

    if ! ask_yes_no "Do you want to install the backend and MariaDB?" "yes"; then
        install_backend=false
    fi

    if ! ask_yes_no "Do you want to install the frontend with Apache?" "yes"; then
        install_frontend=false
    fi

    if [ "$install_backend" = false ] && [ "$install_frontend" = false ]; then
        log_warning "Nothing selected. Exiting."
        exit 0
    fi

    local server_ip
    server_ip="$(detect_server_ip)"
    log_info "Detected server IP: $server_ip"

    if [ "$install_backend" = true ]; then
        configure_backend "$PROJECT_SOURCE_DIR/node_js_api_mysql"
    fi

    if [ "$install_frontend" = true ]; then
        configure_frontend "$PROJECT_SOURCE_DIR/cliente_api_mysql" "$server_ip" "$BACKEND_PORT"
    fi

    if command -v ufw >/dev/null 2>&1; then
        log_step "Opening firewall ports..."
        if [ "$install_frontend" = true ]; then
            run_as_root ufw allow 443/tcp >/dev/null 2>&1 || true
            run_as_root ufw allow 80/tcp >/dev/null 2>&1 || true
        fi
        if [ "$install_backend" = true ]; then
            run_as_root ufw allow "${DEFAULT_BACKEND_PORT}/tcp" >/dev/null 2>&1 || true
        fi
    fi

    SUCCESS=true

    log_header "Installation Complete"
    echo "ProjectPDP has been installed successfully."
    [ "$install_frontend" = true ] && echo "Frontend: https://${server_ip}:${DEFAULT_FRONTEND_PORT}/"
    [ "$install_backend" = true ] && echo "Backend:  http://${server_ip}:${DEFAULT_BACKEND_PORT}"
    echo "Database:  ${DEFAULT_DB_NAME}"
}

main "$@"