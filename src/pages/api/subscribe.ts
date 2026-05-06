import type { APIRoute } from 'astro';

export const prerender = false;

const respond = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return respond({ ok: false, error: 'Corps de requête invalide.' }, 400);
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return respond({ ok: false, error: 'Adresse e-mail invalide.' }, 400);
  }

  // Accepte prenom/nom ou firstname/lastname
  const prenom = (
    typeof body.prenom    === 'string' ? body.prenom :
    typeof body.firstname === 'string' ? body.firstname : ''
  ).trim();
  const nom = (
    typeof body.nom      === 'string' ? body.nom :
    typeof body.lastname === 'string' ? body.lastname : ''
  ).trim();

  const apiKey    = import.meta.env.BREVO_API_KEY;
  const listIdRaw = import.meta.env.BREVO_LIST_ID;

  if (!apiKey || !listIdRaw) {
    console.error('[subscribe] Variables Brevo manquantes');
    return respond({ ok: false, error: 'Service temporairement indisponible.' }, 503);
  }

  const listId = parseInt(listIdRaw, 10);
  if (isNaN(listId)) {
    console.error('[subscribe] BREVO_LIST_ID invalide:', listIdRaw);
    return respond({ ok: false, error: 'Service temporairement indisponible.' }, 503);
  }

  const payload: Record<string, unknown> = {
    email,
    listIds: [listId],
    updateEnabled: true,
  };

  const attributes: Record<string, string> = {};
  if (prenom) attributes['FIRSTNAME'] = prenom;
  if (nom)    attributes['LASTNAME']  = nom;
  if (Object.keys(attributes).length) payload.attributes = attributes;

  let brevoRes: Response;
  try {
    brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[subscribe] Fetch Brevo échoué:', err);
    return respond({ ok: false, error: 'Service temporairement indisponible.' }, 503);
  }

  // 201 = créé, 204 = mis à jour (updateEnabled)
  if (brevoRes.status === 201 || brevoRes.status === 204) {
    return respond({ ok: true });
  }

  let errBody: { code?: string } = {};
  try { errBody = await brevoRes.json(); } catch { /* ignore */ }

  // Déjà inscrit ou blacklisté → succès silencieux
  if (
    brevoRes.status === 400 &&
    (errBody.code === 'duplicate_parameter' || errBody.code === 'contact_blacklisted')
  ) {
    return respond({ ok: true });
  }

  console.error('[subscribe] Erreur Brevo:', brevoRes.status, errBody);
  return respond(
    { ok: false, error: 'Une erreur est survenue. Réessayez dans quelques instants.' },
    502
  );
};
