🛒 Audit d'Expérience Utilisateur : Module Marché / Boutique

Flux : Découverte Produit -> Checkout en Points -> Succès
Statut global : Très performant. Design Premium. Quelques ajustements logiques nécessaires.

✅ Les "Best Practices" implémentées (À conserver)

Filtre hybride + Solde (Écran 1) : Placer le solde de points (✨ 2450) directement dans le composant de filtre ("Tous | Miel") est une optimisation d'espace exceptionnelle pour le mobile.

Preuve Sociale & Rareté (Écran 2) : L'utilisation des tags "Bestseller" et du FOMO ("Plus que 12 exemplaires") maximise le taux de clic.

Fermeture de la Boucle de Gamification : Le tag "Abeille Noire" sur la fiche produit rappelle à l'utilisateur que son impact terrain a débloqué ce produit.

Calculateur de Solde Estimé (Écran 6) : Afficher le solde restant avant validation réduit l'anxiété liée à la dépense des points.

🚧 Les Optimisations Critiques (À implémenter)

1. Remplacement du "Disabled CTA" (Écran 6)

Problème : Le bouton sticky "Adresse manquante" désactivé bloque le flux naturel du pouce.

Solution de routage actif : * Si l'adresse = null, le CTA sticky (vert) doit afficher Ajouter une adresse de livraison. Le clic déclenche le formulaire d'adresse.

Une fois l'adresse saisie, le CTA sticky devient Échanger (550 ✨).

2. Gestion Dynamique de l'État "Solde Insuffisant" (Écran 2)

Problème : L'UI ne prévoit pas visuellement le cas où l'utilisateur n'a pas assez de points (ex: Solde = 100 ✨).

Règle de Gestion UI :

Si Solde >= Prix (Points) : * Bouton Principal = Échanger 550 ✨ (Vert)

Bouton Secondaire/Texte = Ou acheter pour 5,50 €

Si Solde < Prix (Points) : * Bouton Principal = Acheter pour 5,50 € (Vert)

Texte d'incitation (Gamification) = Il vous manque X ✨ pour l'obtenir gratuitement. (Lien vers les défis/projets).

3. Cohérence du Wording de Navigation

Problème mineur : Le titre de la page est "Notre boutique", mais l'onglet de la barre de navigation (Bottom Bar) s'appelle "Marché".

Solution : Uniformiser le lexique. "Marché" fait plus écosystème/jeu, "Boutique" fait plus e-commerce traditionnel. Choisissez un terme et appliquez-le partout pour réduire la charge cognitive. (Recommandation : "Marché" ou "Récompenses" s'aligne mieux avec l'esprit de l'app).

4. Lisibilité de la FAQ / Valeurs Nutritionnelles (Écran 5)

Ajustement UI : Le modal plein écran des valeurs nutritionnelles est propre, mais le bouton "X" (fermer) flotte un peu seul. Assurez-vous qu'un geste de balayage vers le bas (Swipe-to-dismiss) permet de fermer cette vue, car c'est le réflexe natif sur iOS et Android pour les vues superposées.