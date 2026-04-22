🤝 Audit d'Expérience Utilisateur : Module Collectif & Social

Flux : Dashboard Faction -> Flux d'Activité -> Récompenses Collectives
Statut global : Excellente dynamique sociale (modèle Strava), mais nécessite des ajustements de clarté.

✅ Les "Best Practices" implémentées (À conserver)

Le "Kudos" Écologique : Le bouton "Bravo" est la mécanique de validation sociale parfaite. Ne changez rien.

Le Double Objectif (Écrans 2 & 3) : Avoir un objectif "Projet" (Rucher de Manakara) ET une "Récompense du Mois" (Privilège de l'Essaim) donne une raison collective et une raison égoïste de participer. C'est le design comportemental parfait.

Mise en avant du Leader : La notification dorée "Passe en tête avec 45%" dans le flux dynamise la compétition saine.

🚧 Les Optimisations Critiques (À implémenter)

1. Ajout des Labels de Faction (Écran 3)

Problème : L'utilisateur ne peut pas associer facilement une mascotte au nom de sa faction s'il est nouveau.

Solution UI : Sous chaque bulle de pourcentage (35%, 45%, 20%), ajoutez le nom textuel de la faction correspondante ("Terres & Forêts", "Vie Sauvage", "Artisans Locaux") en typographie secondaire (text-xs text-gray-400).

2. Filtre du Flux d'Activité (Écrans 1 & 3)

Problème : Le flux "Impact Global" risque de devenir saturé et de perdre son intérêt émotionnel.

Solution UX : Ajouter un filtre / sélecteur au-dessus de la liste :

[ Ma Faction ] (Actif par défaut - Affiche les actions des membres de la même équipe).

[ Global ] (Affiche tout le monde).

3. Nettoyage Typographique / Encodage (CRITIQUE)

Problème : Absence systématique d'accents sur les notifications générées par le système (complete, defi, tete, debloque).

Action Technique : Vérifier l'encodage des chaînes de caractères envoyées par le backend ou les fichiers de traduction (i18n) du frontend.

4. Hiérarchie Visuelle de l'Écran de Récompense (Écran 2)

Ajustement Mineur : L'icône de la petite couronne / cadeau (en haut à droite de la jauge sur l'écran 3) ouvre la modale de l'écran 2. C'est bien pensé.

Suggestion : Sur l'écran 2, le bouton "Compris, let's go ! 🌱" est bien, mais il pourrait être plus "ferme" pour refermer la modale, ex: "Retourner au Collectif" ou simplement un grand bouton "Super !". (C'est un détail, le wording actuel reste acceptable pour la gamification).