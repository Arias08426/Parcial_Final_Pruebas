# Sistema de Citas Medicas

Sistema de gestion de citas medicas con API REST (Flask), frontend (React) y pruebas E2E (Playwright).

## Estructura

```
Parcial 3-Pruebas/
├── backend/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── tests/
│   ├── e2e/
│   │   └── citas.spec.js
│   ├── package.json
│   └── playwright.config.js
└── .github/workflows/
    └── tests.yml
```

## Instalacion

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
python -m http.server 8080
```

### Pruebas
```bash
cd tests
npm install
npx playwright install chromium
npm test
```

## Funcionalidades

### API REST
- POST /api/pacientes - Registrar paciente
- GET /api/doctores - Listar doctores
- POST /api/citas - Crear cita
- GET /api/citas - Listar citas
- DELETE /api/citas/:id - Cancelar cita

### Frontend
- Formulario de registro
- Formulario de citas
- Lista de citas con boton cancelar

## Pruebas E2E

### Tecnicas Aplicadas

**Particion de Equivalencia**
- Datos validos vs invalidos
- Email correcto vs incorrecto
- Telefono 10 digitos vs menos

**Valores Limite**
- Campos vacios
- Telefono exacto 10 digitos

**Logica de Negocio**
- Horarios solapados
- Emails duplicados

### Casos de Prueba (9 casos)

1. Registro y agendamiento completo
2. Email invalido
3. Campos vacios
4. Telefono con menos de 10 digitos
5. Horario ocupado
6. Cancelacion de cita
7. Email duplicado
8. Boton deshabilitado sin registro
9. Telefono de 10 digitos exactos

## GitHub Actions

El workflow ejecuta las pruebas automaticamente y muestra "OK" si pasan.
