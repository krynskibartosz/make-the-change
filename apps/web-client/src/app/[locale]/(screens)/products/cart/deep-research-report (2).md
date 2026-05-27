# Conception d’un checkout mobile idéal (2025-2026)

## 1. Résumé exécutif

Un **checkout mobile performant** en 2025/2026 doit être **ultra-simplifié, clair et rassurant**. L’utilisateur doit immédiatement comprendre ce qu’il achète, combien il paie (montant total, taxes, frais), comment il recevra le produit, et quel est son moyen de paiement. Les grandes priorités sont de réduire toutes les « peurs » liées au paiement : frais cachés, obligation de créer un compte, perte de contrôle des données, sécurité des paiements. Il faut éviter à tout prix les frictions inutiles (champs superflus, CTA confus, redirections inattendues) et respecter les obligations légales (prix total affiché, boutons explicites, droit de rétractation).

Les erreurs les plus graves à éviter sont : **cacher les coûts** (abandon assuré) ; **forcer la création d’un compte** (≈19 % abandonnent【3†L219-L223】) ; des **champs trop nombreux ou mal adaptés** (les checkouts font en moyenne 11,3 champs【47†L119-L127】, et 18 % des utilisateurs abandonnent à cause de la complexité【47†L119-L127】) ; et **trop de micro-étapes** inutiles (chaque étape supplémentaire augmente le taux d’abandon). Du point de vue légal européen, il est impératif d’**afficher le prix total (taxes et frais inclus) dès le début**【34†L478-L482】 et d’utiliser un CTA final clair (« Payer maintenant » ou « Commander avec obligation de paiement »【34†L478-L482】). 

Les priorités absolues sont donc :

- **Clarté maximale sur le prix et le contenu de la commande** – afficher le récapitulatif en haut et à chaque étape clef pour éviter les mauvaises surprises【10†L204-L213】【34†L478-L482】.
- **Simplicité du formulaire** – utiliser le moins de champs possible, combiner certains champs (« Nom complet »), activer l’autocomplétion, le bon clavier (email, numérique) et masquer les champs optionnels【12†L248-L256】【47†L119-L127】.
- **Guest checkout** – ne pas obliger à se connecter/créer un compte【3†L219-L223】【22†L267-L274】.
- **Moyens de paiement préférés** – proposer dès le début des options rapides (Apple/Google Pay, Bancontact pour BE, Paypal, etc.) et le formulaire CB simple【12†L318-L326】【14†L476-L484】.
- **Réassurance continue** – affichage visible de moyens de paiement sécurisés, badges SSL, politique de retour, suivi de livraison, etc., sans encombrer l’UI【10†L204-L213】【22†L394-L402】.
- **Performance** – page légère, chargement rapide (LCP <3s), boutons réactifs (INP <200ms), stabilité visuelle (CLS<0.1). Une étude de Google montre qu’un retard de 1 s fait baisser la conversion de ~7 %【43†L85-L93】; chaque micro-délai ajoutant du « friction » fait fuir les acheteurs.

En somme, le checkout n’est pas l’espace pour rajouter de l’argumentaire ou du storytelling : le mobile **doit avant tout rassurer et faciliter le paiement**. C’est en suivant ces principes (confirmés par Baymard, Stripe, NNG, Shopify) que l’on maximisera la conversion sans sacrifier la confiance.

## 2. Recherche et données clés

- **Taux d’abandon** : En moyenne, environ **70 %** des acheteurs quittent leur panier avant paiement【3†L140-L149】【16†L138-L141】. Sur mobile, ce taux est souvent encore plus élevé (Statistica, Baymard, etc.), par exemple un rapport Stripe de mai 2025 cite ~79 % d’abandon sur mobile vs 67 % sur desktop【14†L417-L421】. 
- **Principales raisons d’abandon** (Baymard, SaleCycle, Shopify…) :  
  - **Coûts inattendus** (frais de port ou taxes cachés) : 55 % des acheteurs abandonnent pour cette raison【22†L321-L329】. Les utilisateurs veulent voir le total *dès l’ajout au panier* ou au minimum sur la page initiale du checkout【10†L204-L213】【34†L478-L482】.  
  - **Obligation de créer un compte** : Baymard rapporte que **19 %** des acheteurs abandonnent s’ils doivent créer un compte【3†L219-L223】. Shopify confirme qu’environ un quart quittent si on les force à s’inscrire【22†L267-L274】. En pratique, *80+ %* des grands e-commerçants offrent le guest checkout pour prévenir cette fuite【3†L219-L223】【22†L267-L274】.  
  - **Trop de champs ou étapes** : Baymard note que la longueur du formulaire (en champs plutôt qu’en étapes) est un facteur critique【47†L119-L127】. La plupart des sites ont ~11 champs et 5 étapes【47†L119-L127】, et 18 % abandonnent pour complexité du formulaire【47†L119-L127】. NNG souligne que chaque champ supplémentaire multiplie les erreurs et le temps de saisie sur mobile【12†L248-L256】【47†L119-L127】.  
  - **Erreurs techniques ou UX** : champ caché ou message d’erreur vague est un obstacle majeur. Par exemple, Baymard observe que des messages génériques ou incohérents bloquent jusqu’à 10-20 % des acheteurs (ils partent en croyant que tout est cassé)【7†L666-L674】【7†L690-L699】.  
  - **Choix de paiement limité ou non perçu** : les utilisateurs recherchent leurs méthodes (Apple/Google Pay, Bancontact, PayPal…) et peuvent abandonner s’ils ne voient pas la leur. NNG note qu’**offrir trop de choix** peut causer de la confusion, mais ne proposer que la CB « classique » réduit la confiance et la rapidité【12†L318-L326】. Stripe insiste sur l’importance d’au moins proposer un moyen rapide natif.  
  - **Performance lente** : des études (Google, Dynami cl. WIRO) montrent qu’un retard de quelques dixièmes de seconde se paye directement en conversion. Par exemple, un délai de 1 s peut réduire la conversion de ~7 %【43†L85-L93】 (0,1 s = +8,4 % conversion【43†L144-L149】). Si la page met >3 s à charger, 53 % des mobinautes abandonnent avant même de voir l’info【43†L126-L134】.  
  - **Confiance/doute** : absence de badges SSL, de logos de paiement connus ou de politique de retour affichée peut éroder la confiance. Coucher c’est très sensible : l’UX doit renforcer la crédibilité tout au long du flux. Shopify le résume : un bon checkout est « fast and easy » mais aussi **trustworthy**【22†L394-L402】 (badges sécurité, CGV, modes de paiement familiers).

En synthèse, les données montrent que **la transparence (prix total, frais), la simplicité (guest checkout, autofill) et la performance** sont les leviers clé pour limiter l’abandon. Chaque friction en moins augmente le taux de conversion (Baymard estime +35 % possible en optimisant le checkout【3†L146-L149】). 

## 3. Architecture idéale d’un checkout produit mobile

### Formats comparés

- **One-page checkout** (tout sur une longue page) : peut être rapide, mais risque d’être trop bas à dérouler sur mobile. Souvent bien pour un produit unique ou peu d’info, mais il faut un résumé sticky pour éviter d’oublier le contenu. Ex. Stripe Checkout est « full-page » avec sections empilées, ce qui marche si chaque section est compacte【14†L440-L449】.  
- **Multi-step** (étapes séparées) : généralement mieux pour guider l’utilisateur. Chaque écran (réservé à un seul objectif : infos client, livraison, paiement, etc.) reste clair. Les progrès visibles rassurent (NNG recommande l’indicateur d’étape)【14†L494-L502】. Tendance actuelle : 3 à 4 écrans (panier→adresse→paiement→confirmation) est un bon compromis【47†L119-L127】.  
- **Progressif/Ajout au fil de l’eau** (par ex. panier + modal) : moins courant en mobile, car les formulaires longs risquent d’être lourds. On voit parfois les choses en one-page « accordéon », mais c’est à manipuler prudemment (cela peut cacher des étapes).  
- **Résumé sticky** : essentiel pour mobile (voir [12]). Idéalement, dans les dernières étapes le total + bouton doit rester visible. Pas forcément dès le début, mais à l’étape paiement il devrait toujours afficher le total final et le CTA.  
- **Modal/Bottom sheet** : possible pour mini-panier ou sélection rapide, mais pour le checkout complet on préfère écran plein (pour éviter problèmes de scroll interne, etc.).  
- **App native vs. site mobile** : les apps permettent davantage d’accéder à fonctions système (autoFill iOS, camera carte). Mais les principes restent identiques. Une app peut proposer par exemple Apple Pay plus naturellement, ou des transitions animées, mais aussi doit respecter les mêmes règles de formulaire et de performance mobile (éviter WebViews lents, par ex.). Le design « responsive web » et l’app sont similaires en UX. Stripe note que **l’expérience mobile** doit tirer parti des capteurs (GPS, caméra de carte) et des wallets intégrés【14†L425-L433】.

### Structure recommandée (étapes)

1. **Panier / récapitulatif pré-checkout** (écran 1) : affirmer le choix. Doit montrer, de façon claire et succincte : image miniature, nom du produit, variante (poids/couleur), quantité modifiable, prix unitaire. Afficher le sous-total, frais de livraison estimés (ou sélectionner la livraison), crédits/avantages appliqués, taxes. Bouton principal vers étape suivante (ex. “Continuer la commande”). *Ne pas* mettre trop de pub ou upsell ici – on est déjà en parcours achat (pas de promos surprise). On peut proposer « modifier panier » ou « modifier quantité ». Eviter un panier très long – résumé concis (NGN suggère de montrer récap en haut sur mobile【10†L204-L213】). 

2. **Identification / infos client** (écran 2) : email + nom (prénom/nom), téléphone si nécessaire. Le guest checkout est la norme, donc proposer d’abord “Checkout invité”. Éviter de forcer la création de compte. Shopify conseille de permettre l’utilisation d’un login social ou email sans mot de passe comme alternative【22†L267-L274】. Le titre de section peut être “Informations de contact”. On peut ajouter une microcopie rassurante : *Ex. “Votre email nous servira à vous envoyer la confirmation de commande.”* ; si on collecte le téléphone, expliquer qu’il sert à vous prévenir d’un éventuel problème de livraison. S’assurer que chaque champ affiche le clavier adapté (email, numérique). Ne pas demander plus (pas d’info inutile telle que sexe, date de naissance, réseaux sociaux, etc.). On peut proposer la création de compte en fin de commande (Shopify: “créer un compte après” plutôt qu’avant)【22†L267-L274】.

3. **Adresse & livraison** (écran 3) : regrouper au maximum la saisie d’adresse (en un seul formulaire) avec autocomplete (postal→ville), et garde le masque clavier pour le code postal. Champs : pays (avec autocomplete clavier ou tap sur carte du monde), rue + numéro, CP, ville, complément (optionnel). Porter attention au fait que Mobile Safari/Android propose déjà un autofill contact – s’assurer que le form est compatible. *Surchamps facultatifs derrière lien* : l’adresse 2 (étage, bat, code inst) ne doit pas alourdir le formulaire — la cacher sous “Complément d’adresse” cliquable【7†L624-L632】. 

   Au même écran ou juste après, choix du mode de livraison : présenter deux ou trois options (p. ex. “Livraison Standard – 3,90€ (2-4 j)”, “Relais – 2,50€ (3-5 j)”, “Retrait magasin gratuit”). Indiquer clairement le coût et délai estimé pour chacune【10†L204-L213】【34†L478-L482】. Ce choix pourrait être un simple bouton radio group. Il faut éviter de laisser l’utilisateur passer à la payment sans qu’un mode soit choisi. Afficher son élection (par ex. marquer l’option sélectionnée). Si plusieurs partenaires, regrouper. 
   
   **À faire** : Afficher le coût de la livraison dès ce stade, pas plus tard – Baymard rappelle que l’inconvénient suprême est de révéler ces frais à la toute fin【10†L204-L213】. NNG conseille même de montrer un mini-récapitulatif avec les frais en haut de chaque page pour éviter de surprendre l’utilisateur (adidas par ex. loupait cet aspect【10†L204-L213】). 

4. **Paiement** (écran 4) : Prioriser les options rapides mobiles. Présenter en haut (ou par bande horizontale) les boutons Apple Pay/Google Pay/Wallets (SI disponibles) – leur design natif rassure. Ensuite offrir Bancontact (en Belgique souvent préféré), PayPal et enfin le formulaire CB. Si c’est un site, insérer d’abord le paiement express (boutons dédiés) puis “ou payez par carte” suivi du form classique. La Stripe recommande de répéter les moyens de paiement rapides du panier au paiement pour ceux qui auraient raté l’occasion【12†L318-L326】. 

   Pour la **carte bancaire**, ne demander que l’essentiel : numéro, échéance, CVC, nom (et en Belgique NISS si règlement local, mais idéalement le plus tard possible). Utiliser le clavier numérique. Proposer la prise de photo du CB si possible (iOS autofill)【12†L336-L344】. 
   
   *Important pour MTC* : Si l’appli gère une “monnaie locale” (Credits Impact), afficher cela comme une réduction dans l’ordre, pas comme un mode de paiement. Par exemple : “Solde : XXX credits, vous utilisez YYY credits (valeur Z€)”, puis “Reste à payer : XX€”. L’interface doit bien différencier l’argent réel et les crédits (pas de mention “votre achat va générer de l’impact” ou “vous sauvez X [à cause du crédit]”).

5. **Vérification finale** (écran 5) : Avant de déclencher le paiement effectif, afficher un dernier récapitulatif complet (synthèse) : produit(s), quantité, variante, prix unitaire ; mode de livraison sélectionné (+ frais) ; éventuelles réductions/credits ; total TTC. Au bas, les notes légales essentielles : un lien vers CGV, rappel du droit de rétractation (14 j en Europe), politique de retour. Le bouton final doit clairement indiquer l’engagement de payer (formulation type « Payer maintenant » ou « Commander (obligation de paiement) »【34†L478-L482】; en Europe, c’est exigé pour être légalement clair). Ne pas jouer sur le libellé du bouton (éviter « Continuer » ambigu, voir New York Court du CJEU oblige). 

   Ajouter des mentions réassurantes sous le bouton : “Paiement sécurisé”, “Confirmation envoyée par email”, “Livraison sous 2-5 jours”, etc., avec de petits icônes si possible. Veiller à ce qu’aucune information ne disparaisse à ce stade (pas de charges surprises), sinon tout est dit. 

6. **Confirmation** (écran 6) : Message explicite “Commande confirmée !” ou similaire. Afficher immédiatement le numéro de commande et le montant payé, avec indication que l’email de confirmation a été envoyé. Récapitulatif rapide (produit, quantité, adresse, délai de livraison estimé). CTA pour « Voir ma commande » ou « Retour aux avantages » (en lien avec l’app). 

   Pour Make the Change : on peut mentionner l’impact du produit de façon neutre, par ex. “Ce produit est en partenariat avec [projet X]” ou “Merci pour votre soutien à la biodiversité”, mais **sans** dire « votre achat a créé X credits/impact ». MTC insiste : un achat produit **n’« active » ni ne « génère » de nouveaux crédits** ni d’actions climatiques – il s’agit simplement d’un avantage/produit au sein de l’appareil global. On indiquera plutôt « Vos Crédits Impact ont été utilisés pour bénéficier de cet avantage » si des crédits ont été appliqués. En tout cas, garder la tonalité du dernier écran sobre et orientée service (infos de suivi) avant de renvoyer éventuellement vers le storytelling externe.

## 4. Hiérarchie visuelle mobile

- **Header** : Barre simple en haut (“← Panier” ou flèche retour, et titre clair “Checkout” ou étape actuelle). Pas de distractions. Laisser de la marge/padding autour (16-20px).
- **Indicateur d’étape** : Il doit être visible mais discret (par ex. « Panier > Livraison > Paiement > Confirmation »). Ni encombrant, ni absent. Utile pour contextualiser où on en est.
- **Résumé produit** : Dans l’étape Panier et dans le récap final, mettre dans une card ou section avec image à gauche (miniature ~50x50), infos à droite. Texte court : nom, variant, prix, qt. Bouton “Modifier” discret. Faire en sorte que l’utilisateur reconnaisse le produit en 1 sec.
- **Total** : Toujours visible avant le paiement final. Peut être en sticky bottom bar dans les dernières étapes (paiement/vérification), ou en haut selon la place (Stripe Checkout fait en sticky). Ce total doit inclure frais et réductions, et être en gros ou en gras. Idéalement présent sur chaque écran par un bandeau compact en bas fixe, surtout à l’étape 4&5【12†L316-L324】.
- **Frais de livraison** : Montrer clairement sous le total, ou dans le recap intermédiaire. Mentionner la phrase clé “Livraison” avec montant juste en dessous du sous-total. NNG conseille de ne pas enterrer ces frais en bas de page【10†L204-L213】. 
- **Réductions/avantages** : Afficher sur le récap panier et final, avec cloche ou ✓. Si on utilise des crédits/points, illustrer avec l’icône correspondante. Par exemple « ✓ 300 Credits utilisés (–3,00 €) ».
- **Moyens de paiement** : Regrouper par section. Les options express (boutons Apple/Google Pay) en haut, logos bien visibles (couleur). Séparer de la partie carte CB par un titre intermédiaire (« Ou payer par carte »). Les boutons Apple/Google Pay doivent être d’apparence standard (pour confiance). Le formulaire carte doit être en un bloc simple, avec champ-numérique à largeur 100%. 
- **Messages de confiance** : Placer sous les champs sensibles (p. ex. sous numéro de CB “Paiement 100% sécurisé”), ou en note de bas de formulaire. Logos de paiement reconnus (Visa/Mastercard/PayPal/SSL) peuvent figurer en pied de page ou proche du CTA. Cependant ne pas surcharger l’UI de logos. Les micro-textes (ex: “Vos données sont cryptées”, “Siret de la société”, etc.) peuvent aller juste avant le bouton ou en bas de page.
- **CGV / politique de retour** : Mention sous forme de liens clairs avant le bouton final. Par ex. “En validant, vous acceptez nos CGV et notre politique de retour.” Sur mobile, on privilégie une phrase courte avec liens cliquables【34†L478-L482】.
- **Bouton final** : Grand, contrasté (couleur marque si existante), en bas de l’écran, tenant toute la largeur ou presque. Texte explicite (« Commander et payer », « Payer maintenant »). Ne pas le désactiver sans raison, et si erreur or entête, réactiver après message d’erreur clair. Le bouton doit être facilement cliquable (hauteur ≥44px【14†L464-L472】, entouré d’air). On peut le rendre sticky en bas de l’écran à l’étape finale (Stripe le fait).
- **Spacing / densité** : Aérée : chaque champ et ligne doit être confortable à 48-56px de hauteur au moins. Espacer verticalement les sections (16–24px). Texte lisible (taille ~16px ou plus sur mobile). Titre de section un peu plus grand (20–24px). Eviter les colonnes : on est en one-column layout【14†L464-L472】. Cartes simplifiées plutôt que tableaux complexes.

## 5. Formulaires mobiles

**Nombre et ordre des champs** : Minimiser absolumment. Regrouper *Prénom et Nom* en un seul champ « Nom complet » si possible. Regrouper *Adresse* en un seul bloc avec auto-saisie. L’ordre classique (e-mail, nom, adresse, CP, ville, téléphone) est logique. Éviter tout champ non nécessaire à l’achat ou à la livraison (pas de "sexe", "profession", etc.). Les seules exceptions (cases optionnelles) doivent être cachées sous un lien « + d’options » (ex: second adresse, instructions de livraison)【7†L622-L631】.

**Champs obligatoires vs optionnels** : Ne demander en obligatoire que ce qui est légalement nécessaire pour la transaction et la livraison. Par exemple, le téléphone peut être facultatif si on ne l’utilise que pour le suivi. Si un champ optionnel n’est pas rempli, il ne devrait pas bloquer le passage à l’étape suivante. NNG rappelle qu’une erreur de champ facultatif n’a pas lieu d’être bloquante【7†L622-L631】.

**Labels vs placeholders** : Toujours utiliser un label *au-dessus* ou *à côté* de chaque champ – ne compter que sur le placeholder (qui disparaît au focus) rend invisible pour certains. Les labels doivent être descriptifs et précis (ex: “Téléphone mobile (pour le suivi de livraison)”). Le placeholder est un exemple ou hint mais pas un substitut. 

**Autocomplete/autofill** : Activer l’autocomplete pour nom, adresse, email, carte de crédit. Utiliser l’attribut HTML approprié (autofill=“tel”, “email”, “cc-number” etc.). Toujours proposer le nom de l’utilisateur s’il est connecté (pour éviter de ressaisir). NNG insiste sur l’utilité de pré-remplir automatique ville+état via code postal【12†L258-L263】.

**Clavier adapté** : Spécifier le type de clavier : 
- Email → clavier email (avec “@” et “.” faciles)【12†L248-L252】.
- Téléphone, CB, CP → numérique. 
- CB expiration → numérique, ou 4-digit combobox. 
- Code postal → numérique (si applicable).
- Par défaut, nom/ville = texte. 
Ce détail évite beaucoup d’erreurs de frappe.

**Validation inline** : Ne pas attendre la soumission finale pour signaler une erreur ; valider au fur et à mesure (ex. dès qu’on sort du champ). Utiliser un texte clair sous le champ en rouge (non-popup) en cas d’erreur. Exemple : si numéro de CB incomplet, dire « Votre numéro de carte est incomplet »【7†L675-L683】. Eviter les messages génériques (“Erreur code postal”) sans explication. Baymard souligne qu’**« Adaptive Error Messages »** (personnalisés selon l’erreur exacte) réduisent fortement les abandons【7†L675-L683】. Par ex : si l’utilisateur tape une ville non reconnue, suggérer « ville non trouvée, vérifiez l’orthographe ».

**Après erreur** : Si une étape renvoie une erreur serveur (échec paiement, perte de réseau), garder les données saisies. Afficher un message type “Le paiement n’est pas passé, vous n’avez pas été débité. Vérifiez vos informations.” Toujours préciser qu’il n’y a pas eu de débit en cas d’échec【40†L69-L74】. 

**Accessibilité** : Conformément aux WCAG 2.2, les formulaires doivent être totalement utilisables au clavier et par lecteur d’écran :
- *Labels et instructions visibles* (SC 3.3.2) : chaque champ a son label explicite.
- *Identification d’erreur en texte* (SC 3.3.1) : en plus de la couleur, le message décrit l’erreur.
- *Focus visible* (SC 2.4.7) : la bordure/fond du champ en focus doit être contrasté.
- *Contrastes* (SC 1.4.3) : texte/périphéries obligent >4.5:1. 
- *Taille des cibles* ≥44x44 px【27†L47-L50】 pour les boutons/steps.
- *Labels alternatifs* sur icônes (ARIA-label si besoin).
  
**Checklist des champs** (les champs *requis* typiques) :
- **Email** (obligatoire) – clavier email, confirmer par un *doublechamp* si conversion élevée (par sécurité, souvent un champ).  
- **Nom complet** (obligatoire) – si séparé, 2 champs « Prénom » + « Nom » ; sinon champ unique « Nom complet ».  
- **Téléphone** (souvent requis en livraison) – à expliquer *pourquoi* si c’est sensible【7†L713-L722】 (« Votre téléphone sert à confirmer la commande / suivre la livraison »). Sinon optionnel.  
- **Adresse complète** (rue+num, CP, ville, pays) – obligatoire. Regrouper CP-ville (autocomplete).  
- **Complément d’adresse** (balcon, no d’appartement) – optionnel caché.  
- **Facturation différente** – si besoin, possibilité de cocher « utiliser une autre adresse pour la facturation »; sinon ne pas alourdir.  
- **Notes de livraison** – ex. « Instructions pour le livreur » : toujours optionnel, placer en petit textarea.

## 6. Livraison

- **Types** : Liste par ordre de préférence/coût. Exemples : “Livraison standard”, “Point relais”, “Retrait magasin”. Afficher nom, frais, délai. Banalisé : souvent choix radio avec un label descriptif (icône camion/relais).
- **Frais et seuil** : Afficher les frais clairement à côté du mode choisi. Si la livraison est « gratuite » au-dessus d’un certain montant, le rappeler sur la fiche produit ou panier (« +5€ pour la livraison gratuite ») pour éviter la surprise【22†L321-L329】.  
- **Délai estimé** : Inclure un texte « (2-4 jours ouvrables) ». Cela réduit l’incertitude et renforce la confiance.  
- **Suivi** : Mentionner quelque part « suivi disponible par email », ou « vous recevrez un lien de suivi ». Par ex. dans l’email de confirmation.  
- **Rupture de stock** : Si en stock limité, l’avertir dès le panier. Par ex. « Dernier disponible » sur produit/panier. Au checkout, dire en très court “quantité limitée” si applicable (mais idéalement avant achat).  
- **Précommande / produit périssable** : Si utile, alerter (« précommande, expédition sous 2 mois »). Mais une fois le checkout lancé, simplifier (NC si produit en rupture, mieux ne pas mettre à dispo en checkout).  
- **Frais cachés** : NUL PART ne doivent être cachés. EU réclame que le consommateur voit « le prix total final » avant de confirmer (Taxes, livraisons…)【34†L478-L482】. Ne pas présenter « supplément colis non inclus ». 

## 7. Paiement

- **Options express en haut** : Apple Pay, Google Pay, Bancontact (pour BE), PayPal, Shop Pay (Shopify) – selon pertinence géographique. Afficher en boutons officiels. Ça rassure et accélère. Stripe et NNG conseillent de **répéter ces options au bas** aussi pour les retardataires【12†L318-L326】. Ne pas submerger (4-5 max).  
- **Carte bancaire** : Regrouper num+exp+CVV en suite (ou deux lignes num, exp et CVV). On peut préremplir « type de carte » (Visa/Master) via JS. Passer au clavier numérique. Respecter PCI (don’t store full number, etc.).  
- **Un seul tap** : Pré-cocher (ou pas) la CB comme méthode par défaut si on pense que beaucoup paieront par CB après n’avoir pas choisi d’alternative.  
- **3D Secure** : Détecter et afficher à l’avance (« Vous allez être redirigé vers votre banque pour validation 3D Secure »). Afficher un loader ou spinner pendant le process, pour éviter confusion.  
- **Erreurs de paiement** : Afficher le détail (ex : « numéros de carte incorrect » ou « votre banque a refusé cette transaction »). Eviter « Échec de paiement » vague. Toujours préciser « Vous n’avez pas été débité » si rechargement.  
- **Double-clic** : Désactiver le bouton « Payer » dès le clic pour prévenir double envoi, mais afficher « Traitement… » ou loader. 
- **Bancontact (Belgique)** : Très important si marché BE : Stripe et Mollie notent qu’il augmente la confiance locale. On le présente comme un grand bouton « Bancontact ».
- **Autres PSP** : Si on utilise Mollie/Stripe, héberger directement leur UI permet de bénéficier de mises à jour. Ex : Stripe Checkout modal. Toujours informer l’utilisateur qu’il quitte le site (ex. « vous serez redirigé vers PayPal »).
- **Sécurité** : Mention « Paiement 3D Secure » ou logos de sécurité. C’est rassurant, surtout pour les CB.

**Hiérarchie de présentation des moyens** : Sur mobile, plus efficaces haut sont : ApplePay/GooglePay (grand logo), Bancontact, PayPal (icône), puis CB. Les moyens moins populaires (P2P, crypto) s’intègrent comme 2e ligne d’options si vraiment souhaité, sinon les éviter.

## 8. Récapitulatif final

L’écran final (avant validation) est le **bunker de la transparence**. Organiser ainsi :

- **Produit** : le nom, qt, variante, prix unitaire – comme rappel. 
- **Livraison** : mode choisi, frais, adresse (ville + CP suffisent en résumé).
- **Paiement** : moyen sélectionné (icône + nom), montant du dépôt CB vs crédits si mix.
- **Réductions / crédits** : afficher en clair, ex : “Valeur totale du panier : 50€; -10€ promo; Total à payer 40€”.  
- **Taxes** : si applicable, mention “TTC” ou lister la TVA (optionnel si déjà incluse).
- **Total** : final, en gros (ex. “Total : 40,00 €”). Bien visible.
- **CGV & politique de retour** : juste avant le bouton, petite note “Voir nos conditions de vente et retour”. En Europe, on doit informer du droit de rétractation 14j. Un lien “Droit de rétractation” est utile. 
- **Bouton final** : comme déjà dit, « Payer » ou « Commander » avec indication d’obligation. 
- **Confirmation d’action** : Indiquer sous le bouton (ou dans le message) qu’un email de confirmation sera envoyé.

**Points légaux** : Rappel du prix total (TVA incluse)【34†L478-L482】, mention que cliquer signifie payer (directive conso). CGV ou CGU accessibles. Inclusion du délai de rétractation. Aucun champ supplémentaire ni lien parasite. En gros, c’est « l’avant-dernier pas » : on doit être certain que rien de dangereux n’y est caché.

## 9. Écran de confirmation

Après clic, fournir une **confirmation claire et détaillée** :

- Un gros titre « Commande confirmée ! » ou « Merci pour votre achat ».
- Numéro de commande (pour correspondance SAV).
- Récapitulatif sommaire : produit, quantités, montant payé.
- Message que la confirmation a été envoyée à l’email (exemple : “Un email de confirmation vous a été adressé.”).
- Délai de livraison estimé et mode (par ex. “Votre commande sera expédiée sous 48h ; arrivée prévue d’ici le 12/05”).  
- CTA secondaire : “Voir ma commande” (pour les utilisateurs qui ont un espace client ou pour suivi); lien vers « Accueil », ou “Explorer nos partenaires”. 
- Pour Make the Change : on peut ici réintroduire le sens (ex. “Grâce à ce projet partenaire…”), mais sans oublier la transaction. Exemple : “Ce miel est issu du projet [X] – retrouvez plus d’infos sur la page du partenaire.” 
- **Pas de code promo** sur ce page – on est passé à l’acte. Proposer de s’inscrire/partager est possible, mais pas de pop-ups intrusifs. 

Pour éviter la frustration post-achat (achat inattendu, mésentente): confirmer explicitement que l’utilisateur peut se rétracter (14j). Par ex. “Vous bénéficiez du droit de rétractation pendant 14 jours” avec lien. Afficher un numéro de contact/support en bas (« Besoin d’aide ? Contactez-nous »).

## 10. Confiance et réassurance

Éléments augmentant la confiance (à intégrer avec subtilité dans le flux) : 

- **Badges de sécurité** (HTTPS, SSL, logos de paiement) – par ex. petit sigle cadenas + “Paiement sécurisé” près du formulaire ou du bouton. 
- **Logos de moyens de paiement** (Visa, Mastercard, ApplePay, etc.) souvent en bas ou près du CTA (Stripe inclut souvent leur icône).  
- **Politique de retour / étiquette verte** : mention courte « Retour sous 14j garanti ». Peut être un micro-texte sous le CTA.
- **Support client** : numéro de contact/email en bas de page (discret).
- **Avis ou témoignages** : rarement ajouté en checkout, mieux à la fin. Sur mobile, éviter de charger l’écran confirmation de témoignages car ça détourne du but.
- **Vendeur identifié** : Le nom de l’entreprise est déjà sur le site (header, footer). Au checkout, on peut brièvement rappeler « revendeur autorisé de [marque] » ou le numéro de SIRET en bas.
- **Stock clair** : Si stock en temps réel, indiquer « en stock » ou date de dispo. Les gens aiment savoir. Un bip « dernier en stock » peut souligner la légitimité du stock en direct.
- **Pas de frais cachés** : directement affichés en récap.  
- **Transparence sur délais** (voir livraison).

Ces éléments doivent être discrets et non intrusifs : de petites icônes ou notes. L’important est de ne pas réduire la clarté du processus de paiement. Par exemple, plutôt qu’une large banderole « Paiement 100% sécurisé », écrire en microcopy sous le formulaire ou au pied. Les badges lourds et « certificats » pop-up sont à éviter (cela sert plutôt sur la page d’accueil).  

Ce qui est **à éviter** : 
- *Promesses excessives d’impact environnemental*. Par ex. “Votre achat sauve 10 abeilles” sur le checkout (pas prouvé, mêle donation et produit).  
- *Étiquetage trompeur* comme “certifié durable” pendant le paiement.  
- *Abus de social proof* (pop-up d’avis après l’achat), c’est mieux pour la fiche produit.  
- *Upsell intrusif* (Cross-sell) dans le vrai checkout (sauf petit bloc en début panier si prévu, ou à la fin si vraiment pertinent et léger).  

Garder le checkout **sérieux et fiable**, presque « bancaire » dans le style, avec uniquement de légers rappels de confiance.

## 11. Accessibilité

Pour être utilisable par le plus grand nombre (WCAG 2.2) :

- **Labels visibles** : Tous les champs de formulaire ont un label textuel clairement associé (pas seulement placeholder). SC 3.3.2 exige des étiquettes.  
- **Erreurs textuelles** : Lorsqu’une erreur survient, elle est annoncée en clair (texte sous champ) et focus mis dessus. Un simple soulignement rouge sans texte n’est pas suffisant (SC 3.3.1).  
- **Focus visible** : Les éléments focusables (boutons, champs) montrent un contour net (au moins 3:1 par rapport au fond) (SC 2.4.7). Sur iOS/Android, le champ focus a souvent une bordure active.  
- **Contraste** : Texte et boutons doivent respecter un ratio de contraste ≥4.5:1 (niveau AA)【27†L47-L50】. Par exemple, texte blanc sur bouton coloré doit être assez foncé ou en gras.  
- **Taille des cibles** : Tous les boutons et champs interactifs doivent être assez grands (recommandé ≥44x44 px)【14†L464-L472】【27†L47-L50】. Sur mobile, les doigts doivent pouvoir viser confortablement.  
- **Navigation clavier / lecteur d’écran** : Le flux doit être ordonné logiquement (onglets ou menu vocal). Chaque bloc (label+champ) doit être identifié pour un lecteur vocal. Par ex. aria-labelledby.  
- **Instructions et erreurs** : Fournir des instructions ou exemples (ex. format du CP) si nécessaire (SC 3.3.2). Suggestion d’erreur (SC 3.3.3): par exemple si code postal invalide, proposer au-dessus “Ex. 75001” ou “Vérifiez le format”.  
- **Aides contextuelles** : Placer un point d’interrogation contextuel (ex: “?”) à côté d’un champ potentiellement confus (ex: NISS belge).  
- **Zoom et responsivité** : Permettre le zoom (lire 300 % sans perte). Les champs et textes doivent se réorganiser logiquement sur petit écran (WCAG 1.4.10).  
- **Langue et labels** : S’assurer que les attributs lang et role sont corrects (aria-role for error). Le code HTML doit respecter le rôle “form”, “fieldset”, etc., pour les AT.

Checklist accessibilité rapide :
- [ ] Chaque champ a un `label` *adressant* le champ.
- [ ] Texte d’erreur écrit ET visible en couleur et iconographie (non juste couleur).
- [ ] Focus contoured >3:1, aura visible.
- [ ] Taille bouttons ≥44dp (Apple Human Interface).
- [ ] Zones tactiles ≥9mm (soit 44px CSS).
- [ ] Contraste minimum 4.5:1 texte.
- [ ] Instructions/clues aria (aria-describedby) pour context.
- [ ] Aucun texte important uniquement en couleur.
- [ ] Formulaire linéaire : tab-index cohérent, pas de sauts bizarres.
- [ ] Option pour valider/annuler sans ratés.

## 12. Performance mobile

Le checkout doit « sentir » fluide et rapide :

- **Vitesse de chargement** (LCP) : viser <3 s pour le premier affichage (idéal <2 s). Charger en priorité le contenu visible (CSS essentiel, lazy load images). 1s de retard = ~7 % de conversion en moins【43†L85-L93】.  
- **Interactivité** (INP) : Cibler <200 ms. Les boutons doivent répondre instantanément. Eviter scripts lourds qui bloquent le thread lorsque l’utilisateur tape ou clique【40†L69-L74】【40†L169-L178】. Par exemple, désactiver temporairement le boutons “Payer” après clic sans bloquer l’UI complète.  
- **Stabilité visuelle** (CLS) : Éviter tout décalage *pendant l’interaction*. Pas d’images sans dimension, pas de bannière qui apparaît au tout dernier moment. Un CTS (common trigger strategy) : allouer la hauteur du résumé et du CTA dès le début pour qu’ils ne sautent pas quand recharge de page. Les icônes et champs doivent déjà être calibrés (fonts loaded).  
- **Skeleton / loader** : Utiliser un contenu squelettique (un loader « en forme » du formulaire ou résumé) lors de l’attente de réponse ou de redirection paiement. Cela aide l’impression de rapidité.  
- **Pas de reloads intempestifs** : Tout doit se faire en AJAX/local dans la mesure du possible. Rester sur le même écran si une donnée est correcte (ex: un clic “modifier quantité” ne doit pas recharger toute la page).  
- **Réactivité réseau faible** : prévoir un mode offline partiel ou message. Si la connexion est mauvaise au moment du paiement, afficher “connexion faible, rechargement…” plutôt qu’un blocage.  
- **Core Web Vitals** : vérifier LCP, INP, CLS spécifiques au checkout dans Google Search Console / CrUX.  
- **Images optimisées** : utiliser images miniatures très légères. Éviter vidéo/gif.  
- **Fonts** : Utiliser fonts système si possible (roboto / system font) pour pas bloquer le contenu.  
- **Pas de scripts tiers lourds** sur ce flow critique. Chaque poids en JS/QSA risque de ralentir.  
- **Progress indicator** : quand on clique sur “continuer” ou “payer”, afficher un spinner ou barre de progression pour signaler que c’est en cours【14†L506-L514】. Inactiver temporairement les champs pour éviter tap multiple.

Checklist technique mobile :
- [ ] **LCP** < 2.5s sur 3G.  
- [ ] **INP** < 200ms (vérifier via Field Data).  
- [ ] **CLS** < 0.1 (faire test Lighthouse).  
- [ ] Images compressées (WebP).  
- [ ] Scripts JS minifiés/désactivés si non essentiels.  
- [ ] **Interactivité** : actions rapides (setTimeout 0, éviter +Long tasks).  
- [ ] Compression GZIP/brotli.  
- [ ] Réduire le DOM (pas de 1000 divs invisibles).  
- [ ] Utiliser Service Worker cache (si PWA).  
- [ ] Surveillance régulière (Google LCP, Chrome UX). 

## 13. Cas Make the Change / application à impact

Pour une appli « Make the Change », quelques spécificités :

- **Flux séparé** : Les parcours d’**achat produit**, de **don**, et de **soutien producteur** doivent être distincts (principe de la doctrine produit MTC). Ne pas donner l’impression que l’achat physique « fait un don ». Un produit partenaire peut utiliser des crédits, mais c’est juste un moyen de paiement/avantage, pas un don d’impact.
- **Credits Impact** : Ce sont une monnaie d’engagement provenant exclusivement de dons/soutiens. *Un achat produit n’en génère jamais*. Dans le checkout produit, on peut proposer d’**utiliser des Credits** pour réduire le prix (ex : « Vous pouvez utiliser vos Credits pour baisser le prix de [Produit] »), mais on ne doit pas dire que ces crédits « paient » l’action environnementale ou génèrent de l’impact. Formulation recommandée : **« Utilisez vos Credits pour réduire le prix de cette commande »** ou « – XXXX Credits utilisés (valeur Y€) ».  
  > À éviter : « Votre achat génère XXX Credits » ou « Vous venez d’acheter de l’impact » – cela induit en erreur.  
- **Achat vs Don** : Ne pas mélanger dans le même checkout. Si l’utilisateur est dans l’optique « acheter un produit », ne pas lui proposer de don, ni l’inverse (ne pas afficher un don en option sur page produit classique). Chaque chemin doit être clair.  
- **Mots à éviter** (selon guidelines MTC) : « impact », « sauver », « biodiversité », « carbone » directement dans le flow d’achat. On peut parler de projet partenaire ou de label, mais pas faire croire que l’acte d’achat a un effet immédiat mesurable.  
- **Mots recommandés** : « Crédits Impact », « Avantage partenaire », « Don dédié à [x] », « soutien [nom projet] » selon contexte. Par exemple, dire « [Produit] – Utilisez vos Crédits Impact pour ce produit partenaire » est correct.  
- **Post-achat** : La confirmation de commande peut inclure un message d’émotion neutre comme « Merci pour votre achat et votre soutien au projet [X] ». Mais hors screen de confirmation, *l’engagement émotionnel et pédagogique se fait en dehors du checkout*, par ex. après dans l’app ou sur la fiche du projet.
- **Preuve de paiement vs Preuve d’impact** : Distinction cruciale. Le reçu de paiement/facture est une entité administrative (envoyée par MTC). La **trace d’impact** (Crédits Impact utilisés) est un info à part (dans historique d’avantages ou bilans). Ne pas confondre ces deux « bons ». 

Ces règles sont internes à MTC, mais cruciales : garder le checkout produit neutre/transactionnel, et réserver le discours d’impact aux parties éducatives et post-achat. (Si l’utilisateur souhaite faire un don, il aura un autre parcours prévu.)

## 14. Wireframes textuels

Voici plusieurs exemples de wireframes mobiles (blocs listés de haut en bas, en supposant un écran ~360px wide) :

- **Checkout simple (panier ➀, livraison ➁, paiement ➂)**  
  ```
  HEADER: ← Panier  
  Steppers: [ ✓ Panier ] -> Livraison -> Paiement

  [Produits]
   - [Image][Nom produit] x1 (250g) [Prix 5€]
   - Modifier
  Total panier: 5€   (+ frais de livraison)

  [Button] Passer à la livraison
  ```

- **Checkout 4 étapes (ajout d’identification ➁)**  
  ```
  HEADER: ← Panier
  Steppers: Panier -> [ ✓ Vos infos ] -> Livraison -> Paiement

  [Informations]
   - Email: __________
   - Nom complet: __________
   - [   ] Créer un compte après la commande
  [Microtexte] *Confirmation envoyée à votre email.*

  [Button] Continuer vers la livraison
  ```

- **Checkout avec crédits/avantage (après panier)**  
  ```
  [Panier/product summary as above]

  [Crédits]
   Solde : 120 Credits
   - ____ (-50 Crédit utilisés) [+] 
   *Reste à payer 2.50€*

  [Button] Continuer la commande
  ```

- **Checkout produit physique (livraison)**  
  ```
  HEADER: ← Livraison
  Steppers: Panier -> Vos infos -> [ ✓ Livraison ] -> Paiement

  [Adresse]
   - Pays: FR
   - Rue: _______
   - Code Postal: ____   Ville: _____
   - Téléphone: ____  (Optionnel)

  [Livraison]
   ○ Livraison Standard – 5,90€ (3-5 j)
   ● Relais PickUp – 4,00€ (4-6 j)
   ○ Retrait magasin – Gratuit (2 j)

  [Button] Continuer vers le paiement
  ```

- **Checkout avantage immatériel (ex: don ou offre gratuite)**  
  ```
  [Option pour appliquer avantage à l’achat]
  [Voir avantages disponibles ou consommer un bon]

  (Similaire aux crédits, mais conceptuel)
  ```

- **Écran erreur paiement**  
  ```
  HEADER: ← Paiement 
  [Formulaire CB ou digital pay]

  [Message d’erreur]
  "Votre transaction a échoué. Vous n'avez pas été débité(e). Vérifiez vos informations ou choisissez un autre moyen de paiement."

  [Button] Réessayer le paiement
  [Button secondaire] Changer de moyen de paiement
  ```

- **Écran confirmation**  
  ```
  (Icône ✓ ou ✅)
  **Commande confirmée !**

  Numéro de commande : #ABC123
  Produit : Miel 250g – 5€ (Qté 1)
  Total payé : 5,00€
  Email de confirmation envoyé à you@example.com

  Mode de livraison : Colissimo (3-5 j)
  [Button] Voir ma commande
  (Lien) Retour à l'accueil / Retour aux avantages
  ```

Dans ces wireframes, on suppose que :
- Seul le bouton principal est sticky en bas (si nécessaire), avec le total à côté.
- Les sections complexes (option de crédit, infos livraison) sont affichées en blocs déroulés à l’écran (pas d’accordéon caché sauf le champ adresse 2 si lourd).
- Les microcopies clés (explications du téléphone, messages d’erreur) sont brèves mais explicites.

## 15. Checklist finale

Pour auditer un checkout mobile, vérifier point par point :

- **Clarté** : Le total est visible dès le début, et toujours sous les yeux jusqu’au paiement【10†L204-L213】【34†L478-L482】. Les informations de commande (produit, livr.) sont lisibles en un coup d’œil. Le libellé des boutons est compréhensible (“Payer” vs “Continuer”).  
- **Conversion** : Le guest checkout est proposé en évidence【3†L219-L223】, les champs sont peu nombreux【47†L119-L127】, le formulaire utilise autofill/autocomplete【12†L248-L256】. Les moyens de paiement rapides (Apple/Google) sont en haut【12†L318-L326】. Pas de distractions inutiles (promo en plein écran, etc.).  
- **Confiance** : Présence d’indicateurs visuels de sécurité (badges SSL, logos CB), politique de retour/CV clairs. Pas de coûts cachés. Le bouton final renvoie au prix exact payé. Les messages d’erreur sont précis.  
- **Accessibilité** : WCAG 2.2 respecté – labels textuels, messages d’erreur visibles, focus clair, contraste suffisant, cibles ≥44px【27†L47-L50】, navigation simple. Passer chaque champ au scanner d’accessibilité (axe, Wave).  
- **Légal** : Prix total (TTC) affiché, frais de livraison inclus, terme de paiement explicite【34†L478-L482】. Droit de rétractation mentionné. Pas de cases pré-cochées pour options payantes【34†L546-L553】. Le bouton final indique clairement « obligation de payer »【34†L478-L482】.  
- **Performance** : Charger <3s. Tester LCP, INP, CLS (via PageSpeed). Vérifier que tous les champs prennent <200ms à réagir. Éviter les scripts bloquants (pas de pop-up ou d’overlay trop lourd).  
- **Paiement** : Tester le flux de CB, 3D Secure, Apple/Google. Vérifier les erreurs de paiement (CVC, date invalide…) présentent un message adapté. S’assurer que le bouton n’envoie pas deux fois.  
- **Livraison** : Vérifier le calcul du coût, calcul / ville se remplissent via CP. Ne pas oublier le mode de livraison avant de payer (sinon l’utilisateur passe outre).  
- **Erreurs** : Vérifier chaque type d’erreur (mauvais champ, disque plein, timeout) pour la clarté du message. Pas d’erreur blanche.  
- **Confirmation** : L’email est bien envoyé (ne pas oublier!). Le numéro de commande est utile. Les informations clés (prix, produit, délai) sont dans la page de confirmation.

## 16. Recommandation finale

En résumé, **la structure recommandée** est un checkout en 3 à 4 étapes (Panier/Récap, Identification, Livraison, Paiement, Confirmation). Je mettrais :

- **Panier -> Identification -> Livraison -> Paiement -> Confirmation**.

Avec à chaque étape le récapitulatif accessible (barre sticky ou accordéon). Les priorités immédiates sont :

1. **Guest checkout et formulaire minimal** : supprimer toute friction dès l’identification (pas de création de compte forcée, explication du besoin du téléphone)【3†L219-L223】【7†L713-L722】.
2. **Afficher le total/tous frais tôt** : dès le panier on voit l’impact total et on confirme en haut de chaque page【10†L204-L213】【34†L478-L482】.
3. **Activer le maximum d’autofill** (autofill, code postal→ville, photo CB)【12†L248-L256】【12†L336-L344】.
4. **Tester la performance mobile** : garder LCP/INP bas, boutons réactifs, test sur un mobile peu puissant.
5. **Mettre en place un bandeau final récap et CTA** : visible en permanence en bas (total+payer) pour éviter scroll lors de clic.
6. **Choix de paiement adapté au local** : pour la Belgique, prévoir Bancontact en tête【12†L318-L326】.

En A/B testing, on peut tester, par exemple, la longueur du formulaire d’identification (1 champ « Nom complet » vs 2 champs) ou la présence d’un résumé sticky vs pas. Tester aussi le wording du bouton final (ex: “Payer X€” vs “Commander”).

Éviter absolument de forcer de nouveaux éléments en checkout (compte, multi-products inattendus, sorties modales). Ne pas imaginer de traduire l’appartenance à l’impact en bonus checkout (pas de « Vous avez créé des crédits »). 

**Questions pré-design à se poser** :

- Quels moyens de paiement le public utilise-t-il le plus (et sont-ils compatibles mobile) ?
- Quel est le flux de paiement local le plus rapide (ex. ApplePay, Bancontact) ?
- Avons-nous vraiment besoin de *tous* ces champs de formulaire ? Peut-on pré-remplir / combiner ?
- L’utilisateur voit-il clairement le coût total avant de cliquer « Payer » ?
- Chaque CTA et chaque libellé indique-t-il clairement la prochaine action et ses conséquences ?
- En cas d’erreur ou de lenteur, l’utilisateur saura-t-il quoi faire (message clair, option retry) ?
- Les crédits MTC ou autres outils internes sont-ils bien présentés (valeur/paiement) sans confusion avec une pseudo-générescence d’impact ?
- Le parcours responsive a-t-il été testé en mode navigation “une main, une colonne” ?

Adopter cette approche garantira que le checkout mobile est **fluide, convaincant et conforme**. Le design final doit être sobre, fonctionnel et familier – un espace sécurisé de transaction, pas un lieu de persuasion. 

