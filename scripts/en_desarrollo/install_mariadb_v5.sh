#!/bin/bash

echo "=============================="
echo " Instalación automática proyecto"
echo "=============================="

# Verificar root
if [ "$EUID" -ne 0 ]; then
  echo "Por favor ejecuta como root: sudo ./install.sh"
  exit 1
fi

echo "Instalando dependencias básicas..."
apt install -y curl git build-essential unzip wget

echo "Versiones instaladas:"
npm -v
git --version

##############################################################
# Directorio donde se encuentra el script
DEFAULT_DIR="$(pwd)"

echo "Directorio por defecto para descargar el app:"
echo "  $DEFAULT_DIR"
echo
echo "¿Quieres usar este directorio? (yes/no)"
read usar_default

if [[ "$usar_default" == "no" ]]; then
    echo "Por favor, escoja el directorio donde quieres descargar el app..."
    read directorio
else
    directorio="$DEFAULT_DIR"
fi

# Crear directorio si no existe
if [ ! -d "$directorio" ]; then
    echo "Creando directorio..."
    mkdir -p "$directorio" || { echo "ERROR creando directorio"; exit 1; }
fi

chmod -R 755 "$directorio"

echo "Descargando proyecto..."
cd "$directorio" || { echo "ERROR: no se pudo acceder al directorio"; exit 1; }

wget -q https://github.com/JackCubas/ProyectoPDP/archive/refs/heads/intento_refinado1.zip -O proyecto.zip
unzip -q proyecto.zip
PROYECTO="$directorio/ProyectoPDP-intento_refinado1"

#wget -q https://github.com/JackCubas/ProyectoFigma/archive/refs/heads/main.zip
#unzip -q main.zip
#PROYECTO="$directorio/ProyectoFigma-main"

##############################################################
echo "Quieres instalar el frontend? (yes/no)"
read inputFront

if [ "$inputFront" == "yes" ]; then

    echo "Instalando Apache..."
    apt install -y apache2

    # Habilitar módulos necesarios ANTES de crear los VirtualHost
    a2enmod proxy
    a2enmod proxy_http
    a2enmod ssl

    BASE="/var/www/html"

    echo "¿Dónde quieres instalar el frontend (dentro de $BASE)?"
    echo "Pulsa ENTER para usar $BASE"
    read -r FRONTEND_DIR

    FRONTEND_DIR=${FRONTEND_DIR:-$BASE}

    if [[ "$FRONTEND_DIR" != "$BASE" && "$FRONTEND_DIR" != "$BASE"/* ]]; then
        FRONTEND_DIR="$BASE/$FRONTEND_DIR"
    fi

    # Normalize the final path
    FRONTEND_DIR=$(realpath -m "$FRONTEND_DIR")

    echo "Instalando frontend en: $FRONTEND_DIR"

    # If directory does not exist, create it
    if [[ ! -d "$FRONTEND_DIR" ]]; then
        echo "Directorio no existe. Creándolo..."
        mkdir -p "$FRONTEND_DIR"
        #rm -rf "$FRONTEND_DIR"/*      
    fi

    cp -r "$PROYECTO/cliente_api_mysql/"* "$FRONTEND_DIR/"

    #REAL_FRONTEND_DIR=$(realpath "$FRONTEND_DIR" 2>/dev/null)
    #echo "Instalando frontend en: $REAL_FRONTEND_DIR"

    # Fix permisos si está en /home
    #if [[ "$REAL_FRONTEND_DIR" == /home/* ]]; then
    #    echo "Fixing Apache access permissions..."
    #    CURRENT="/"
    #    IFS='/' read -ra PARTS <<< "$REAL_FRONTEND_DIR"
    #    for PART in "${PARTS[@]}"; do
    #        [[ -z "$PART" ]] && continue
    #        CURRENT="$CURRENT$PART"
    #        chmod o+rx "$CURRENT"
    #        CURRENT="$CURRENT/"
    #    done
    #fi

    chown -R www-data:www-data "$FRONTEND_DIR"
    chmod -R 755 "$FRONTEND_DIR"

    echo "Generando certificado SSL..."
    mkdir -p /etc/apache2/ssl

    openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/apache2/ssl/apache.key \
    -out /etc/apache2/ssl/apache.crt \
    -subj "/C=ES/ST=Estado/L=Ciudad/O=MiEmpresa/OU=IT/CN=localhost"

    echo "¿Cual es el url o ip del backend (el puerto siempre será 3000)?"
    echo "Pulsa ENTER para usar localhost"
    read -r BACKEND_URL

    BACKEND_URL=${BACKEND_URL:-http://localhost}

    # Remove trailing slash if present
    BACKEND_URL="${BACKEND_URL%/}"

    # Crear VirtualHost SSL
    cat > /etc/apache2/sites-available/https-front-ssl.conf <<EOF
    <VirtualHost *:443>
        ServerName https_front
        DocumentRoot "$FRONTEND_DIR"
        SSLEngine on
        SSLCertificateFile /etc/apache2/ssl/apache.crt
        SSLCertificateKeyFile /etc/apache2/ssl/apache.key
        <Directory "$FRONTEND_DIR">
            AllowOverride All
            Require all granted
        </Directory>

        # Reverse Proxy
        ProxyPreserveHost On
        ProxyPass /api "$BACKEND_URL:3000"
        ProxyPassReverse /api "$BACKEND_URL:3000"
    </VirtualHost>
EOF

    # VirtualHost HTTP
#    cat > /etc/apache2/sites-available/000-default.conf <<EOF
#    <VirtualHost *:80>
#        ServerName localhost
#        DocumentRoot $FRONTEND_DIR
#        <Directory $FRONTEND_DIR>
#            AllowOverride All
#            Require all granted
#        </Directory>
#    </VirtualHost>
#EOF

    #a2ensite 000-default.conf
    a2ensite localhost-ssl.conf

    systemctl reload apache2

    echo "Reverse Proxy configurado correctamente."
    echo "El frontend ahora puede llamar al backend usando /api/..."

else
    echo "Saltado installacion de frontend... "
fi
##############################################################
#Para desbloquear firewall
echo "Quieres deshabilitar el firewall?(yes/no)"
read deshabitFire

if [ "$deshabitFire" == "yes" ]; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw reload
fi

#cambiar hora a Europe/Madrid:
echo "Quieres cambiar la hora a hora local Madrid?(yes/no)"
read horaLocalMadrid

if [ "$horaLocalMadrid" == "yes" ]; then
    timedatectl set-timezone Europe/Madrid
fi

##############################################################
echo "Quieres installar el backend y base de datos?(yes/no)"
read inputBack

if [ "$inputBack" == "yes" ]; then

    echo "Instalando y ejecutando servidor backend node js y base de datos"

    echo "Instalando Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs

    echo "Version de node installado:"
    node -v

    BASE_BACK="/opt"

    echo "¿Dónde quieres instalar el servidor Node JS (la carpeta será dentro de /opt)?"
    echo "Pulsa ENTER para usar $PROYECTO/node_js_api_mysql"
    read -r BACKEND_DIR

    # Si el usuario no escribe nada, usar el valor por defecto
    BACKEND_DIR=${BACKEND_DIR:-$PROYECTO/node_js_api_mysql}

    REAL_ORIGIN_DIR=$(realpath "$PROYECTO/node_js_api_mysql")
    REAL_BACKEND_DIR=$(realpath "$BACKEND_DIR")

    # Si el destino es distinto del origen → instalar backend
    if [[ "$REAL_BACKEND_DIR" != "$REAL_ORIGIN_DIR" ]]; then

        BACKEND_DIR="$BASE_BACK/$BACKEND_DIR"
        echo "Instalando backend en: $BACKEND_DIR"

        # If directory does not exist, create it
        if [[ ! -d "$BACKEND_DIR" ]]; then
            echo "Directorio no existe. Creándolo..."
            mkdir -p "$BACKEND_DIR"
            #rm -rf "$BACKEND_DIR"/*          
        fi 

        cp -r "$PROYECTO/node_js_api_mysql"/. "$BACKEND_DIR/"

    else
        echo "El backend ya está en el directorio de origen. No se copiarán archivos."
        echo "Continuando instalación usando el backend existente..."
    fi


    ###########################################################3

#BASE_BACK="/opt"
#ORIGIN_DIR="$PROYECTO/node_js_api_mysql"
#REAL_ORIGIN_DIR=$(realpath "$ORIGIN_DIR")

#echo "¿Dónde quieres instalar el servidor Node JS (la carpeta será dentro de $BASE_BACK)?"
#echo "Pulsa ENTER para usar el backend del repositorio:"
#echo "    $ORIGIN_DIR"
#read -r USER_INPUT

# If user presses ENTER → use origin directory
#if [[ -z "$USER_INPUT" ]]; then
#    BACKEND_DIR="$ORIGIN_DIR"
#else
    # Force installation inside /opt
#    BACKEND_DIR="$BASE_BACK/$USER_INPUT"
#fi

# Normalize final path
#REAL_BACKEND_DIR=$(realpath -m "$BACKEND_DIR")

# Compare normalized paths
#if [[ "$REAL_BACKEND_DIR" != "$REAL_ORIGIN_DIR" ]]; then

#    echo "Instalando backend en: $REAL_BACKEND_DIR"

#    if [[ ! -d "$REAL_BACKEND_DIR" ]]; then
#        echo "Directorio no existe. Creándolo..."
#        mkdir -p "$REAL_BACKEND_DIR"
#    fi

#    cp -r "$ORIGIN_DIR"/. "$REAL_BACKEND_DIR/"

#else
#    echo "El backend ya está en el directorio de origen. No se copiarán archivos."
#    echo "Continuando instalación usando el backend existente..."
#fi

    ############################################################

    # Si el backend está dentro de /home/user/documents
    #if [[ "$REAL_BACKEND_DIR" == /home/* ]]; then
    #    echo "Ajustando permisos de acceso para Node JS..."
    #    IFS='/' read -ra PARTS <<< "$REAL_BACKEND_DIR"
    #    CURRENT="/"

    #    for PART in "${PARTS[@]}"; do
    #        [[ -z "$PART" ]] && continue
    #        CURRENT="$CURRENT$PART"
    #        chmod o+x "$CURRENT"
    #        CURRENT="$CURRENT/"
    #    done
    #fi

    #echo "Instalando base de datos..."
    #cd "$BACKEND_DIR/node_js_api_mysql"

    echo "Instalando base de datos..."
    cd "$BACKEND_DIR"

    MYSQL_USER="root"
    MYSQL_PASS="admin"
    DB_NAME="firma_app"

    apt-get update -y
    apt-get install -y wget net-tools

    echo "Instalando MariaDB..."
    apt-get install -y mariadb-server mariadb-client

    echo "Detectando servicio MariaDB..."
    if systemctl list-unit-files | grep -q mariadb.service; then
        DB_SERVICE="mariadb"
    else
        DB_SERVICE="mysql"
    fi

    echo "Iniciando y habilitando servicio $DB_SERVICE..."
    systemctl start $DB_SERVICE
    systemctl enable $DB_SERVICE

    echo "Verificando que MariaDB está activo..."
    if ! systemctl is-active --quiet $DB_SERVICE; then
        echo "ERROR: MariaDB no pudo iniciarse."
        exit 1
    fi

    echo "Detectando binario MariaDB/MySQL..."
    if command -v mariadb >/dev/null 2>&1; then
        DB_BIN="mariadb"
        DB_ALTER_USER="ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('admin')"
    else
        DB_BIN="mysql"
        DB_ALTER_USER="ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin'"
    fi

    echo "Detectando plugin de root..."
    AUTH_PLUGIN=$($DB_BIN -u root -N -e "SELECT plugin FROM mysql.user WHERE User='root' AND Host='localhost';" 2>/dev/null)

    echo "Detectando authentication_string..."
    AUTH_STRING=$($DB_BIN -u root -N -e "SELECT authentication_string FROM mysql.user WHERE User='root' AND Host='localhost';" 2>/dev/null)

    # --- CASO CRÍTICO: root roto (authentication_string = invalid) ---
    if [ "$AUTH_STRING" = "invalid" ]; then
        echo "Root está roto (authentication_string=invalid) → reparando..."
        sudo $DB_BIN <<EOF
    $DB_ALTER_USER;
    FLUSH PRIVILEGES;
EOF
    fi

    # --- CASO: root usa unix_socket ---
    if [ "$AUTH_PLUGIN" = "unix_socket" ]; then
        echo "Root usa unix_socket → cambiando a contraseña..."
        sudo $DB_BIN <<EOF
    $DB_ALTER_USER;
    FLUSH PRIVILEGES;
EOF
    fi

    # --- Verificar que root ya funciona con contraseña ---
    echo "Comprobando acceso root con contraseña..."
    if ! $DB_BIN -u root -p"$MYSQL_PASS" -e "SELECT 1;" >/dev/null 2>&1; then
        echo "Root aún no tiene contraseña válida → forzando..."
        sudo $DB_BIN <<EOF
    $DB_ALTER_USER;
    FLUSH PRIVILEGES;
EOF
    fi

    echo "Asegurando MariaDB..."
    $DB_BIN -u$MYSQL_USER -p$MYSQL_PASS <<EOF
    DELETE FROM mysql.user WHERE User='';
    DELETE FROM mysql.user WHERE User='root' AND Host!='localhost';
    DROP DATABASE IF EXISTS test;
    DELETE FROM mysql.db WHERE Db='test' OR Db='test\_%';
    FLUSH PRIVILEGES;
EOF

    echo "Creando base de datos si no existe..."
    $DB_BIN -u$MYSQL_USER -p$MYSQL_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

    echo "Importando base de datos..."
    $DB_BIN -u$MYSQL_USER -p$MYSQL_PASS $DB_NAME < firma_app.sql

    echo "Base de datos configurada correctamente."

    echo "Instalando dependencias..."
    npm install

    
    ##############################################################
    ### DETECTAR IP DE LA VM
    ##############################################################
    get_vm_ip() {
        ip addr show | awk '/inet / && $2 !~ /^127/ {print $2}' | cut -d/ -f1 | head -n 1
    }
    VM_IP=$(get_vm_ip)
    echo "IP detectada de la máquina virtual: $VM_IP"

    ##############################################################
    echo "=============================="
    echo " Instalación finalizandose"
    echo " En caso de haber installado el frontend y backend: "
    echo " Accede en:"
    echo ""
    echo "Si usas NAT + Port Forwarding:"
    echo "  https://localhost"
    echo ""
    echo "Si usas Adaptador Puente:"
    echo "  https://$VM_IP"
    echo "=============================="
    ##############################################################

    npm start

else
    echo "Saltado installacion de backend y base de datos... "
fi



############################################
#############################################
#########################################


#echo "¿Dónde quieres instalar el frontend?"
#echo "Pulsa ENTER para usar /var/www/html"
#read -r FRONTEND_DIR

# Si el usuario no escribe nada, usar el valor por defecto
#FRONTEND_DIR=${FRONTEND_DIR:-/var/www/html}

#echo "Instalando frontend en: $FRONTEND_DIR"

# Crear el directorio si no existe
#mkdir -p "$FRONTEND_DIR"

# Limpiar contenido previo
#rm -rf "$FRONTEND_DIR"/*

# Copiar el frontend
#cp -r "$PROYECTO/cliente_api_mysql/"* "$FRONTEND_DIR/"


#cat > /etc/apache2/sites-available/localhost-ssl.conf <<EOF
#<VirtualHost *:443>
#    ServerName localhost
#    DocumentRoot $FRONTEND_DIR
#    SSLEngine on
#    SSLCertificateFile /etc/apache2/ssl/apache.crt
#    SSLCertificateKeyFile /etc/apache2/ssl/apache.key
#    <Directory $FRONTEND_DIR>
#        AllowOverride All
#        Require all granted
#    </Directory>
#</VirtualHost>
#EOF


###########################################



##############################################################
### BLOQUE MARIADB SEGURO E IDEMPOTENTE
##############################################################

#echo "Configurando MariaDB de forma segura..."

#MYSQL_USER="root"
#MYSQL_PASS="admin"
#DB_NAME="firma_app"

# 1. Asegurar que MariaDB está corriendo
#systemctl start mariadb

# 2. Crear archivo temporal con comandos SQL seguros
#SQL_TMP=$(mktemp)

#cat > "$SQL_TMP" <<EOF
#-- Crear root@localhost si no existe y asignar contraseña
#CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY '$MYSQL_PASS';
#ALTER USER 'root'@'localhost' IDENTIFIED BY '$MYSQL_PASS';

#-- Eliminar usuarios anónimos
#DELETE FROM mysql.user WHERE User='';

#-- Deshabilitar root remoto
#DELETE FROM mysql.user WHERE User='root' AND Host!='localhost';

#-- Eliminar base de datos de pruebas
#DROP DATABASE IF EXISTS test;
#DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';

#-- Crear base de datos si no existe
#CREATE DATABASE IF NOT EXISTS $DB_NAME;

#-- Aplicar cambios
#FLUSH PRIVILEGES;
#EOF

# 3. Ejecutar SQL de forma segura
#mariadb -u root < "$SQL_TMP" 2>/dev/null || mariadb -u root -p"$MYSQL_PASS" < "$SQL_TMP"

# 4. Limpiar archivo temporal
#rm -f "$SQL_TMP"

#echo "MariaDB configurado de forma segura."



################################################
#echo "Instalando Apache..."
#apt install -y apache2

#echo "Copiando frontend..."
#rm -rf /var/www/html/*
#cp -r "$PROYECTO/cliente_api_mysql/"* /var/www/html/

#echo "Habilitando SSL..."
#a2enmod ssl
#mkdir -p /etc/apache2/ssl

#openssl req -x509 -nodes -days 365 \
#-newkey rsa:2048 \
#-keyout /etc/apache2/ssl/apache.key \
#-out /etc/apache2/ssl/apache.crt \
#-subj "/C=ES/ST=Estado/L=Ciudad/O=MiEmpresa/OU=IT/CN=localhost"

# Evitar conflicto con el sitio SSL por defecto
#a2dissite default-ssl.conf 2>/dev/null

#cat > /etc/apache2/sites-available/localhost-ssl.conf <<EOF
#<VirtualHost *:443>
#    ServerName localhost
#    DocumentRoot /var/www/html
#    SSLEngine on
#    SSLCertificateFile /etc/apache2/ssl/apache.crt
#    SSLCertificateKeyFile /etc/apache2/ssl/apache.key
#    <Directory /var/www/html>
#        AllowOverride All
#        Require all granted
#    </Directory>
#</VirtualHost>
#EOF

#a2ensite localhost-ssl.conf

# Abrir puerto 443 si UFW está activo
#ufw allow 443/tcp 2>/dev/null

#systemctl restart apache2


