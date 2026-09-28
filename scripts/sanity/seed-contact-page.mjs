/**
 * Publish the Contact page document editors see under Páginas.
 *   node scripts/sanity/seed-contact-page.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';

function cliToken() {
  const file = path.join(os.homedir(), '.config', 'sanity', 'config.json');
  const config = JSON.parse(fs.readFileSync(file, 'utf8'));
  return config.authToken ?? '';
}

const token = process.env.SANITY_API_WRITE_TOKEN || cliToken();
if (!token) throw new Error('No Sanity token');

const client = createClient({
  projectId: 'fxardjr1',
  dataset: 'web-2026',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const field = (key, kind, label, extra = {}) => ({
  _key: key,
  _type: 'contactField',
  kind,
  label,
  placeholder: '',
  hint: '',
  required: true,
  width: 'half',
  ...extra,
});

const doc = {
  _id: 'contactPage',
  _type: 'contactPage',
  title: 'Contacto',
  bannerTitle: '¿Tienes una idea?',
  bannerSubtitle: 'La construimos bien.',
  submitLabel: 'Enviar mensaje',
  servicesError: 'Elige al menos un servicio.',
  amountLabel: 'Monto',
  amountPlaceholder: 'Escribe cuánto',
  budgetError: 'Elige un presupuesto.',
  customBudgetError: 'Escribe el monto en MXN.',
  metaTitle: 'Contacto — Hiweb Marketing',
  metaDescription: 'Cuéntanos tu proyecto. Nombre, servicio de interés y presupuesto. Respuesta en 24h.',
  fields: [
    field('firstName', 'firstName', 'Nombre', { placeholder: 'Tu nombre' }),
    field('lastName', 'lastName', 'Apellido', { placeholder: 'Tu apellido' }),
    field('email', 'email', 'Email', { placeholder: 'tu@empresa.com' }),
    field('phone', 'phone', 'Celular', { placeholder: '+52 999 000 0000' }),
    field('website', 'website', 'Sitio web (opcional)', {
      placeholder: 'https://tuempresa.com',
      required: false,
      width: 'full',
    }),
    field('services', 'services', 'Servicio de interés', {
      hint: 'Puedes elegir uno o varios.',
      width: 'full',
    }),
    field('budget', 'budget', 'Presupuesto (MXN)', { width: 'full' }),
    field('project', 'project', 'Cuéntanos acerca de tu proyecto (opcional)', {
      placeholder: 'Industria, objetivo y qué ya está en marcha.',
      required: false,
      width: 'full',
    }),
  ],
  services: [
    ['redes', 'Redes Sociales'],
    ['seo', 'SEO'],
    ['meta', 'Meta Ads'],
    ['google', 'Google Ads'],
    ['branding', 'Branding'],
    ['crm', 'CRM & Automatización'],
    ['community', 'Community Manager'],
    ['ia', 'IA Marketing'],
    ['web', 'Desarrollo Web'],
  ].map(([key, label]) => ({ _key: key, _type: 'contactService', label })),
  budgets: [
    ['8k', '+ $8,000', false],
    ['15k', '+ $15,000', false],
    ['30k', '+ $30,000', false],
    ['60k', '+ $60,000', false],
    ['custom', 'Personalizado', true],
  ].map(([key, label, custom]) => ({ _key: key, _type: 'contactBudget', label, custom })),
};

const existing = await client.fetch(`*[_id == "contactPage"][0]{_id, _rev}`);
if (existing?._rev) {
  console.log('Contact page already published. Leaving editor changes in place.');
} else {
  await client.createOrReplace(doc);
  console.log('Published contactPage.');
}
