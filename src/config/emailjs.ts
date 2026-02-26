export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID_USER: import.meta.env.VITE_EMAILJS_TEMPLATE_USER || '',
  TEMPLATE_ID_ADMIN: import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN || '',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL || 'sathsarani.m@botcalm.com',
};

// Log config on load (remove in production)
console.log('EmailJS Config loaded:', {
  SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID ? '✓' : '✗',
  TEMPLATE_ID_USER: EMAILJS_CONFIG.TEMPLATE_ID_USER ? '✓' : '✗',
  TEMPLATE_ID_ADMIN: EMAILJS_CONFIG.TEMPLATE_ID_ADMIN ? '✓' : '✗',
  PUBLIC_KEY: EMAILJS_CONFIG.PUBLIC_KEY ? '✓' : '✗',
  ADMIN_EMAIL: EMAILJS_CONFIG.ADMIN_EMAIL ? '✓' : '✗',
});
