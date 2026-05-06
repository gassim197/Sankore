export const CATEGORY_LABELS: Record<string, string> = {
  'ia-au-travail':           'IA au travail',
  'transformation-digitale': 'Transformation digitale',
  'decryptages':             'Décryptages',
  'outils-methodes':         'Outils & méthodes',
} as const;

export const CATEGORY_HEADINGS: Record<string, { before: string; em: string }> = {
  'ia-au-travail':           { before: 'IA au ',          em: 'travail' },
  'transformation-digitale': { before: 'Transformation ', em: 'digitale' },
  'decryptages':             { before: '',                em: 'Décryptages' },
  'outils-methodes':         { before: 'Outils & ',       em: 'méthodes' },
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'ia-au-travail':
    'Comment les cadres, entrepreneurs et professionnels ouest-africains utilisent concrètement l\'intelligence artificielle dans leur métier au quotidien.',
  'transformation-digitale':
    'Études de cas d\'entreprises, ONG et administrations qui digitalisent. Ce qui marche, ce qui rate, ce que ça coûte vraiment.',
  'decryptages':
    'L\'actualité IA mondiale relue depuis l\'Afrique. Quand l\'AI Act évolue ou qu\'un nouveau modèle sort, quel impact concret ici ?',
  'outils-methodes':
    'Gestion de projet moderne, automatisation, no-code. Comparatifs honnêtes adaptés à nos budgets et contraintes de connectivité.',
};
