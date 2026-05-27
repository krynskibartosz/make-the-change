# Structurer une page panier mobile performante en 2025 et début 2026

## Synthèse opérationnelle

La meilleure page panier mobile en 2025 et jusqu’au 25 mai 2026 n’est ni un mini-checkout, ni une simple liste d’articles. C’est une page de décision courte, très lisible, clairement séparée du checkout, qui permet de vérifier les produits, comprendre le coût réel, corriger sans effort, puis avancer vers le paiement via un CTA unique et évident. En pratique, la structure la plus robuste est la suivante : en-tête simple avec état du panier, message critique éventuel, liste d’articles éditable, bloc clair de livraison / retrait / disponibilité, résumé de commande transparent, CTA principal vers le paiement, réassurance juste sous le CTA, puis seulement ensuite les éléments secondaires comme code promo, recommandations et aides. Cette structure répond directement aux principales causes d’abandon mesurées : coûts additionnels trop élevés, manque de visibilité sur le total final, méfiance, obligation de créer un compte, complexité du checkout, problèmes de retours et erreurs techniques. citeturn24view0turn25view0turn16view0turn19view3turn8view3

Sur mobile, la différence entre une bonne et une mauvaise page panier tient surtout à quatre choses. D’abord, le coût doit être compréhensible très tôt, avec sous-total, réductions, livraison, taxes et total ou estimation claire. Ensuite, l’édition doit être quasi sans friction : quantités via stepper, suppression facile, retour vers la fiche produit, “sauvegarder pour plus tard” visible. Troisièmement, il faut éviter les distractions qui coupent l’élan vers le paiement, notamment les cross-sells agressifs, les champs promo exposés par défaut et les interruptions qui demandent une décision secondaire. Enfin, l’interface doit rester performante, accessible et légalement propre, notamment avec des cibles tactiles correctes, un sticky CTA qui n’obscurcit pas le focus, des messages d’état lisibles par les lecteurs d’écran et, côté Europe, une conformité e-commerce / accessibilité devenue beaucoup plus concrète depuis l’entrée en application de l’European Accessibility Act le 28 juin 2025. citeturn36view0turn14view0turn15view0turn12view0turn27view1turn11view8

## Ce que la recherche dit vraiment

### Les données les plus utiles pour concevoir un panier

Les études les plus actionnables convergent sur un point : le panier et le checkout restent de gros points faibles du e-commerce. Baymard estime le taux moyen documenté d’abandon de panier à 70,22 %. En excluant les utilisateurs “juste en train de regarder”, les causes majeures d’abandon restent très concrètes : 39 % évoquent des coûts additionnels trop élevés, 21 % une livraison trop lente, 19 % un manque de confiance, 19 % l’obligation de créer un compte, 18 % un checkout trop long ou compliqué, 15 % une politique de retours jugée insuffisante, 15 % des erreurs ou crashs, 14 % l’impossibilité de calculer le coût total à l’avance et 10 % l’absence de moyens de paiement suffisants. Autrement dit, la page panier doit avant tout réduire la surprise, la charge mentale et le doute. citeturn8view0turn24view0turn24view1turn24view2turn24view3turn24view4

Le problème n’est pas seulement quantitatif, il est aussi qualitatif. Le benchmark Baymard 2025 indique que 63 % des sites mobiles e-commerce ont encore une UX de checkout “médiocre” ou pire, et seulement 2 % atteignent un niveau “good”. Plus largement, leur benchmark mobile 2025 montre que 81 % des sites mobiles ont une UX “médiocre” ou pire, et aucun n’atteint “good” ou “perfect”. Cela signifie qu’en 2025/2026, suivre les conventions les plus solides n’est pas du tout banal : c’est encore un vrai avantage concurrentiel. citeturn8view1turn23view2

### Ce que le panier doit être, et ce qu’il ne doit pas être

Le panier mobile doit rester une page de décision et d’édition. Nielsen Norman Group rappelle que de nombreux utilisateurs utilisent le panier comme une zone de comparaison, de mémoire externe et de décision finale ; la page doit donc montrer assez de détails produit, permettre de revenir à la fiche produit, ajuster la quantité et supprimer facilement un article. À l’inverse, se contenter d’un mini-panier ou d’un résumé réduit au sein du checkout rend la décision plus difficile et mélange édition et engagement dans le paiement. citeturn16view0turn37view0

Cette distinction entre panier et checkout est encore plus importante sur mobile. Baymard recommande explicitement que le panier montre le coût complet ou au moins une estimation claire incluant livraison, taxes et frais, avant l’entrée dans le checkout. Stripe décrit pareillement l’étape “cart review” comme l’endroit où l’utilisateur doit voir les articles, quantités, prix, réductions et taxes estimées, avec la possibilité d’ajuster la quantité ou de supprimer des lignes. En clair : le panier n’est pas l’endroit où l’on demande des données personnelles ; c’est l’endroit où l’on sécurise la décision. citeturn25view0turn8view3

### Ce qui devient obsolète ou risqué en 2025 et 2026

Plusieurs patterns restent courants mais sont devenus risqués. Le champ code promo affiché ouvert par défaut est l’exemple le plus net : Baymard observe qu’il pousse une partie des utilisateurs à s’arrêter ou à quitter le site pour chercher un coupon, et recommande de le masquer derrière un lien, voire d’appliquer automatiquement les promotions éligibles. Les error messages génériques sont également un risque fort : Baymard montre que 98 % des sites n’utilisent pas d’erreurs adaptatives, alors que des messages vagues empêchent certains utilisateurs de finaliser la commande. Enfin, les cross-sells qui interrompent activement la progression sont perçus comme agressifs ; Baymard note par exemple une frustration extrême chez 66 % des utilisateurs confrontés à une étape dédiée de cross-sell chez Amazon. citeturn14view0turn14view3turn31view0turn15view0

Autres patterns à éviter ou à requalifier : les quantités gérées par menu déroulant ou champ texte avec bouton “Mettre à jour”, les mentions de “shipping speed” sans date de livraison compréhensible, les options de retrait ou de livraison alternatives visibles seulement avant le checkout, et le guest checkout relégué en secondaire. Tous augmentent la friction ou créent des hypothèses erronées. citeturn36view0turn19view1turn34view0turn11view0

## Architecture recommandée de la page panier mobile

### L’ordre d’affichage recommandé

L’ordre le plus solide aujourd’hui est le suivant. D’abord, un header très simple : retour, titre “Panier”, compteur d’articles, sans navigation parasite. Ensuite, un bandeau d’état seulement s’il y a une information importante : rupture partielle, prix modifié, livraison indisponible, seuil de livraison gratuite proche. Puis vient la liste des articles, car c’est encore le centre de la décision. Après la liste, un bloc compact mais visible pour livraison / retrait / disponibilité. Ensuite, le résumé de commande avec lignes de prix, puis le CTA principal vers le paiement. Sous ce CTA, la réassurance utile et concise. Seulement après cela : promo / avoirs / crédits, FAQ courte, recommandations éventuelles. Ce placement sert à préserver la compréhension avant d’introduire des actions secondaires. citeturn16view0turn25view0turn19view3turn34view0

Dans cette architecture, certaines informations doivent rester visibles sans être repliées : nom des produits, variantes sélectionnées, quantité, prix de ligne, disponibilité, mode de livraison si critique, sous-total, réductions, livraison, taxes si connues, total / estimation, CTA principal, et tout message bloquant. À l’inverse, les éléments qui peuvent être secondaires ou repliés sont les codes promo, l’aide détaillée, les politiques longues, les cross-sells et les aides contextuelles moins critiques. Sur mobile, NN/g recommande en général les accordéons plutôt que les tabs pour organiser plusieurs petits contenus, car les accordéons tolèrent mieux le manque d’espace et des libellés plus longs. citeturn25view0turn8view10

### Le wireframe textuel recommandé

Le wireframe ci-dessous synthétise le pattern le plus convaincant au vu des études. Il ne s’agit pas d’une vérité absolue, mais d’une base de très haute probabilité de performance.

```text
[Header]
← Retour     Panier (3)

[Message critique si nécessaire]
“1 article ne peut plus être livré avant vendredi”
ou
“Plus que 2 unités disponibles pour cet article”

[Liste d’articles]
[Image]
[Titre produit]
[Variante : Vert olive / 500 ml]
[Livraison : chez vous ven. 31 mai] [Retrait : indisponible]
[Stepper quantité  -  1  + ]   [Supprimer]   [Sauvegarder pour plus tard]
[Prix ligne : 24,90 €]

[Image]
[Titre produit]
[Variante : Taille M]
[En stock]
[Stepper quantité  -  2  + ]
[Prix unitaire : 19,00 €]  [Prix ligne : 38,00 €]

[Bloc livraison / retrait]
“Livraison standard estimée : 4,90 €”
“Plus que 7,10 € pour la livraison offerte”
ou
“Retrait gratuit en boutique dès aujourd’hui”

[Code promo / avoir / crédit]
“Ajouter un code promo ou un avoir”
“Vous avez 12,00 € d’avoir disponible”

[Résumé de commande]
Sous-total                  62,90 €
Réduction                   -10,00 €
Livraison estimée            4,90 €
Taxes estimées               0,00 € / ou “calculées à l’étape suivante”
Total estimé                57,80 €

[CTA principal]
Continuer vers le paiement

[Sticky bottom bar si panier long]
57,80 €   [Continuer]

[Réassurance]
“Paiement sécurisé”
“Retours sous 14 jours”
“Service client : réponse sous 24 h”

[Recommandations éventuelles]
“Souvent ajouté avec…”
```

Ce wireframe reflète les recommandations convergentes suivantes : donner une vue complète du panier, permettre l’édition immédiate, afficher tôt la composition du coût, laisser la décision principale dominante, et reléguer les éléments secondaires sous la ligne de décision. citeturn16view0turn25view0turn36view0turn19view3turn8view3

### Ce qui doit apparaître au premier écran

Par inférence à partir des travaux sur la clarté des coûts, la découverte du résumé sur mobile et la fonction décisionnelle du panier, le premier écran mobile doit idéalement montrer cinq choses : l’état du panier, au moins le premier article ou un résumé de la liste, le coût principal, tout problème bloquant, et le CTA principal. Si la livraison ou les taxes ne sont pas encore finales, il faut l’indiquer explicitement au-dessus du CTA, avec un libellé du type “Livraison et taxes estimées” ou “Calcul final après adresse”. Sur très petits écrans, je privilégierais le couple coût + CTA plutôt que d’essayer de faire entrer trop de détails promotionnels. citeturn19view3turn25view0turn24view2turn16view0

En revanche, ce qui ne mérite pas d’être above the fold sur mobile, sauf cas très particuliers, ce sont les recommandations, les badges de confiance redondants, les bannières marketing, les longs textes de politique, et le champ promo ouvert. Ce sont des distracteurs à haute charge cognitive et faible rendement immédiat. citeturn15view0turn14view0turn16view2

## Composants critiques et microdécisions

### Les cartes articles

Une bonne carte article mobile répond à une question simple : “Qu’est-ce que j’achète exactement, dans quelle quantité, à quel coût, avec quelle disponibilité ?” Pour cela, la carte doit montrer une image correcte, le nom du produit, les attributs sélectionnés, un lien de retour à la fiche produit, la quantité éditable, le prix et, si utile, le prix de ligne. NN/g insiste sur la nécessité d’avoir suffisamment de détail, un visuel exploitable et un accès direct aux détails produit. citeturn16view0

La meilleure UI de quantité reste aujourd’hui un stepper “– / quantité / +”, éventuellement combiné à un champ texte pour les paniers où de grandes quantités sont fréquentes. Baymard montre que 61 % des sites utilisent encore un dropdown ou un simple champ texte, alors que les boutons sont plus rapides à comprendre, évitent les erreurs de saisie et permettent la mise à jour immédiate. Les détails d’implémentation comptent beaucoup : mise à jour instantanée du total, possibilité de passer à 0 avec le bouton moins, option “Annuler” après suppression, suffisamment de taille et d’espacement sur mobile. citeturn36view0

Concrètement, les microcopies qui marchent bien sont du type : “Supprimer”, “Sauvegarder pour plus tard”, “Rupture pour cette quantité — quantité ajustée à 2”, “Prix mis à jour depuis votre dernière visite”, “Livraison estimée ven. 31 mai”. Les microcopies floues du type “Modifier”, “Actualiser”, “Valider”, sans contexte, sont moins bonnes. Les erreurs doivent être inline, directement près de la ligne concernée, et non dans une modale ou un toast trop éloigné. citeturn31view0turn16view3turn8view9

### Le résumé de commande

Le résumé de commande doit répondre à trois questions : “Combien coûtera vraiment la commande ?”, “Qu’est-ce qui explique ce montant ?”, et “Que vais-je payer aujourd’hui ?” Baymard recommande de montrer le coût complet ou au moins une estimation claire, incluant livraison, taxes et frais. NN/g souligne aussi que, sur mobile, le résumé doit être placé haut et rester facile à trouver, faute de quoi les utilisateurs découvrent trop tard les frais. citeturn25view0turn19view3

L’ordre le plus clair est généralement : sous-total, réductions, livraison, taxes, frais spécifiques, total, puis, si nécessaire, “montant payé aujourd’hui” et “montant facturé plus tard”. Cette dernière séparation devient essentielle pour les abonnements, les précommandes, les réservations, les dépôts ou les paniers mixtes. C’est ici qu’il faut éviter les mauvaises surprises, pas au dernier écran. Si des montants sont encore inconnus, la formulation doit l’assumer explicitement. Par exemple : “Taxes calculées après adresse”, “Livraison estimée pour Bruxelles, modifiable”, ou “Montant définitif confirmé à l’étape suivante”. citeturn8view3turn19view3turn19view2

### Le CTA principal et la sticky bar

Sur la page panier, le libellé le plus sûr est “Continuer vers le paiement” ou “Passer au paiement”. “Payer” ou “Commander” devraient rester au dernier bouton d’engagement, au moment où l’obligation de paiement est effectivement assumée. En droit européen, la juridiction de l’UE rappelle que le bouton final doit être clairement libellé pour indiquer l’obligation de payer. citeturn28view0

Un sticky CTA bas de page est généralement recommandé quand le panier est long, quand le total descend facilement sous la ligne de flottaison, ou quand plusieurs articles rendent la décision plus coûteuse cognitivement. La meilleure variante mobile est souvent une barre simple avec montant + CTA, par exemple “57,80 € | Continuer”. En revanche, elle devient intrusive si elle masque du contenu utile, s’interpose devant le clavier, recouvre les champs promo / quantité, ou empêche les utilisateurs clavier et lecteurs d’écran d’atteindre les éléments en dessous. WCAG 2.2 introduit précisément un critère “Focus Not Obscured” et cite le cas des sticky footers comme échec possible si le focus est caché. citeturn12view0turn12view1turn19view3

### Code promo, crédits, avantages et réassurance

La recommandation la mieux étayée aujourd’hui est claire : ne pas afficher le champ code promo ouvert par défaut. Baymard montre qu’il peut déclencher une interruption cognitive, voire une sortie du site pour aller chercher un coupon, et recommande de le masquer derrière un lien ; quand c’est possible, les remises applicables devraient être appliquées automatiquement. NN/g recommande également d’afficher les offres dans le corps du panier ou de les appliquer directement, plutôt que de faire travailler l’utilisateur pour les retrouver. citeturn14view0turn14view3turn16view2

Pour des avoirs, points ou crédits internes, la règle UX la plus saine est d’appliquer la même logique que pour un code promo : les afficher seulement s’ils sont pertinents, expliquer clairement ce qu’ils réduisent, et montrer leur effet directement dans le résumé. Il faut toujours distinguer “réduction appliquée”, “solde disponible” et “montant réellement payé aujourd’hui”. Si le mécanisme n’est pas équivalent à de l’argent, ne pas le présenter comme tel. Cette dernière recommandation relève davantage de l’ingénierie de confiance et de la clarté contractuelle que d’une règle universelle ; elle doit être validée par tests de compréhension. citeturn25view0turn8view3

La réassurance doit exister, mais rester ciblée. Les informations qui répondent directement aux causes d’abandon sont les plus utiles : livraison, retours, paiement sécurisé, service client, moyens de paiement, et, le cas échéant, garanties. Baymard note que les politiques de retour et les frais/conditions de livraison pèsent directement sur l’abandon ; le footer reste un chemin de secours utile, mais la version courte et directement actionnable doit rester proche du résumé et du CTA. citeturn24view0turn19view0turn38view0

### Recommandations additionnelles, upsells et erreurs

Les recommandations dans le panier ne sont pas interdites ; elles doivent être pertinentes et non interruptives. Baymard montre qu’elles peuvent aider si elles sont vraiment liées aux produits déjà choisis, mais que les cross-sells injectés de manière agressive, surtout lorsqu’ils demandent une décision avant de poursuivre, dégradent fortement l’expérience. La bonne règle 2025/2026 est donc : recommandations légères sous la zone principale, jamais avant le résumé / CTA, jamais sous forme d’étape obligatoire, et jamais au détriment de la lisibilité du panier. citeturn15view0turn11view5turn8view11

Pour les erreurs et cas limites, la meilleure pratique n’est pas seulement d’informer, mais d’expliquer exactement quoi faire. Les formulations du type “Quelque chose s’est mal passé” sont trop pauvres. Il faut préférer : “Cette quantité n’est plus disponible. Nous l’avons ramenée à 2.”, “Le code promo a expiré”, “La livraison à cette adresse n’est pas disponible”, “Le prix a changé depuis votre dernière visite”. Baymard et NN/g sont alignés ici : erreurs spécifiques, visibles, proches du problème, avec la correction implicite ou explicite. Pour les suppressions, prévoir un undo est fortement recommandé. citeturn31view0turn16view3turn8view9turn36view0

## Performance, accessibilité et cadre légal

### Performance mobile et Core Web Vitals

Une page panier lente ou instable est particulièrement dommageable, car elle intervient après un effort de sélection déjà consenti. Google recommande de viser un LCP sous 2,5 s, un INP sous 200 ms et un CLS sous 0,1. Pour une page panier, les implications sont très concrètes : ne pas lazy-loader l’élément principal du viewport s’il est candidat LCP, donner des dimensions explicites aux miniatures et bannières, garder le DOM modeste, limiter les scripts tiers d’avis / chat / tracking, et éviter les animations qui poussent le contenu. Web.dev souligne aussi que les grandes mises à jour de rendu et les DOM trop lourds nuisent à l’interactivité, tandis que les éléments sans dimensions et les bannières injectées dégradent le CLS. citeturn21view0turn8view5turn22view0turn8view16turn21view2

Pour le panier, j’ajouterais une recommandation stratégique fortement justifiée par les sources performance : rendre la page éligible au back/forward cache. Le retour arrière depuis le checkout vers le panier est un scénario extrêmement fréquent. Web.dev rappelle que le bfcache permet de restaurer instantanément une page depuis l’historique et améliore aussi la stabilité visuelle. Pour une équipe produit, c’est souvent un gain sous-estimé sur les parcours réels. citeturn22view0

### Accessibilité et exigences Europe 2025/2026

Depuis le 28 juin 2025, l’European Accessibility Act s’applique aux services e-commerce dans l’UE. Côté web, cela ne remplace pas WCAG, mais rend beaucoup moins défendable une page panier qui resterait difficile d’accès à cause de targets trop petites, d’un sticky footer qui cache le focus, d’erreurs non annoncées ou d’un processus qui redemande inutilement des infos déjà saisies. La Commission européenne confirme que l’EAA couvre l’e-commerce, et AccessibleEU rappelle sa date d’entrée en application. citeturn27view1turn11view8

Les critères WCAG 2.2 les plus utiles ici sont très concrets. Les cibles tactiles doivent faire au moins 24 x 24 CSS px ou disposer d’un espacement suffisant ; le contraste minimum du texte standard reste 4,5:1 ; un élément qui prend le focus ne doit pas être entièrement caché par un sticky header ou footer ; l’aide doit être placée de façon cohérente ; il ne faut pas demander une deuxième fois des informations déjà fournies dans le même processus ; et l’authentification ne doit pas imposer inutilement des tests cognitifs sans alternative. Pour les statuts type “article supprimé”, “panier mis à jour” ou “code appliqué”, WCAG exige qu’ils puissent être déterminés programmatiquement pour être annoncés par les technologies d’assistance. citeturn13view0turn12view1turn29view0turn29view1turn29view2turn35view1

En pratique, cela veut dire : boutons quantité suffisamment grands ; libellés ou noms accessibles pour les icônes de suppression ; messages d’erreur à côté du champ ou de l’article concerné ; role/status/lives regions correctement utilisés ; scroll-padding et espace réservé quand un sticky CTA est présent ; navigation clavier complète ; et aucune micro-interface cachée uniquement derrière un swipe. NN/g et W3C convergent sur ces points. citeturn35view0turn35view1turn37view0turn16view3

### Ce que le cadre légal impose au panier et au dernier CTA

Au minimum, le parcours e-commerce européen doit être transparent sur le produit, le prix, les frais de livraison, les coûts de transport et les droits du consommateur. Your Europe rappelle aussi le droit de rétractation de 14 jours pour la plupart des achats à distance, avec exceptions, et la garantie légale minimale de 2 ans pour les biens neufs défectueux achetés auprès d’un professionnel dans l’UE. Le panier ne doit donc pas enfouir ces informations ; il doit au moins les rendre faciles à atteindre, et idéalement les résumer à proximité du résumé et du CTA. citeturn38view0turn19view0

Enfin, le libellé du bouton final d’achat compte juridiquement. La Cour de justice de l’Union européenne rappelle qu’au moment où l’utilisateur place réellement sa commande, le bouton doit indiquer clairement qu’un paiement sera dû. Cela milite pour un panier avec CTA “Continuer vers le paiement”, puis un dernier bouton de checkout juridiquement explicite. citeturn28view0

## Cas particuliers et adaptation à Make the Change

### Paniers mixtes, paniers responsables et paniers à impact

La littérature UX la plus solide porte surtout sur le panier e-commerce classique. Pour les paniers mixtes — produit physique, numérique, abonnement, don, soutien, réservation, contribution — la meilleure approche est une **inférence forte** à partir des règles sur la clarté des coûts, la réduction des surprises et la séparation décision / paiement : grouper les lignes par nature économique et logistique, ne jamais mélanger des montants “payés aujourd’hui” et des engagements futurs sans les distinguer, et séparer visuellement ce qui relève d’un achat, d’un don, d’un abonnement ou d’une contribution. Si une combinaison rend la compréhension du total, des taxes, des retours ou des preuves trop confuse, mieux vaut scinder le parcours en deux paniers / checkouts successifs. citeturn25view0turn8view3turn38view0

Pour un panier “responsable” ou “impact”, il faut distinguer quatre couches : le produit, la preuve, l’estimation et le storytelling. La Commission européenne insiste sur le fait que les allégations environnementales doivent être fiables, comparables et vérifiables ; elle note aussi que 53 % des green claims sont vagues, trompeuses ou infondées et que 40 % n’ont pas de preuve. La FTC rappelle de son côté que les claims environnementaux doivent être vrais, étayés et formulés pour ne pas tromper. En pratique, sur la page panier, cela signifie : ne pas transformer une promesse d’intention en preuve d’impact ; ne pas utiliser une étiquette “impact positif” sans préciser ce qui est mesuré ; et séparer clairement “contribution”, “estimation”, “certification” et “récit de marque”. citeturn33view0turn33view2turn33view3

### Application à Make the Change

En reprenant les règles métier que vous avez posées, la page panier mobile de Make the Change devrait séparer très visiblement les blocs suivants : **achat produit**, **avantage**, **soutien producteur**, **don**, puis éventuellement **trace narrative**. Le résumé ne doit jamais suggérer qu’un achat produit génère des Credits Impact si ce n’est pas le cas. De même, un don pur ne doit pas créer de Credits Impact, et une mission, un défi ou un quiz ne doivent pas apparaître comme des quasi-équivalents financiers. Ici, la bonne pratique UX n’est pas seulement de clarifier pour convertir ; elle sert aussi à éviter une compréhension trompeuse.

Concrètement, je recommanderais des libellés de lignes comme : “Produit”, “Soutien producteur”, “Don”, “Avantage appliqué”, “Credits Impact générés par le soutien producteur : X”, avec un encart d’aide compact du type : “Les Credits Impact proviennent uniquement du soutien producteur. Ils ne sont pas générés par l’achat produit ni par un don pur.” Si vous devez montrer le BioDex ou une trace d’espèce / biodiversité, placez-le sous le résumé comme preuve narrative ou pédagogique, jamais dans le calcul de paiement, et jamais comme équivalent à “espèce sauvée”. Cette structuration suit à la fois vos contraintes métier et les règles de clarté probantes sur les coûts, les preuves et les claims environnementaux. citeturn25view0turn33view0turn33view3

## Check-list, tests prioritaires et limites

### Check-list d’audit

Voici la check-list la plus utile pour auditer une page panier mobile.

**Clarté et conversion.** Le panier a-t-il une page dédiée ? Le coût est-il visible tôt ? Le CTA principal est-il unique et dominant ? Le champ promo est-il replié ? Le guest checkout sera-t-il évident ensuite ? Les recommandations restent-elles secondaires ? citeturn16view0turn25view0turn14view0turn11view0

**Lisibilité mobile.** Les cartes articles sont-elles compactes mais complètes ? Les quantités sont-elles modifiables via stepper ? Les boutons sont-ils assez grands et assez espacés ? Le sticky CTA ne masque-t-il rien ? citeturn36view0turn12view0

**Confiance.** Livraison, retours, garanties, modes de paiement, support et éventuelles limitations sont-ils explicités près du résumé ? Le site évite-t-il les surprises de prix et les claims excessifs ? citeturn24view0turn19view0turn33view0

**Accessibilité.** Contraste, cible 24 px, focus visible, erreurs inline, statuts annoncés, noms accessibles pour les icônes, navigation clavier et absence de swipe-only sont-ils couverts ? citeturn13view0turn12view1turn35view1turn35view0turn37view0

**Performance.** LCP, INP et CLS sont-ils suivis en field ? Les miniatures ont-elles des dimensions fixes ? Les scripts tiers sont-ils limités ? La page est-elle compatible bfcache ? citeturn21view0turn21view2turn22view0turn8view16

### La structure idéale en dix blocs maximum

La version la plus solide tient en dix blocs : header, message critique, liste d’articles, livraison / retrait / disponibilité, avantages / promo repliés, résumé de commande, CTA principal, réassurance, recommandations optionnelles, état panier vide. citeturn25view0turn16view0turn19view3

### Les erreurs les plus graves à éviter

Les cinq erreurs les plus graves sont les suivantes. Afficher des coûts incomplets ou tardifs. Exposer le champ promo par défaut. Utiliser un mini-panier comme substitut à une vraie page panier. Mettre des cross-sells agressifs avant le CTA. Utiliser des messages d’erreur vagues ou des quantités qui exigent un “Update” manuel. citeturn24view0turn14view0turn16view0turn15view0turn31view0turn36view0

### Les éléments à tester en priorité

Les cinq tests les plus utiles sont : présence ou absence d’un sticky CTA ; total estimé visible immédiatement vs résumé plus bas ; promo replié vs exposé ; recommandations sous le CTA vs tout en bas ; et format du résumé “total estimé” vs détail intégral visible d’emblée. J’ajouterais aussi, pour un contexte comme Make the Change, un test de compréhension sur la différence entre achat produit, don et soutien producteur, car c’est moins un sujet de préférence qu’un sujet de clarté. Les recherches donnent une base, mais ces arbitrages restent à valider selon panier moyen, type de catalogue et valeur de commande. citeturn19view3turn14view0turn15view0turn25view0

### Une V1 minimale et une version premium

Une **page panier minimale V1** devrait contenir : liste d’articles claire, quantités via stepper, suppression + sauvegarde pour plus tard, résumé de commande honnête, CTA “Continuer vers le paiement”, et une ligne de réassurance livraison / retours / paiement sécurisé. C’est déjà bien supérieur à beaucoup de mises en œuvre actuelles. citeturn16view0turn36view0turn25view0

Une **page panier premium complète** ajouterait : estimation dynamique livraison / taxes selon localisation, fulfillment mixte clair, application automatique des promos, sticky CTA accessible, état détaillé par article, wallets ou moyens de paiement pertinents ensuite dans le checkout, recommandations très pertinentes non intrusives, conformité WCAG 2.2 poussée, et instrumentation field sur INP / erreurs / suppressions / promo / retours arrière. citeturn19view3turn19view6turn19view4turn21view2turn29view0

### Questions ouvertes et limites

Les meilleures preuves disponibles sont très fortes pour le panier e-commerce classique, mobile checkout, erreurs, coûts, promo codes, quantité, accessibilité et performance. Elles sont plus limitées pour les paniers hybrides mêlant achat, don, soutien, impact narratif, crédits internes ou marketplace complexe. Dans ces cas, les recommandations les plus importantes de ce rapport sont des **inférences solides** à partir de principes bien établis : séparation sémantique des lignes, clarté des montants, transparence des claims, et réduction de la confusion. Ces cas doivent donc impérativement être testés avec des scénarios réels et des tests de compréhension, pas seulement des tests de clic. citeturn25view0turn33view0turn33view3