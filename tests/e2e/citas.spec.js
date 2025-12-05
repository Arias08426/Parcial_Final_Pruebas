import { test, expect } from '@playwright/test';

async function resetDatabase() {
  await fetch('http://127.0.0.1:5000/api/reset', { method: 'POST' });
}

test.describe('Pruebas E2E - Sistema de Citas', () => {
  
  test.beforeEach(async ({ page }) => {
    await resetDatabase();
    await page.goto('/');
    await page.waitForSelector('h1');
  });

  test('registro y agendamiento completo', async ({ page }) => {
    await page.fill('#nombre-paciente', 'María González');
    await page.fill('#email-paciente', 'maria@ejemplo.com');
    await page.fill('#telefono-paciente', '5551234567');
    await page.click('#btn-registrar-paciente');
    
    await expect(page.locator('#mensaje-exito')).toContainText('Paciente registrado exitosamente');
    await page.waitForSelector('text=/Tu ID de paciente es:/');
    
    await page.selectOption('#doctor-select', '1');
    await page.fill('#fecha-cita', '2025-12-15');
    await page.fill('#hora-cita', '10:00');
    await page.click('#btn-agendar-cita');
    
    await expect(page.locator('#mensaje-exito')).toContainText('Cita agendada exitosamente');
    await expect(page.locator('.cita-item')).toBeVisible();
  });

  test('rechaza email invalido', async ({ page }) => {
    await page.fill('#nombre-paciente', 'Pedro López');
    await page.fill('#email-paciente', 'email-invalido');
    await page.fill('#telefono-paciente', '5559876543');
    await page.click('#btn-registrar-paciente');
    
    await page.waitForSelector('#mensaje-error', { timeout: 10000 });
    await expect(page.locator('#mensaje-error')).toContainText('Email');
  });

  test('rechaza campos vacios', async ({ page }) => {
    await page.click('#btn-registrar-paciente');
    await expect(page.locator('#mensaje-error')).toContainText('Todos los campos son obligatorios');
  });

  test('rechaza telefono con menos de 10 digitos', async ({ page }) => {
    await page.fill('#nombre-paciente', 'Ana Martínez');
    await page.fill('#email-paciente', 'ana@ejemplo.com');
    await page.fill('#telefono-paciente', '123456');
    await page.click('#btn-registrar-paciente');
    
    await expect(page.locator('#mensaje-error')).toContainText('Teléfono debe tener 10 dígitos');
  });

  test('rechaza cita en horario ocupado', async ({ page }) => {
    await page.fill('#nombre-paciente', 'Carlos Ruiz');
    await page.fill('#email-paciente', 'carlos@ejemplo.com');
    await page.fill('#telefono-paciente', '5551111111');
    await page.click('#btn-registrar-paciente');
    await page.waitForSelector('text=/Paciente registrado/');
    
    await page.selectOption('#doctor-select', '2');
    await page.fill('#fecha-cita', '2025-12-20');
    await page.fill('#hora-cita', '15:30');
    await page.click('#btn-agendar-cita');
    await page.waitForSelector('text=/Cita agendada/');
    
    await page.fill('#nombre-paciente', 'Laura Fernández');
    await page.fill('#email-paciente', 'laura@ejemplo.com');
    await page.fill('#telefono-paciente', '5552222222');
    await page.click('#btn-registrar-paciente');
    await page.waitForSelector('text=/Paciente registrado/');
    
    await page.selectOption('#doctor-select', '2');
    await page.fill('#fecha-cita', '2025-12-20');
    await page.fill('#hora-cita', '15:30');
    await page.click('#btn-agendar-cita');
    
    await expect(page.locator('#mensaje-error')).toContainText('El horario ya está ocupado');
  });

  test('cancela cita correctamente', async ({ page }) => {
    await page.fill('#nombre-paciente', 'Roberto Sánchez');
    await page.fill('#email-paciente', 'roberto@ejemplo.com');
    await page.fill('#telefono-paciente', '5553333333');
    await page.click('#btn-registrar-paciente');
    await page.waitForSelector('text=/Paciente registrado/');
    
    await page.selectOption('#doctor-select', '3');
    await page.fill('#fecha-cita', '2025-12-25');
    await page.fill('#hora-cita', '09:00');
    await page.click('#btn-agendar-cita');
    await page.waitForSelector('.cita-item');
    
    await page.click('.btn-cancelar');
    await expect(page.locator('#mensaje-exito')).toContainText('Cita cancelada exitosamente');
  });

  test('rechaza email duplicado', async ({ page }) => {
    await page.fill('#nombre-paciente', 'Usuario Uno');
    await page.fill('#email-paciente', 'duplicado@ejemplo.com');
    await page.fill('#telefono-paciente', '5555555555');
    await page.click('#btn-registrar-paciente');
    await page.waitForSelector('text=/Paciente registrado/');
    
    await page.fill('#nombre-paciente', 'Usuario Dos');
    await page.fill('#email-paciente', 'duplicado@ejemplo.com');
    await page.fill('#telefono-paciente', '5556666666');
    await page.click('#btn-registrar-paciente');
    
    await expect(page.locator('#mensaje-error')).toContainText('El email ya está registrado');
  });

  test('boton agendar deshabilitado sin registro', async ({ page }) => {
    const botonAgendar = page.locator('#btn-agendar-cita');
    await expect(botonAgendar).toBeDisabled();
  });

  test('acepta telefono de 10 digitos exactos', async ({ page }) => {
    await page.fill('#nombre-paciente', 'Sofía Torres');
    await page.fill('#email-paciente', 'sofia@ejemplo.com');
    await page.fill('#telefono-paciente', '1234567890');
    await page.click('#btn-registrar-paciente');
    
    await expect(page.locator('#mensaje-exito')).toContainText('Paciente registrado exitosamente');
  });

});
