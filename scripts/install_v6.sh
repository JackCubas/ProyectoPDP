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
echo "Por favor, escoja el directorio donde quieres descargar el app..."
read directorio

if [ ! -d "$directorio" ]; then
    echo "Creando directorio..."
    mkdir -p "$directorio" || { echo "ERROR creando directorio"; exit 1; }
fi

chmod -R 755 "$directorio"

##############################################################
### DESCARGA SEGURA EN DIRECTORIO TEMPORAL
##############################################################
echo "Descargando proyecto..."

TMPDIR=$(mktemp -d)
wget -q -O "$TMPDIR/proyecto.zip" https://github.com/JackCubas/ProyectoFigma/archive/refs/heads/main.zip
unzip -q "$TMPDIR/proyecto.zip" -d "$TMPDIR"

PROYECTO="$TMPDIR/ProyectoFigma-main"

# Copiar proyecto al directorio final
cp -r "$PROYECTO"/* "$directorio"/

##############################################################
echo "Quieres instalar el frontend? (yes/no)"
read inputFront

if [ "$inputFront" == "yes" ]; then

    echo "Instalando Apache..."
    apt install -y apache2

    echo "Copiando frontend..."
    rm -rf /var/www/html/*
    cp -r "$directorio/cliente_api_mysql/"* /var/www/html/

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
    echo "Saltado instalación de frontend..."
fi

##############################################################
echo "Quieres deshabilitar el firewall? (yes/no)"
read deshabitFire

if [ "$deshabitFire" == "yes" ]; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw reload
fi

##############################################################
echo "Quieres cambiar la hora a hora local Madrid? (yes/no)"
read horaLocalMadrid

if [ "$horaLocalMadrid" == "yes" ]; then
    timedatectl set-timezone Europe/Madrid
fi

##############################################################
echo "Quieres instalar el backend y base de datos? (yes/no)"
read inputBack

if [ "$inputBack" == "yes" ]; then

    echo "Instalando y configurando backend + base de datos..."

    cd "$directorio/node_js_api_mysql"

    XAMPP_URL="https://sourceforge.net/projects/xampp/files/XAMPP%20Linux/8.2.12/xampp-linux-x64-8.2.12-0-installer.run/download"
    INSTALLER="xampp-installer.run"
    XAMPP_PATH="/opt/lampp"
    MYSQL_USER="root"
    MYSQL_PASS="admin"
    DB_NAME="firma_app"

    apt-get update -y
    apt-get install -y wget net-tools

    echo "Descargando instalador XAMPP..."
    wget -O $INSTALLER $XAMPP_URL
    chmod a+x $INSTALLER

    echo "Instalando XAMPP..."
    ./$INSTALLER --mode unattended
    chmod a+x $XAMPP_PATH/lampp

    ##############################################################
    ### DESHABILITAR APACHE DE XAMPP *ANTES* DE INICIARLO
    ##############################################################
    echo "Deshabilitando Apache de XAMPP antes de iniciar LAMPP..."

    sed -i 's/startApache/#startApache/' /opt/lampp/lampp
    sed -i 's/stopApache/#stopApache/' /opt/lampp/lampp
    /opt/lampp/lampp stopapache 2>/dev/null

    echo "Apache de XAMPP deshabilitado."

    ##############################################################
    ### INICIAR SOLO MYSQL
    ##############################################################
    echo "Iniciando XAMPP (solo MySQL)..."
    /opt/lampp/lampp startmysql
    sleep 5

    ##############################################################
    ### CONFIGURAR BASE DE DATOS
    ##############################################################
    echo "Configurando base de datos..."

    $XAMPP_PATH/bin/mysqladmin -u root password $MYSQL_PASS 2>/dev/null
    $XAMPP_PATH/bin/mysql -u$MYSQL_USER -p$MYSQL_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
    $XAMPP_PATH/bin/mysql -u$MYSQL_USER -p$MYSQL_PASS $DB_NAME < firma_app.sql

    ##############################################################
    ### INSTALAR DEPENDENCIAS BACKEND
    ##############################################################
    echo "Instalando dependencias backend..."
    npm install

    ##############################################################
    ### DETECTAR IP DE LA VM
    ##############################################################
    get_vm_ip() {
        ip -4 addr show | awk '/inet / && $2 !~ /^127/ && $NF !~ /docker|vboxnet/ {print $2}' | cut -d/ -f1 | head -n 1
    }
    VM_IP=$(get_vm_ip)
    echo "IP detectada de la máquina virtual: $VM_IP"

    ##############################################################
    echo "=============================="
    echo " Instalación finalizada"
    echo ""
    echo "Si usas NAT + Port Forwarding:"
    echo "  https://localhost"
    echo ""
    echo "Si usas Adaptador Puente:"
    echo "  https://$VM_IP"
    echo "=============================="
    ##############################################################

    # No bloquear el script
    nohup npm start >/var/log/backend.log 2>&1 &

else
    echo "Saltado instalación de backend y base de datos..."
fi
