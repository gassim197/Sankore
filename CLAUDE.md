# CLAUDE.md — Instructions pour Claude Code

## Contexte du projet

**Sankoré** est un média indépendant en français, dédié à l'IA appliquée et à la transformation digitale en Afrique francophone.

- **Site** : https://sankore.africa
- **Tagline** : *L'IA au travail, en Afrique*
- **Cible** : cadres et entrepreneurs francophones 25-35 ans à Conakry, Dakar, Abidjan
- **Fondateur** : Gassimou Cissé (Conakry, Guinée)
- **Modèle** : média indépendant ouvert aux contributeurs externes

## Stack technique

- **Framework** : Astro 4.x avec intégration MDX
- **Styling** : Tailwind CSS + variables CSS custom pour la palette Sankoré
- **Contenu** : fichiers `.mdx` dans `src/content/articles/` (pas de CMS au démarrage)
- **Newsletter** : Brevo (formulaire embarqué via API)
- **Hébergement** : Vercel (déploiement auto via GitHub)
- **Domaine** : sankore.africa

## Identité visuelle — non négociable

### Palette (variables CSS)

```css
--paper:        #F4EDE0;  /* Fond principal — crème parchemin */
--paper-2:      #FBF7EE;  /* Crème plus clair pour cards */
--paper-3:      #EDE3D2;  /* Crème plus foncé pour zones contrastées */
--ink:          #1B1F2A;  /* Texte principal — encre profonde */
--ink-soft:     #4A5165;  /* Texte secondaire */
--ink-mute:     #8A8275;  /* Texte tertiaire / méta */
--terracotta:   #C4502E;  /* Accent principal */
--terracotta-deep: #A33F22;
--gold:         #B8943B;  /* Accent secondaire — or doux */
--ochre:        #A6896E;  /* Accent neutre */
--line:         rgba(27,31,42,0.12);
--line-soft:    rgba(27,31,42,0.06);
```

### Typographies

- **Display** : `Fraunces` (Google Fonts) — variable, opsz 9-144
  - Utiliser `font-variation-settings: 'opsz' 144` pour les très grands titres
  - Italique pour les emphases dans les titres (mots colorés en terracotta)
- **Body** : `DM Sans` (Google Fonts) — variable, opsz 9-40
- **Jamais** : Inter, Roboto, Arial, système

### Principes de design

1. **Manuscrit moderne** : on évoque l'érudition de Tombouctou sans tomber dans le folklore. Pas de motifs ethniques décoratifs ; oui aux ornements typographiques sobres (`❦`, lettrines, italiques).
2. **Densité maîtrisée** : générer espaces blancs, ne pas remplir.
3. **Couleurs dominantes** : crème + encre + terracotta. L'or est un accent, pas une couleur principale.
4. **Pas de purple gradient, pas de tech-bro aesthetic.**
5. **Mobile-first** : 80% des visiteurs viendront probablement sur mobile (contexte africain). Toutes les pages doivent fonctionner parfaitement à 375px de large.

## Structure du projet

```
sankore/
├── public/
│   ├── favicon.svg
│   ├── og-default.png         # Image Open Graph par défaut
│   └── robots.txt
├── src/
│   ├── content/
│   │   ├── config.ts          # Schémas de contenu Astro
│   │   └── articles/          # Tous les .mdx
│   │       ├── ai-act-afrique-francophone.mdx
│   │       └── ...
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ArticleCard.astro       # Card horizontale avec illustration
│   │   ├── EssentialCard.astro     # Card "Pour commencer"
│   │   ├── NewsletterBand.astro    # Bandeau newsletter sombre
│   │   ├── WriteWithUsBand.astro   # Bandeau "Écrire avec nous"
│   │   ├── ReadingProgress.astro   # Barre de progression article
│   │   ├── ContinueReading.astro   # Encart flottant fin d'article
│   │   ├── Ornament.astro          # Séparateur ❦
│   │   ├── illustrations/          # SVG par catégorie
│   │   │   ├── BarsIllustration.astro
│   │   │   ├── ComparisonIllustration.astro
│   │   │   ├── NetworkIllustration.astro
│   │   │   ├── DonutIllustration.astro
│   │   │   ├── QuoteIllustration.astro
│   │   │   ├── ListIllustration.astro
│   │   │   ├── PenIllustration.astro
│   │   │   └── DefaultIllustration.astro
│   │   └── seo/
│   │       └── SEO.astro            # Métadonnées + OG
│   ├── layouts/
│   │   ├── BaseLayout.astro         # Layout racine avec header/footer
│   │   └── ArticleLayout.astro      # Layout article avec progress bar
│   ├── pages/
│   │   ├── index.astro                          # Accueil
│   │   ├── articles/[slug].astro                # Page article dynamique
│   │   ├── categories/[category].astro          # Page catégorie dynamique
│   │   ├── newsletter.astro
│   │   ├── a-propos.astro
│   │   ├── contribuer.astro
│   │   ├── archive.astro
│   │   └── rss.xml.ts                           # Flux RSS
│   ├── styles/
│   │   └── global.css                           # Variables CSS + reset
│   └── utils/
│       ├── formatDate.ts
│       └── readingTime.ts
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Schéma d'article (frontmatter)

Tout article `.mdx` dans `src/content/articles/` doit suivre ce schéma exact :

```yaml
---
title: "Titre complet de l'article"
dek: "Sous-titre / accroche en italique sur la page article (optionnel)"
excerpt: "Résumé de 2 phrases pour la card et l'OG"
publishedAt: 2026-04-15
updatedAt: 2026-04-15  # optionnel
category: "decryptages"  # one of: ia-au-travail | transformation-digitale | decryptages | outils-methodes
tags: ["ai-act", "réglementation", "europe"]  # optionnel
illustration: "donut"  # one of: bars | comparison | network | donut | quote | list | pen | default
illustrationProps:  # optionnel, paramètres pour personnaliser l'illustration
  number: "60%"
author:
  name: "Gassimou Cissé"
  role: "Rédacteur en chef"
  bio: "Chef de projet et entrepreneur basé à Conakry. Fondateur de Sankoré."
  initial: "G"
featured: false  # true = met en hero de l'accueil
draft: false  # true = ne sera pas publié
---
```

### Catégories — slugs canoniques

- `ia-au-travail` → "IA au travail"
- `transformation-digitale` → "Transformation digitale"
- `decryptages` → "Décryptages"
- `outils-methodes` → "Outils & méthodes"

## Composants — règles d'or

### ArticleCard (carte horizontale avec illustration)

- Grid 2 colonnes : 280px (illustration) / 1fr (contenu)
- Sur mobile (< 720px) : passe en 1 colonne, illustration en haut
- Hover : illustration `translateY(-3px)`, flèche `→` du "Lire l'article" se décale
- Toujours afficher : catégorie (terracotta uppercase) · date · temps de lecture · titre serif · excerpt · lien "Lire l'article"

### Illustrations SVG

- Toutes en `viewBox="0 0 400 300"` (aspect 4:3)
- Fond systématiquement `#EDE3D2` (paper-3)
- Utilisent uniquement les couleurs de la palette
- Pas de texte sauf libellés italiques en `font-style: italic` couleur `#8A8275`
- Mappées au champ `illustration` du frontmatter

### NewsletterBand

- Fond `var(--ink)` (presque noir)
- Barre dégradée terracotta → or en haut (3px)
- Eyebrow "La lettre du dimanche" en or
- Titre serif avec emphase italique en or
- Formulaire connecté à l'API Brevo (variable d'env `BREVO_API_KEY`)

### WriteWithUsBand

- Fond `var(--paper-3)` (crème plus foncé)
- Ligne verticale terracotta sur la gauche
- Disposition 2 colonnes : texte (1.3fr) + illustration plume (1fr)
- À placer sur Accueil, Newsletter, Catégorie, À propos (juste après le bandeau newsletter)

### ReadingProgress

- Barre fixe en haut, 3px, terracotta
- Ne s'affiche que sur les pages article
- Calcule le scroll relatif au contenu de l'article

### ContinueReading

- Encart flottant en bas à droite, fixed
- Apparaît à 70% du scroll de l'article
- Click → navigue vers l'article suivant
- Fermeture avec une croix → ne réapparaît plus dans la session

## SEO — exigences

Chaque page doit fournir :
- `<title>` au format `[titre] — Sankoré` (sauf accueil : `Sankoré — L'IA au travail, en Afrique`)
- `<meta name="description">`
- Open Graph complet : og:title, og:description, og:image, og:url, og:type
- Twitter Card : summary_large_image
- `<link rel="canonical">`
- JSON-LD `Article` pour les pages article
- JSON-LD `WebSite` sur l'accueil avec sitelinks searchbox

Sitemap automatique via `@astrojs/sitemap`.
Flux RSS via `src/pages/rss.xml.ts` couvrant tous les articles non-draft.

## Performance — exigences

- Tous les SVG d'illustration sont **inline** (pas d'images externes)
- Fonts chargées via `<link>` Google Fonts avec `display=swap` et préconnect
- Images Astro : utiliser `<Image>` avec lazy loading et formats modernes (avif/webp)
- Score Lighthouse cible : 95+ sur Performance, 100 sur SEO et Accessibility
- Page article doit être < 100kb sans les fonts (contexte connectivité africaine)

## Conventions de code

- TypeScript strict activé
- Composants Astro privilégiés ; React seulement si interactivité avancée nécessaire
- Pas de bibliothèques externes lourdes (lodash, moment.js)
- Date formatting via `Intl.DateTimeFormat('fr-FR')`
- Reading time : ~200 mots/minute
- Slugs en kebab-case sans accents : "ai-act-afrique-francophone"
- Commits en français, format conventional : `feat: ajoute la page newsletter`

## Variables d'environnement (.env)

```
BREVO_API_KEY=                    # API key Brevo
BREVO_LIST_ID=                    # ID de la liste newsletter
PUBLIC_SITE_URL=https://sankore.africa
PUBLIC_GA_ID=                     # Google Analytics 4 (optionnel)
```

## Déploiement

1. Push sur la branche `main` du repo GitHub `gassimou-cisse/sankore`
2. Vercel détecte automatiquement le push et redéploie
3. Variables d'environnement configurées dans Vercel Dashboard
4. Domaine `sankore.africa` configuré dans Vercel + DNS

## Ce qu'il NE FAUT PAS faire

- ❌ Pas de purple, pas de bleu électrique, pas de néon
- ❌ Pas de Inter, Roboto, Arial, système
- ❌ Pas de motifs ethniques (kenté, tissus, savane, baobab)
- ❌ Pas de stock photos
- ❌ Pas de commentaires (utiliser le bouton LinkedIn à la place)
- ❌ Pas de pop-up agressifs (le ContinueReading est subtil et fermable)
- ❌ Pas de bibliothèques JS lourdes côté client
- ❌ Pas de "Camara" comme nom de l'auteur (c'est Cissé)

## Référence visuelle

Le fichier `wireframes-reference.html` (que je vais te donner séparément) contient l'exact rendu visuel attendu pour les 7 pages. Reproduis fidèlement la mise en page, les espacements, les états de hover, et les illustrations. Utilise-le comme source de vérité visuelle absolue.

---

**Quand tu démarres une session de travail sur ce projet, commence toujours par lire ce fichier en entier.**
