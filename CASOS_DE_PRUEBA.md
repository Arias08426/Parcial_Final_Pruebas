# Documentacion de Casos de Prueba

## Tecnicas de Seleccion de Datos

### 1. Particion de Equivalencia
Dividir los datos en clases donde todos los valores se comportan igual:
- Email valido: formato usuario@dominio.extension
- Email invalido: sin @, sin dominio
- Telefono valido: 10 digitos numericos
- Telefono invalido: menos o mas de 10 digitos

### 2. Valores Limite
Probar los bordes de las validaciones:
- Campos vacios (limite inferior)
- Telefono 10 digitos (limite exacto)
- Telefono menos de 10 (debajo del limite)

### 3. Logica de Negocio
Validar reglas del dominio:
- Horarios no solapados para mismo doctor
- Emails unicos en el sistema
- Flujo de permisos (registro antes de agendar)

## Casos de Prueba

### Caso 1: Registro y agendamiento completo
Tecnica: Particion valida + Flujo E2E
Por que: Valida el camino feliz del sistema
Datos: Email valido, telefono 10 digitos

### Caso 2: Email invalido
Tecnica: Particion invalida
Por que: El email es critico para contactar pacientes
Datos: "email-invalido" (sin @ ni dominio)

### Caso 3: Campos vacios
Tecnica: Valores limite
Por que: Validar campos obligatorios
Datos: Todos los campos vacios

### Caso 4: Telefono con menos de 10 digitos
Tecnica: Particion invalida + Valores limite
Por que: El telefono debe tener formato especifico
Datos: "123456" (6 digitos)

### Caso 5: Horario ocupado
Tecnica: Logica de negocio
Por que: Evitar que dos pacientes tengan cita al mismo tiempo
Datos: Dos pacientes, mismo doctor, misma fecha/hora

### Caso 6: Cancelacion de cita
Tecnica: Flujo completo
Por que: Validar que los pacientes puedan cancelar
Datos: Registro -> Cita -> Cancelacion

### Caso 7: Email duplicado
Tecnica: Validacion de unicidad
Por que: Los emails deben ser unicos
Datos: Dos registros con mismo email

### Caso 8: Boton deshabilitado sin registro
Tecnica: Validacion de permisos
Por que: No se puede agendar sin registrarse
Datos: Verificar estado del boton

### Caso 9: Telefono de 10 digitos exactos
Tecnica: Valores limite (exacto)
Por que: Validar que el limite exacto funciona
Datos: "1234567890"

## Cobertura

- Validacion de email: Casos 1, 2, 7
- Validacion de telefono: Casos 1, 4, 9
- Campos obligatorios: Caso 3
- No solapamiento: Caso 5
- Cancelacion: Caso 6
- Permisos: Caso 8

Total: 9 casos cubriendo todas las funcionalidades
