import type { LpCalendarCopy, LpRoiInvestment, LpRoiLabels } from '../../lib/content/lp-types';

export const LP_FORM_DEFAULTS = {
  formMessageTab: 'Escribir mensaje',
  formCallTab: 'Agendar llamada',
  formTitle: 'Cuéntanos de tu empresa',
  formSubtitle: 'Cuatro pasos. Sin compromiso.',
  formCountries: ['México', 'Estados Unidos', 'Canadá', 'Otro'],
  formSizes: ['1 a 14 personas', '15 a 50 personas', '51 a 200 personas', 'Más de 200 personas'],
  formBudgets: ['+$10,000', '+$15,000', '+$30,000', '+$60,000', 'Personalizado'],
};

export const LP_CALENDAR_DEFAULTS: LpCalendarCopy = {
  title: 'Agenda tu diagnóstico',
  description: 'Elige día y hora. La llamada es con el equipo que trabajaría tu cuenta.',
};

export const LP_NAV_DEFAULTS = {
  calendarLabel: 'Agendar',
  whatsappLabel: 'WhatsApp',
};

export const LP_SYSTEM_CTA_DEFAULTS = {
  ctaTitle: 'Agenda tu diagnóstico',
  ctaText: 'Elige día y hora. La llamada es con el equipo que trabajaría tu cuenta.',
};

export const LP_CASES_DEFAULTS = {
  cardCtaLabel: 'Ver caso',
  portfolioLabel: 'Ver portafolio →',
  portfolioHref: '/portafolio',
};

export const LP_ROI_INVESTMENT: LpRoiInvestment = {
  initial: 40000,
  step: 5000,
  min: 10000,
  max: 300000,
};

export const LP_ROI_LABELS: LpRoiLabels = {
  industryLabel: 'Tu industria',
  investmentLabel: 'Inversión mensual en marketing',
  assumptionsLabel: 'Supuestos de',
  assumptionsHint: 'Valores de referencia del sector. Cámbialos por los de tu negocio.',
  resetLabel: 'Restablecer valores del sector',
  cplLabel: 'Costo por lead',
  closeLabel: 'Tasa de cierre',
  ticketLabel: 'Venta promedio',
  marginLabel: 'Margen de utilidad',
  resultLabel: 'Retorno estimado sobre tu inversión',
  formula: '(Utilidad − inversión) ÷ inversión. Se calcula con la utilidad de las ventas, no solo con los ingresos.',
  negativeBadge: 'Aún no recuperas la inversión',
  negativeHint: 'Prueba con más presupuesto, mejor cierre o mayor venta promedio.',
  funnelInvestment: 'Inversión mensual',
  funnelLeads: 'Leads al mes',
  funnelClients: 'Clientes nuevos',
  funnelRevenue: 'Ventas estimadas',
  funnelProfit: 'Utilidad estimada',
  disclaimer: 'Estimación con fines ilustrativos. El resultado real depende de tu negocio, tu mercado y tu inversión.',
  dockCta: 'Ver detalle',
};
