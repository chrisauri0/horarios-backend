## Descripción

Backend de horarios para universidad, desarrollado con NestJS, Prisma y microservicio Python para la generación de horarios óptimos.

### Módulos principales

- **Usuarios**: Registro, login, login de administrador, roles, validación de correo institucional.
- **Carreras**: CRUD con validación de duplicados.
- **Materias, Profesores, Salones, Grupos**: CRUD y relaciones para la estructura académica.
- **Horarios**: Generación y almacenamiento de horarios por grupo.
- **Scheduler**: Servicio que llama al microservicio Python y guarda los horarios generados.

### Endpoints principales

#### Usuarios

- `POST /users/register` — Registro de usuario (solo @uteq.edu.mx)
- `POST /users/login` — Login normal
- `POST /users/login-admin` — Login solo para administradores (requiere rol 'administrador', devuelve JWT)

#### Carreras

- `GET /carreras` — Listar carreras
- `POST /carreras` — Crear carrera (verifica duplicados)

#### Scheduler

- `POST /scheduler/generate` — Genera y guarda horarios por grupo usando el microservicio Python
- `GET /scheduler/all` — Obtiene todos los horarios guardados

#### Python

- `GET /python/run` — Ejecuta el script Python y devuelve el horario generado

### Flujo de generación de horarios

1. El backend llama al microservicio Python (`/python/run` o `/scheduler/generate`).
2. El microservicio Python recibe la estructura de materias, grupos, profesores y salones, y genera el horario óptimo usando OR-Tools.
3. El backend agrupa los resultados por grupo y los guarda en la tabla `horarios`.
4. Los horarios pueden consultarse por grupo o en conjunto.

### Autenticación y roles

- Login y registro usan bcrypt para contraseñas.
- Login de administrador requiere rol 'administrador' y devuelve JWT.
- Endpoints protegidos pueden usar guards JWT y de roles.

### Estructura de base de datos (PostgreSQL)

- Tablas principales: `usuarios`, `carreras`, `materias`, `profesores`, `salones`, `grupos`, `horarios`.
- Relaciones muchos a muchos entre profesores y materias, y entre asignaciones y salones.
- Ejemplo de tabla de asignaciones:
  - `asignacion (id, grupo_id, materia_id, horas)`
  - `asignacion_profesor (asignacion_id, profesor_id)`
  - `asignacion_salon (asignacion_id, salon_id)`

### Integración Python

- El microservicio Python recibe los datos y devuelve el horario en formato JSON.
- El backend parsea y guarda el resultado en la base de datos.

### Ejemplo de estructura de horario generado

```json
{
  "group": "IDGS15",
  "subj": "Ingles",
  "start": "Vie21",
  "room": "Aula 13 edificio k",
  "prof": "Profe Ingles1"
}
```

## Requisitos para correr el proyecto

1. **Node.js** (v18 o superior recomendado)
2. **pnpm** (gestor de paquetes)

- Instala con: `npm install -g pnpm`

3. **PostgreSQL** (base de datos)

- Crea una base de datos y configura la conexión en `.env` o en tu archivo de configuración Prisma.

4. **Python 3.10+** (para el microservicio de horarios)

- Instala dependencias con: `pip install -r requirements.txt` en la carpeta del microservicio.

5. **Prisma**

- Instala con: `pnpm add -D prisma`
- Genera el cliente: `pnpm prisma generate`
- Ejecuta migraciones: `pnpm prisma migrate dev`

6. **Configura variables de entorno**

- Crea un archivo `.env` con las variables necesarias, por ejemplo:
  ```env
  DATABASE_URL=postgresql://usuario:password@localhost:5432/tu_db
  JWT_SECRET=tu_secreto
  ```

7. **Microservicio Python**

- Asegúrate de que el microservicio esté corriendo en el puerto configurado (por defecto `localhost:5000`).

## Pasos para correr el proyecto

```bash
# Clona el repositorio
git clone https://github.com/chrisauri0/horarios-backend.git
cd horarios-backend

# Instala dependencias
pnpm install

# Configura la base de datos y variables de entorno
# (ver sección de requisitos)

# Ejecuta migraciones y genera Prisma
pnpm prisma migrate dev
pnpm prisma generate

# Inicia el microservicio Python (en su carpeta)
python src/python/cp_sat_schedule.py

# Inicia el backend NestJS
pnpm run start:dev

# Accede a los endpoints en http://localhost:3000
```

## Notas adicionales

- Asegúrate de que la base de datos esté corriendo y accesible.
- El microservicio Python debe estar activo para generar horarios.
- Puedes modificar la configuración en `.env` según tu entorno.
