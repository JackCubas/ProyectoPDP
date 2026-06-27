# ProyectoPDP
Proyecto grupal para la asignatura de PDP. Grupo conformado por Rubén Feijoo, Martín Arizaga, Marco Aurelio y Jack Cubas. El objetivo de este proyecto es diseñar e implementar una aplicación de firmas digitales utilizando lenguaje javascript para el front-end y node.js para el back-end, haciendo uso de la arquitectura cliente-servidor tal y como se muestra en los videotutoriales disponibles aquí:  https://tristan-3.github.io/Figma-videos/


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


# Requisitos
Para poder utilizar correctamente algunas funcionalidades de la aplicación, es necesario disponer de la extensión de navegador web eID instalada y habilitada en el navegador. Esta extensión es un requisito previo para poder interactuar con las funciones de firma digital del proyecto.


# Habilitar NAT + Port Forwarding en VirtualBox
VM → Settings → Network → Adapter 1 → NAT → Port Forwarding

Añade estas tres reglas:
- Name: https   Protocol: TCP   Host IP: 127.0.0.1    Host Port: 433    Guest IP: VM IP    Guest Port: 443
- Name: http    Protocol: TCP   Host IP: 127.0.0.1    Host Port: 80     Guest IP: VM IP    Guest Port: 80
- Name: nodejs  Protocol: TCP   Host IP: (vacio)      Host Port: 3000   Guest IP: (vacio)  Guest Port: 3000
                                                   

Finalmente, Windows podrá acceder a los siguientes URLs:
- https://localhost
- http://localhost


# Habilitar Bridged Adapter en VirtualBox (recomendado para acceso LAN)
Esto hara que al VM aparecera como si fuera una maquina verdadero en tu red.

VM → Settings → Network → Adapter 1 → Bridged Adapter

No se puede acceder desde Windows al URL https://localhost con esta configuracion.


# Como entrar en la aplicación una vez installado
- URL: https://localhost
- Usuario ADMIN - Correo: steve@gmail.com - Pass: stevePass
- Usuario FIRMA - Correo: robert@gmail.com - Pass: robertPass
- Usuario CLIENT 1 - Correo: david1@gmail.com - Pass: david1Pass
- Usuario CLIENT 2 - Correo: luis@gmail.com - Pass: luisPass
