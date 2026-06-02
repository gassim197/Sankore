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

async function sendBrevo(
  apiKey: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; status: number }> {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok, status: res.status };
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

  // ── Email 1 : notification interne → contact@sankore.africa ──
  const notifPayload = {
    sender:  { name: 'Sankoré', email: 'contact@sankore.africa' },
    to:      [{ email: 'contact@sankore.africa', name: 'Rédaction Sankoré' }],
    replyTo: { email, name: nom },
    subject: `[Contribution] ${format} — ${titre}`,
    htmlContent,
  };

  let notifResult: { ok: boolean; status: number };
  try {
    notifResult = await sendBrevo(apiKey, notifPayload);
  } catch (err) {
    console.error('[contribute] Fetch Brevo (notif) échoué:', err);
    return respond({ ok: false, error: 'Service temporairement indisponible.' }, 503);
  }

  if (!notifResult.ok) {
    console.error('[contribute] Erreur Brevo (notif):', notifResult.status);
    return respond(
      { ok: false, error: 'Une erreur est survenue. Réessayez dans quelques instants.' },
      502,
    );
  }

  // ── Email 2 : confirmation au candidat (best-effort) ─────────
  const prenom = nom.split(' ')[0];

  const confirmHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Sankoré — votre candidature est bien arrivée</title>
</head>
<body style="margin:0;padding:0;background:#EDE3D2;font-family:Arial,Helvetica,sans-serif;">

  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#EDE3D2;">
    Merci pour votre confiance. Je reviens vers vous d'ici 3 jours ouvrés.&#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EDE3D2;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#F4EDE0;">

          <!-- Barre supérieure terracotta -->
          <tr>
            <td style="height:3px;background:#C4502E;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>
          </tr>

          <!-- En-tête -->
          <tr>
            <td style="padding:36px 40px 24px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:400;color:#1B1F2A;letter-spacing:-0.02em;">Sankoré</p>
              <p style="margin:4px 0 0;font-size:11px;color:#8A8275;letter-spacing:0.15em;text-transform:uppercase;">L'IA au travail, en Afrique</p>
            </td>
          </tr>

          <!-- Séparateur -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:#EDE3D2;"></div>
            </td>
          </tr>

          <!-- Corps -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#1B1F2A;">
                Bonjour ${escapeHtml(prenom)},
              </p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.75;color:#4A5165;">
                Votre candidature pour contribuer à Sankoré est bien arrivée dans ma boîte. Merci pour le temps que vous avez pris pour pitcher votre idée — c'est exactement ce qui rend ce projet possible.
              </p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.75;color:#4A5165;">
                Je vais lire votre proposition attentivement dans les prochains jours et reviendrai vers vous sous 3 jours ouvrés, soit pour fixer un appel de cadrage de 30 minutes si l'angle correspond à notre ligne éditoriale, soit pour échanger davantage si je souhaite préciser quelques points avec vous avant de décider.
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.75;color:#4A5165;">
                En attendant, si vous ne l'avez pas encore fait, vous pouvez parcourir les huit premiers articles publiés sur <a href="https://www.sankore.africa" style="color:#C4502E;text-decoration:none;">sankore.africa</a> — ça vous donnera une idée plus précise du ton, du niveau d'exigence et de la diversité des angles que je cherche à construire pour ce média.
              </p>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding:0 40px 36px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#1B1F2A;">
                À très vite.
              </p>
              <p style="margin:0 0 2px;font-size:15px;color:#1B1F2A;font-weight:700;">Gassimou Cissé</p>
              <p style="margin:0 0 2px;font-size:13px;color:#8A8275;">Fondateur de Sankoré</p>
              <p style="margin:0;font-size:13px;">
                <a href="https://www.sankore.africa" style="color:#C4502E;text-decoration:none;">sankore.africa</a>
              </p>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #EDE3D2;">
              <p style="margin:0;font-size:11px;color:#8A8275;line-height:1.6;">
                Vous recevez cet email car vous avez soumis une candidature de contribution sur
                <a href="https://www.sankore.africa/contribuer" style="color:#8A8275;">sankore.africa/contribuer</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const confirmPayload = {
    sender:  { name: 'Gassimou Cissé', email: 'contact@sankore.africa' },
    to:      [{ email, name: nom }],
    subject: 'Sankoré — votre candidature est bien arrivée',
    htmlContent: confirmHtml,
  };

  try {
    const confirmResult = await sendBrevo(apiKey, confirmPayload);
    if (!confirmResult.ok) {
      console.error('[contribute] Confirmation email échouée (statut):', confirmResult.status);
    }
  } catch (err) {
    console.error('[contribute] Confirmation email échouée (réseau):', err);
  }

  return respond({ ok: true });
};
