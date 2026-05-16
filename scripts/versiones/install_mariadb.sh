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

echo "Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

echo "Versiones instaladas:"
node -v
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

wget -q https://github.com/JackCubas/ProyectoFigma/archive/refs/heads/main.zip
unzip -q main.zip

PROYECTO="$directorio/ProyectoFigma-main"

##############################################################
echo "Quieres instalar el frontend? (yes/no)"
read inputFront

if [ "$inputFront" == "yes" ]; then

    echo "Instalando Apache..."
    apt install -y apache2

    echo "Copiando frontend..."
    rm -rf /var/www/html/*
    cp -r "$PROYECTO/cliente_api_mysql/"* /var/www/html/

    echo "Habilitando SSL..."
    a2enmod ssl
    mkdir -p /etc/apache2/ssl

    openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/apache2/ssl/apache.key \
    -out /etc/apache2/ssl/apache.crt \
    -subj "/C=ES/ST=Estado/L=Ciudad/O=MiEmpresa/OU=IT/CN=localhost"

    cat > /etc/apache2/sites-available/localhost-ssl.conf <<EOF
<VirtualHost *:443>
    ServerName localhost
    DocumentRoot /var/www/html
    SSLEngine on
    SSLCertificateFile /etc/apache2/ssl/apache.crt
    SSLCertificateKeyFile /etc/apache2/ssl/apache.key
    <Directory /var/www/html>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
EOF

    a2ensite localhost-ssl.conf
    systemctl reload apache2

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

    echo "Instalando base de datos..."
    cd "$PROYECTO/node_js_api_mysql"

    MYSQL_USER="root"
    MYSQL_PASS="admin"
    DB_NAME="firma_app"

    apt-get update -y
    apt-get install -y wget net-tools

    echo "Instalando MariaDB..."
    apt-get install mariadb-server mariadb-client

    echo "Iniciando y habilitando MariaDB..."
    systemctl start mysql
    systemctl enable mysql

    #n → Do NOT switch to unix_socket authentication
    #y → Set root password (or confirm it)
    #y → Remove anonymous users
    #y → Disallow remote root login
    #y → Remove test database and access to it

    echo "Asegurando MariaDB..."
    mysql_secure_installation <<EOF
n 
y
y
y
y
EOF

    #echo "Asegurando MariaDB..."
    #sudo mysql_secure_installation

    echo "Creand users y permisos de MariaDB..."
    mysql -u root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin';
FLUSH PRIVILEGES;
EOF

    echo "Creando base de datos si no existe..."
    mysql -u$MYSQL_USER -p$MYSQL_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

    echo "Importando base de datos..."
    mysql -u$MYSQL_USER -p$MYSQL_PASS $DB_NAME < firma_app.sql

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