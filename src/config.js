import 'dotenv/config';

const requiredEnv = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.warn(`[NovaCloud-API] Warning: env ${key} is not set.`);
  }
}

export const config = {
  port: process.env.PORT || 4000,
  appOrigin: process.env.APP_ORIGIN || '*',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  queueWebhookUrl: process.env.QUEUE_WEBHOOK_URL || null
};
