Audit d'UX/UI
🔍 Audit d'Expérience Utilisateur : Tunnel de Checkout

Module : Catalogue Projets & Paiement (Gradual Engagement)
Statut global : Excellent (Haut potentiel de conversion). Quelques frictions à corriger.

✅ Ce qui fonctionne (À ne surtout pas changer)

Le Gradual Engagement : Le fait de laisser lire le projet en entier avant de demander le paiement/l'inscription est la meilleure stratégie possible.

La Traduction d'Impact (Calculateur Dynamique) : L'écran de choix du montant qui traduit l'argent en impact tangible (X abeilles, Y CO2) et en récompenses (Z points) est un coup de génie cognitif.

Le Sticky CTA : Le bouton d'action fixé en bas de l'écran garantit qu'il n'y a jamais besoin de chercher comment payer.

La Capture d'Inscription par "Loss Aversion" : Demander de créer un compte à la toute fin pour ne pas perdre la récompense durement acquise est la méthode de conversion la plus puissante du marché.

🚧 Les Frictions et Erreurs (À corriger pour la V1)

1. Incohérence des Variables sur l'Écran de Succès (CRITIQUE)

Problème : Sur l'écran final, l'illustration et le titre affichent l'animal "Chouette Effraie", mais le texte de la bannière de rétention (au-dessus du bouton) affiche "Ne perdez pas votre Abeille Noire !".

Solution : S'assurer que les variables (props) passées au composant de succès sont synchronisées. Si animal.name est "La Chouette Effraie", la bannière doit afficher Ne perdez pas votre ${animal.name} !.

2. Le Mystère des Icônes Flottantes (Charge Cognitive)

Problème : Sur les cartes du catalogue, les icônes flottantes (cadenas, cube) n'ont pas de contexte. Les utilisateurs mobiles détestent cliquer sur ce qu'ils ne comprennent pas.

Solution : Soit les supprimer si elles ne sont pas essentielles à cette étape du tunnel, soit ajouter un micro-label (ex: "1 espèce à débloquer" à côté du cadenas).

3. Réassurance de Paiement Manquante (Confiance)

Problème : L'étape de saisie de l'email et de paiement (Écran 8) manque d'un ancrage de sécurité.

Solution : Ajouter une icône de cadenas dans le bouton "Payer" ou inclure les logos des moyens de paiement / la mention "Sécurisé par Stripe" dans un gris très discret sous le bouton.

4. La Clarté de la Connexion (Architecture Tech)

Question UX ouverte : Sur l'écran de succès, on demande uniquement un "Email" pour créer le compte.

Si c'est un Magic Link (envoi d'un lien de connexion par mail, sans mot de passe), le bouton doit plutôt dire "Sauvegarder via Magic Link" ou un texte expliquant qu'un email va être envoyé. S'il s'attend à taper un mot de passe après, l'UX sera hachée.

🔐 Stratégie Post-Paiement & Routage (Nouvelles Recommandations)

5. La Gestion de l'Inscription Post-Paiement

Le dilemme : Faut-il demander un mot de passe dans l'app, ou envoyer un email ?
La recommandation de l'Expert (Standard Next.js / Vercel) : Le Magic Link (Passwordless).

L'utilisateur vient de vivre un pic émotionnel et a fait un effort (payer). Lui demander de créer et confirmer un mot de passe complexe avec majuscule et chiffre va créer une fatigue cognitive immédiate.

Le Flow idéal :

Il tape son email sur l'écran de succès.

Il clique sur "Créer mon compte".

UI State : L'écran affiche un checkmark animé avec le texte : "Vérifiez votre boîte mail ! Un lien magique vous y attend pour sécuriser votre Chouette Effraie."

En arrière-plan : Le backend a déjà créé un compte "fantôme" lié à ce paiement et à cet email. Dès qu'il clique sur le lien dans son mail, il est redirigé vers l'app web, connecté, et le compte est activé.

6. Le Routage : Que doit faire la croix (X) ou le bouton de validation ?

L'action qui suit la fenêtre de succès (modal) dépend entièrement de ce que fait l'utilisateur.

Scénario A : L'utilisateur clique sur la croix (X) sans entrer son email.

Signification : "Je refuse de créer un compte, laissez-moi tranquille."

Redirection UX : La croix doit le renvoyer sur la page du Projet qu'il vient de soutenir. Pourquoi ? C'est le contexte d'où il vient (la modale s'est ouverte par-dessus le projet). S'il ferme la modale, il s'attend à retrouver la page du projet en dessous, idéalement avec la jauge de financement mise à jour grâce à son don. Ne le punissez pas.

Scénario B : L'utilisateur entre son email et valide (Magic Link envoyé) -> Retour depuis l'email.

Signification : "Je m'engage dans l'écosystème et je veux ma récompense."

Redirection UX : Le BioDex (OBLIGATOIRE).

Pourquoi : L'argument de vente pour capturer l'email était "Ne perdez pas votre [Espèce]". La seule résolution psychologique logique est de le faire atterrir sur le BioDex, avec une belle animation (un halo lumineux) autour de l'espèce qu'il vient d'acquérir. L'écran "Mes Contributions", bien qu'excellent, est trop "administratif" (il ressemble à un relevé bancaire) et casse l'émotion post-achat. Gardez l'historique accessible via son Profil, mais ne l'utilisez pas comme page d'atterrissage.
