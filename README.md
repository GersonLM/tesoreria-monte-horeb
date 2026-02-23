# Backend - Tesorería Monte Horeb

API REST para el sistema de tesorería con autenticación JWT y gestión de usuarios.

## Tecnologías

- Node.js con ES6+ Modules
- Express
- MongoDB + Mongoose
- Babel para transpilación
- JWT para autenticación
- Bcrypt para encriptación de contraseñas

## Instalación

```bash
npm install
```

## Configuración

Edita el archivo `variables.env` con tu configuración:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tesoreria_monte_horeb
NODE_ENV=development
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=7d
```

## Ejecutar

Modo desarrollo:
```bash
npm run dev
```

Compilar para producción:
```bash
npm run build
npm start
```

## Estructura

```
src/
├── config/           # Configuración de DB
├── controllers/      # Controladores
├── middlewares/      # Middlewares (auth, validation, errors)
├── models/           # Modelos de Mongoose
├── routes/           # Rutas de la API
├── services/         # Lógica de negocio
├── helpers/          # Funciones auxiliares
├── consts.js         # Constantes
├── index.js          # Exports
└── app.js            # Aplicación principal
```

## Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/comprometidos` - Listar comprometidos
- `POST /api/users` - Crear usuario (admin)
- `PUT /api/users/:id` - Actualizar usuario (admin)
- `DELETE /api/users/:id` - Eliminar usuario (admin)
- `PUT /api/users/:id/monto` - Actualizar monto comprometido (admin)

### Tesorería
- `GET /api/tesoreria/resumen/:mes/:year` - Resumen mensual
- `GET /api/tesoreria/resumen-anual/:year` - Resumen anual
- `GET /api/tesoreria/comprometidos/:mes/:year` - Estado de comprometidos
- `POST /api/tesoreria/ofrendas` - Crear ofrenda (admin)
- `POST /api/tesoreria/ventas` - Crear venta (admin)
- `POST /api/tesoreria/egresos` - Crear egreso (admin)
- `POST /api/tesoreria/aportes` - Registrar aporte (admin)

## Roles

- **admin**: Acceso completo
- **comprometido**: Solo lectura

## Autenticación

Todas las rutas (excepto registro y login) requieren token JWT en el header:

```
Authorization: Bearer <token>
```
