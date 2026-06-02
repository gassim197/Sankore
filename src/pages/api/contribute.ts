import type { APIRoute } from 'astro';

export const prerender = false;

const respond = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return respond({ ok: false, error: 'Corps de requête invalide.' }, 400);
  }

  const nom    = typeof body.nom    === 'string' ? body.nom.trim()                  : '';
  const email  = typeof body.email  === 'string' ? body.email.trim().toLowerCase()  : '';
  const role   = typeof body.role   === 'string' ? body.role.trim()                 : '';
  const format = typeof body.format === 'string' ? body.format.trim()               : '';
  const titre  = typeof body.titre  === 'string' ? body.titre.trim()                : '';
  const pitch  = typeof body.pitch  === 'string' ? body.pitch.trim()                : '';
  const ville  = typeof body.ville  === 'string' ? body.ville.trim()                : '';
  const lien   = typeof body.lien   === 'string' ? body.lien.trim()                 : '';

  if (!nom || !email || !role || !format || !titre || !pitch) {
    return respond({ ok: false, error: 'Tous les champs obligatoires sont requis.' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return respond({ ok: false, error: 'Adresse e-mail invalide.' }, 400);
  }

  const apiKey = import.meta.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('[contribute] BREVO_API_KEY manquant');
    return respond({ ok: false, error: 'Service temporairement indisponible.' }, 503);
  }

  const villeRow = ville
    ? `<tr style="border-bottom:1px solid #EDE3D2;">
        <td style="padding:12px 0;font-size:13px;color:#8A8275;width:160px;vertical-align:top;">Ville &amp; pays</td>
        <td style="padding:12px 0;font-size:15px;">${escapeHtml(ville)}</td>
       </tr>`
    : '';

  const lienRow = lien
    ? `<tr style="border-bottom:1px solid #EDE3D2;">
        <td style="padding:12px 0;font-size:13px;color:#8A8275;vertical-align:top;">Lien</td>
        <td style="padding:12px 0;font-size:15px;"><a href="${escapeHtml(lien)}" style="color:#C4502E;">${escapeHtml(lien)}</a></td>
       </tr>`
    : '';

  const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Georgia,serif;color:#1B1F2A;max-width:600px;margin:0 auto;padding:24px;">
  <h2 style="color:#C4502E;font-size:22px;margin-bottom:4px;">Nouvelle candidature contributeur</h2>
  <p style="color:#8A8275;font-size:13px;margin-bottom:32px;">Reçue via sankore.africa/contribuer</p>

  <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:32px;">
    <tr style="border-bottom:1px solid #EDE3D2;">
      <td style="padding:12px 0;font-size:13px;color:#8A8275;width:160px;vertical-align:top;">Nom complet</td>
      <td style="padding:12px 0;font-size:15px;font-weight:600;">${escapeHtml(nom)}</td>
    </tr>
    <tr style="border-bottom:1px solid #EDE3D2;">
      <td style="padding:12px 0;font-size:13px;color:#8A8275;vertical-align:top;">Email</td>
      <td style="padding:12px 0;font-size:15px;"><a href="mailto:${escapeHtml(email)}" style="color:#C4502E;">${escapeHtml(email)}</a></td>
    </tr>
    <tr style="border-bottom:1px solid #EDE3D2;">
      <td style="padding:12px 0;font-size:13px;color:#8A8275;vertical-align:top;">Rôle / Poste</td>
      <td style="padding:12px 0;font-size:15px;">${escapeHtml(role)}</td>
    </tr>
    ${villeRow}
    <tr style="border-bottom:1px solid #EDE3D2;">
      <td style="padding:12px 0;font-size:13px;color:#8A8275;vertical-align:top;">Format</td>
      <td style="padding:12px 0;font-size:15px;"><strong style="color:#C4502E;">${escapeHtml(format)}</strong></td>
    </tr>
    <tr style="border-bottom:1px solid #EDE3D2;">
      <td style="padding:12px 0;font-size:13px;color:#8A8275;vertical-align:top;">Titre provisoire</td>
      <td style="padding:12px 0;font-size:15px;font-style:italic;">${escapeHtml(titre)}</td>
    </tr>
    ${lienRow}
  </table>

  <div style="background:#F4EDE0;padding:24px;border-left:3px solid #C4502E;">
    <p style="font-size:12px;color:#8A8275;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.1em;">Pitch</p>
    <p style="font-size:15px;line-height:1.7;white-space:pre-wrap;margin:0;">${escapeHtml(pitch)}</p>
  </div>

  <hr style="border:none;border-top:1px solid #EDE3D2;margin:32px 0;">
  <p style="font-size:12px;color:#8A8275;">Envoyé depuis sankore.africa</p>
</body>
</html>`;

  const payload = {
    sender:  { name: 'Sankoré', email: 'contact@sankore.africa' },
    to:      [{ email: 'contact@sankore.africa', name: 'Rédaction Sankoré' }],
    replyTo: { email, name: nom },
    subject: `[Contribution] ${format} — ${titre}`,
    htmlContent,
  };

  let brevoRes: Response;
  try {
    brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[contribute] Fetch Brevo échoué:', err);
    return respond({ ok: false, error: 'Service temporairement indisponible.' }, 503);
  }

  if (brevoRes.ok) {
    return respond({ ok: true });
  }

  let errBody: unknown = {};
  try { errBody = await brevoRes.json(); } catch { /* ignore */ }
  console.error('[contribute] Erreur Brevo:', brevoRes.status, errBody);
  return respond(
    { ok: false, error: 'Une erreur est survenue. Réessayez dans quelques instants.' },
    502
  );
};
