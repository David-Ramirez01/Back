
# 📦 E-commerce Full Stack

Proyecto de E-commerce Full Stack desarrollado con:

- 🔧 **Frontend:** React 
- 🖥️ **Backend:** Node.js + Express
- 🗄️ **Base de Datos:** MySQL

---

## 🛠️ Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión recomendada 18 o superior)
- [MySQL](https://www.mysql.com/)
- [Git](https://git-scm.com/)
- [NPM](https://www.npmjs.com/) o [Yarn](https://yarnpkg.com/) (según prefieras)

---

## 🗄️ Configuración de la Base de Datos

1. Abre **MySQL Workbench**, consola o tu herramienta favorita.
2. Crea una base de datos vacía, por ejemplo:

```sql
CREATE DATABASE ecommerce;
```

3. Ejecuta los scripts SQL que están en la carpeta `/BD` de este proyecto para crear las tablas necesarias.

4. Verifica y ajusta en el backend el archivo `.env` o el archivo de conexión los datos de acceso a la BD:

```
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=ecommerce
```

---

## 🚀 Ejecución del Backend

1. Abre una terminal en la carpeta `back`.
2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` con la configuración necesaria, por ejemplo:

```
PORT=3001
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=ecommerce
```

4. Inicia el servidor:

```bash
npm run dev
```

El backend estará corriendo en `http://localhost:3001`.

---

## 🌐 Ejecución del Frontend

1. Abre otra terminal en la carpeta `front`.
2. Instala las dependencias:

```bash
npm install
```

3. Si es necesario, en los archivos de configuración (por ejemplo, `api.js` o similar) asegúrate de que las rutas de la API apunten al backend, por ejemplo:

```js
const API_URL = "http://localhost:3001";
```

4. Inicia la aplicación:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique la terminal).

---

## 🗂️ Estructura del Proyecto

```
.
├── BD/              # Scripts SQL para crear las tablas y la base de datos
├── back/            # Backend con Node.js y Express
│   ├── routes/      # Rutas de la API
│   ├── controllers/ # Controladores de las rutas
│   └── server.js    # Punto de entrada del servidor
├── front/           # Frontend en React
│   └── src/
└── README.md
```

---

## ✅ Funcionalidades

- Registro e inicio de sesión de usuarios
- Visualización de productos
- Carrito de compras
- Gestión de productos (solo admin)
- Generación de PDF de compras
- Sistema de pedidos y control de estado (en proceso, despachado, entregado)

---

## 🐛 Notas

- Recuerda tener el backend corriendo antes de usar el frontend.
- La BD debe estar correctamente creada y configurada.
- Solo los usuarios autenticados pueden comprar o acceder al carrito.

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](https://choosealicense.com/licenses/mit/).
