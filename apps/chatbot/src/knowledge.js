export const PHONE = '809-636-3656 | 829-263-4143';
// Dominio del formulario. El sufijo ya NO es la cuenta personal:
// requiere cambiar el subdomain workers.dev a "unidolor" en el dashboard de Cloudflare:
//   Workers & Pages → "Your subdomain" → Change → unidolor
//   (magic link: https://dash.cloudflare.com/?to=/:account/workers/subdomain)
// Ej: https://unidolor-bot.unidolor.workers.dev
// Para un dominio propio (recomendado a futuro): registrar .eu.org gratis y activar custom domain (ver wrangler.toml).
export const SITE_URL = 'https://unidolor-bot.unidolor.workers.dev';

export function getUrgentResponse() {
  return 'Entendemos su situación. Vamos a transferir su caso inmediatamente a un asesor para atención prioritaria. En breve nos comunicaremos con usted.\n\nUNIDOLOR\n' + PHONE;
}
