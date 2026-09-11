/**
 * Logique d'inscription partagée par TOUS les formulaires newsletter du site
 * (bannière lead magnet, encart fin d'article, bandeau newsletter, page /newsletter).
 * Un seul point d'appel vers /api/subscribe pour éviter toute divergence entre
 * implémentations dupliquées.
 */

interface SubscribeFormOptions {
  formId: string;
  successId: string;
  errorId: string;
  idleLabel: string;
}

export function initSubscribeForm({ formId, successId, errorId, idleLabel }: SubscribeFormOptions): void {
  const form    = document.getElementById(formId) as HTMLFormElement | null;
  const success = document.getElementById(successId);
  const errorEl = document.getElementById(errorId);

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd     = new FormData(form);
    const email  = (fd.get('email')     as string ?? '').trim();
    const prenom = (fd.get('firstname') as string ?? '').trim();
    const nom    = (fd.get('lastname')  as string ?? '').trim();
    if (!email) return;

    const btn = form.querySelector('button') as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = 'Envoi…';
    if (errorEl) errorEl.style.display = 'none';

    try {
      const res  = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, prenom, nom }),
      });
      const data = await res.json();

      if (data.ok) {
        form.style.display = 'none';
        if (success) success.style.display = 'block';
      } else {
        btn.disabled = false;
        btn.textContent = idleLabel;
        if (errorEl) {
          errorEl.textContent = data.error ?? 'Une erreur est survenue.';
          errorEl.style.display = 'block';
        }
      }
    } catch {
      btn.disabled = false;
      btn.textContent = idleLabel;
      if (errorEl) {
        errorEl.textContent = 'Connexion impossible. Vérifiez votre réseau.';
        errorEl.style.display = 'block';
      }
    }
  });
}
