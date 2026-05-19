# ProyectoPDP
Proyecto grupal para la asignatura de PDP. Grupo conformado por Rubén Feijoo, Martín Arizaga, Marco Aurelio y Jack Cubas. El objetivo de este proyecto es diseñar e implementar una aplicación de firmas digitales utilizando lenguaje javascript para el front-end y node.js para el back-end, haciendo uso de la arquitectura cliente-servidor.


# Descripción del proyecto
El proyecto consiste en la creación de una aplicación que gestiona firmas digitales. 

En concreto, la aplicación debe asociar una firma digital con un usuario, mediante un sistema de claves (comprar una clave pública con una clave privada, similar a lo que se utiliza en un repositorio git). Lo que se pretende con esto es evitar que se falsifique firmas.

Para el desarrollo de la aplicación, se tendrá en cuenta los siguientes datos:
- Usuarios
- Visados
- Firmas digitales

Las tecnologías a emplear son las siguientes:
- Para frontend: Javascript
- Para backend: Node.js


# Enable NAT + Port Forwarding in VirtualBox
VM → Settings → Network → Adapter 1 → NAT → Port Forwarding

Anhade dos reglas:
Name:         Protocol:       Host IP:       Host Port:     Guest IP:      Guest Port:
https         TCP             127.0.0.1      433            VM IP          443
http          TCP             127.0.0.1      80             VM IP          80

Finalmente, Windows podrá acceder a los siguientes URLs:
https://localhost
http://localhost


# Enable Bridged Adapter in VirtualBox (recommended for LAN access)
Esto hara que al VM aparecera como si fuera una maquina verdadero en tu red.
VM → Settings → Network → Adapter 1 → Bridged Adapter

No se puede acceder desde Windows al URL https://localhost con esta configuracion.


# Como entrar en la aplicación una vez installado
- URL: https://localhost
- Usuario ADMIN - Correo: steve@gmail.com - Pass: stevePass
- Usuario FIRMA - Correo: robert@gmail.com - Pass: robertPass
- Usuario CLIENT 1 - Correo: david1@gmail.com - Pass: david1Pass
- Usuario CLIENT 2 - Correo: luis@gmail.com - Pass: luisPass


# Datos originales
Hay subidos 3 aplicaciones de prueba

Navigate to the server directory:
   ```bash
   cd node js


Install dependencies using npm:
   ```bash
   npm install
   npm install express
   ```

Start the server:
   ```bash
   npm start
   ```

or:

node server.js
or:
node app.js

or:

npm i && npm start




Access the application in your web browser at 
`http://localhost:3000`.