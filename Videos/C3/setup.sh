*** Begin Patch
*** Add File: node_js_api_mysql/setup.sh
+#!/usr/bin/env bash
+set -euo pipefail
+
+# Setup script for the `node_js_api_mysql` project on Debian 11
+# Usage: sudo bash setup.sh [--repo <git-url>] [--install-dir <dir>] [--node-version <18|16>]
+#
+# The script will:
+# - install apt prerequisites (curl, git)
+# - install Node.js (NodeSource) and build tools
+# - install MySQL server
+# - clone the repository (default: https://github.com/JackCubas/ProyectoPDP.git) into `/opt`
+# - create the application database and user (reads `.env` if present in project folder)
+# - import `firma_app.sql` if present
+# - run `npm install` in `node_js_api_mysql`
+
+REPO_URL="https://github.com/JackCubas/ProyectoPDP.git"
+INSTALL_DIR="/opt/ProyectoPDP"
+PROJECT_SUBDIR="node_js_api_mysql"
+NODE_SETUP_URL="https://deb.nodesource.com/setup_18.x"
+
+show_help(){
+  sed -n '1,120p' "$0" | sed -n '1,12p'
+}
+
+while [[ $# -gt 0 ]]; do
+  case "$1" in
+    --repo) REPO_URL="$2"; shift 2;;
+    --install-dir) INSTALL_DIR="$2"; shift 2;;
+    --node-version)
+      if [[ "$2" == "18" ]]; then NODE_SETUP_URL="https://deb.nodesource.com/setup_18.x"; fi
+      if [[ "$2" == "16" ]]; then NODE_SETUP_URL="https://deb.nodesource.com/setup_16.x"; fi
+      shift 2;;
+    -h|--help) show_help; exit 0;;
+    *) echo "Unknown option: $1"; show_help; exit 1;;
+  esac
+done
+
+if [[ $EUID -ne 0 ]]; then
+  echo "This script must be run as root (sudo)." >&2
+  exit 2
+fi
+
+apt_get_update_if_needed(){
+  if [ ! -f /var/lib/apt/periodic/update-success-stamp ] || test $(find /var/lib/apt/periodic/update-success-stamp -mtime +1 -print); then
+    apt-get update
+  fi
+}
+
+echo "==> Installing prerequisites (curl, ca-certificates, gnupg, git, build-essential)..."
+apt_get_update_if_needed
+DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
+  curl ca-certificates gnupg git build-essential
+
+echo "==> Installing Node.js from NodeSource ($NODE_SETUP_URL)"
+curl -fsSL "$NODE_SETUP_URL" | bash -
+apt-get install -y nodejs
+
+echo "==> Installing MySQL server"
+DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server
+systemctl enable --now mysql
+
+echo "==> Preparing installation directory: $INSTALL_DIR"
+mkdir -p "$INSTALL_DIR"
+cd /opt
+
+if [ -d "$INSTALL_DIR/.git" ]; then
+  echo "Repository already cloned at $INSTALL_DIR. Fetching latest..."
+  cd "$INSTALL_DIR" && git fetch --all --prune && git reset --hard origin/HEAD || true
+else
+  echo "Cloning $REPO_URL into $INSTALL_DIR"
+  git clone "$REPO_URL" "$INSTALL_DIR"
+fi
+
+PROJECT_PATH="$INSTALL_DIR/$PROJECT_SUBDIR"
+if [ ! -d "$PROJECT_PATH" ]; then
+  echo "Project subdirectory $PROJECT_SUBDIR not found inside cloned repo. Exiting." >&2
+  exit 3
+fi
+
+cd "$PROJECT_PATH"
+
+# Read DB variables from .env if present
+DB_NAME="proyectopdp_db"
+DB_USER="pdp_user"
+DB_PASS="pdp_pass"
+
+if [ -f .env ]; then
+  echo "Found .env — attempting to read DB config (DB_NAME, DB_USER, DB_PASS)"
+  # simple parsing: look for lines like DB_NAME=..., ignoring export and spaces
+  parse_env(){ grep -E "^$1=" .env | tail -n1 | cut -d'=' -f2- | tr -d '\r\n' | sed 's/^"//;s/"$//'; }
+  tmp=$(parse_env DB_NAME); if [ -n "$tmp" ]; then DB_NAME="$tmp"; fi
+  tmp=$(parse_env DB_USER); if [ -n "$tmp" ]; then DB_USER="$tmp"; fi
+  tmp=$(parse_env DB_PASS); if [ -n "$tmp" ]; then DB_PASS="$tmp"; fi
+fi
+
+echo "DB name: $DB_NAME"; echo "DB user: $DB_USER"
+
+echo "==> Creating database and user (using sudo mysql socket access)"
+sudo mysql -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
+sudo mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
+sudo mysql -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost'; FLUSH PRIVILEGES;"
+
+SQL_IMPORT_FILE="$(pwd)/firma_app.sql"
+if [ -f "$SQL_IMPORT_FILE" ]; then
+  echo "==> Importing SQL file: $SQL_IMPORT_FILE into database $DB_NAME"
+  sudo mysql "$DB_NAME" < "$SQL_IMPORT_FILE"
+else
+  echo "No SQL import file found at $SQL_IMPORT_FILE — skipping import."
+fi
+
+if [ -f package.json ]; then
+  echo "==> Installing npm dependencies in $PROJECT_PATH"
+  npm install --production
+else
+  echo "No package.json found in $PROJECT_PATH — skipping npm install."
+fi
+
+cat <<'SUMMARY'
+
+Setup completed.
+
+Next steps:
+- Start the app (example):
+  cd /opt/ProyectoPDP/node_js_api_mysql
+  node server.js
+
+- If the app uses environment variables, edit the `.env` in the project directory.
+- To re-run the script safely, run `sudo bash setup.sh` again; it is idempotent for main steps.
+
+SUMMARY
+
+exit 0
+
*** End Patch
