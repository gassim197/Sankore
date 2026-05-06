# Sankoré

> *L'IA au travail, en Afrique.*

Site officiel de Sankoré — média indépendant en français dédié à l'intelligence artificielle appliquée et à la transformation digitale en Afrique francophone.

🌐 **Production** : [sankore.africa](https://sankore.africa)

---

## Stack technique

- **Framework** : [Astro 4](https://astro.build) avec MDX
- **Styling** : [Tailwind CSS](https://tailwindcss.com) + variables CSS
- **Contenu** : Markdown/MDX dans `src/content/articles/`
- **Newsletter** : [Brevo](https://www.brevo.com)
- **Hébergement** : [Vercel](https://vercel.com)
- **Domaine** : sankore.africa

## Démarrage rapide

```bash
# Cloner le repo
git clone https://github.com/gassimou-cisse/sankore.git
cd sankore

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec tes clés API

# Lancer le serveur de développement
npm run dev
# → http://localhost:4321
```

## Scripts disponibles

| Commande | Action |
|----------|--------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production dans `./dist/` |
| `npm run preview` | Prévisualiser le build local |
| `npm run check` | Vérifier les types TypeScript |

## Publier un nouvel article

1. Crée un fichier `mon-titre.mdx` dans `src/content/articles/`
2. Remplis le frontmatter (voir `CLAUDE.md` pour le schéma exact)
3. Rédige l'article en MDX
4. Commit et push :

```bash
git add src/content/articles/mon-titre.mdx
git commit -m "feat: ajoute article sur X"
git push
```

Vercel redéploie automatiquement en environ 60 secondes.

## Structure du projet

Voir `CLAUDE.md` à la racine pour la documentation complète de l'architecture, des composants, et des conventions.

## Contribuer

Sankoré accueille des contributions externes. Si tu veux écrire pour le média :

→ [sankore.africa/contribuer](https://sankore.africa/contribuer)

## Licence

Code source : MIT
Contenu éditorial : © Sankoré, tous droits réservés

---

Construit avec ❦ à Conakry par [Gassimou Cissé](https://sankore.africa/a-propos).
