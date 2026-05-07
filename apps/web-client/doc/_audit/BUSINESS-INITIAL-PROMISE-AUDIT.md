# BUSINESS-INITIAL-PROMISE-AUDIT.md

**P0-7 — Quelle est la promesse business initiale ?**

---

## 0. Objectif

Clarifier la promesse business de départ de Make the Change sans figer tout le modèle économique futur.

Périmètre : documentation uniquement. Aucun code applicatif, mock, Supabase ou Stripe n'est modifié.

---

## 1. Contexte validé

`[CIBLE_VALIDEE]` Le cœur produit est : soutenir ou donner à des projets réels, comprendre l'impact, progresser, revenir.

`[CIBLE_VALIDEE]` Don pur = Graines, preuve simple, pédagogie, historique, BioDex si lien explicite ; pas de Credits Impact.

`[CIBLE_VALIDEE]` Soutien producteur = Credits Impact, avec éventuellement un bonus symbolique de Graines.

`[CIBLE_VALIDEE]` Achat produit = boutique / avantages ; ne crée pas d'impact direct seul et ne crée pas de Credits Impact.

`[CIBLE_VALIDEE]` Credits Impact = valeur boutique liée au soutien producteur.

`[CIBLE_VALIDEE]` Graines = progression, engagement, Academy, missions, Défis, BioDex enrichi.

`[CIBLE_VALIDEE]` BioDex = attachement et mémoire du vivant ; déblocage par don ou soutien lié à une espèce, pas preuve de sauvetage.

`[CIBLE_VALIDEE]` Academy = apprentissage, non obligatoire, gratuite en base V1.

`[CIBLE_VALIDEE]` Aventure = hub principal qui orchestre.

`[ACTUEL_CODE] [LEGACY] [A_NE_PAS_TOUCHER]` Supabase actuel = legacy V0 à ne pas modifier dans cette phase.

`[ACTUEL_CODE] [SOURCE_PROTOTYPE]` Les mocks sont la source prototype pour les flows actuels.

`[A_TESTER]` Business/RSE reste à tester et ne doit pas être figé artificiellement.

---

## 2. État documentaire actuel

### 2.1 `00-CONTEXTE-COMMUN.md`

`[ACTUEL_CODE]` Le document décrit Make the Change comme une expérience mobile-first pour comprendre, soutenir et suivre des actions concrètes pour le vivant.

`[CIBLE_VALIDEE]` Il affirme que le produit doit distinguer apprentissage, soutien, don, récompense et preuve d'impact.

`[RISQUE]` La boutique et la future logique B2B/RSE sont listées comme modules, mais leur place business initiale n'est pas encore hiérarchisée.

### 2.2 `01-PRODUIT-ET-EXPERIENCE.md`

`[CIBLE_VALIDEE]` Le produit doit aider l'utilisateur à passer de l'intention à l'action : comprendre, choisir une action, soutenir, voir une trace, progresser, revenir.

`[CIBLE_VALIDEE]` Aventure orchestre Academy, Missions, Défis/Challenges, Projets, BioDex et Collectif.

`[RISQUE]` Sans doctrine business, Aventure pourrait trop pousser boutique, récompenses ou RSE au lieu du projet réel.

### 2.3 `03-DECISIONS-VALIDEES.md`

`[CIBLE_VALIDEE]` Plusieurs décisions produit sont validées : séparation don / soutien producteur / achat, Credits Impact, BioDex, Academy, Aventure.

`[A_TESTER]` Modele RSE/B2B, abonnement Ambassadeur et go-to-market restent non valides.

### 2.4 `04-QUESTIONS-OUVERTES.md`

`[ACTUEL_CODE]` P0-7 est encore marqué `[A_TESTER]`, avec plusieurs modèles possibles : dons, soutien producteurs, boutique, abonnement, RSE.

### 2.5 `05-BUSINESS-MODEL.md`

`[CIBLE_VALIDEE]` La séparation don pur / soutien producteur / achat produit est validée.

`[A_TESTER]` Le modèle initial dominant reste à valider entre don, soutien producteur, boutique, abonnement et RSE.

`[RISQUE]` Le document identifie déjà les risques : confusion des modèles, vocabulaire financier, Credits Impact perçus comme monnaie, boutique qui détourne l'attention, RSE qui amplifie le greenwashing.

### 2.6 `06-GO-TO-MARKET-VALIDATION.md`

`[A_TESTER]` Les hypothèses principales à tester : compréhension de la proposition, soutien producteur, rétention BioDex, valeur Academy, compréhension Credits Impact, boutique non confuse, besoin RSE.

`[A_TESTER]` Test prioritaire actuel : compréhension de la séparation don / soutien producteur / achat.

### 2.7 `07-IMPACT-ET-CREDIBILITE.md`

`[CIBLE_VALIDEE]` V1 peut afficher preuves simples, preuves pédagogiques et estimations prudentes.

`[CIBLE_VALIDEE]` Un solde, des `points`, des Credits Impact ou des Graines ne doivent jamais être convertis directement en preuve d'impact.

`[RISQUE]` Toute promesse RSE ou claim externe fort exige une méthode plus robuste.

### 2.8 `09-GAMIFICATION-ECONOMIE.md`

`[CIBLE_VALIDEE]` La gamification doit aider à comprendre et revenir, sans remplacer la preuve d'impact.

`[CIBLE_VALIDEE]` Les récompenses dépendent du type d'action : don pur, soutien producteur, achat produit.

`[RISQUE]` Multiplier les rewards ou convertir Graines/Credits Impact en impact peut brouiller la confiance.

---

## 3. Réponses aux questions P0-7

### 1. Quelle est la promesse business initiale la plus crédible ?

`[HYPOTHESE_FORTE]` Tester d'abord la conversion autour du don pur et du soutien producteur, car ces actions sont directement liées au cœur produit : projet réel, compréhension, trace, progression.

`[A_TESTER]` Le mix exact entre don pur et soutien producteur doit être validé par les signaux de paiement, compréhension et confiance.

### 2. Quelle est la promesse utilisateur initiale ?

`[CIBLE_VALIDEE]` Promesse utilisateur recommandée : soutenir des projets biodiversité concrets, comprendre son geste et progresser dans une aventure vivante.

`[CIBLE_VALIDEE]` L'utilisateur ne doit pas avoir l'impression d'acheter un impact garanti ou une preuve non démontrée.

### 3. Quelle est la promesse producteur / partenaire ?

`[HYPOTHESE_FORTE]` Promesse partenaire : rendre un projet concret plus visible, compréhensible et soutenable, tout en créant un lien pédagogique avec espèces, filières ou territoires.

`[A_TESTER]` Les producteurs/partenaires doivent valider : effort opérationnel acceptable, preuves disponibles, intérêt économique, capacité à fournir récit, photos, données et éventuels produits/avantages.

### 4. Quelle est la promesse entreprise / RSE ?

`[PLUS_TARD]` Promesse RSE potentielle : engager des collaborateurs autour de projets biodiversité avec pédagogie, prudence et reporting exploitable.

`[A_TESTER]` La RSE ne doit pas être vendue comme offre mature avant validation des besoins, preuves, responsabilités, périmètre et méthode.

### 5. Quelle source de revenus tester en premier ?

`[HYPOTHESE_FORTE]` Tester en premier : don pur et soutien producteur.

`[A_DECIDER]` Le modèle de monétisation des dons reste à définir (commission, frais de plateforme, don libre ou autre modèle).

`[A_TESTER]` Mesurer séparément : intention de don, intention de soutien producteur, compréhension des contreparties, confiance, conversion, montant acceptable.

### 6. Quelle source de revenus ne pas prioriser maintenant ?

`[PLUS_TARD]` Ne pas prioriser comme cœur initial : RSE complète, abonnement Ambassadeur, marketplace large, contenus premium, sponsoring avancé.

`[A_TESTER]` Tester si les produits/avantages renforcent la confiance ou donnent l'impression que l'app devient une marketplace opportuniste.

### 7. Quelle place pour la boutique au lancement ?

`[HYPOTHESE_FORTE]` La boutique doit être un prolongement / avantage / récompense, pas le cœur moral du produit.

`[A_TESTER]` Tester si les produits/avantages renforcent la confiance ou donnent l'impression que l'app devient une marketplace opportuniste.

### 8. Quelle place pour l'abonnement Ambassadeur ?

`[HYPOTHESE_FORTE]` Abonnement Ambassadeur = piste intéressante.

`[A_TESTER]` Ne pas le présenter comme lancé.

`[A_TESTER]` Ne pas le mettre au cœur de la promesse initiale tant que la proposition de valeur mensuelle n'est pas claire.

`[CIBLE_VALIDEE]` L'abonnement ne doit pas générer de Credits Impact gratuits chaque mois sans soutien producteur.

### 9. Quelle place pour la RSE ?

`[A_TESTER]` RSE pilote / découverte commerciale avec premiers partenaires : à tester maintenant si des prospects intéressés existent.

`[PLUS_TARD]` RSE complète / reporting avancé : à structurer après validation d'une preuve d'impact crédible et d'un usage clair.

`[RISQUE]` Vendre trop tôt de la RSE peut créer des attentes de reporting, audit, sécurité, conformité et preuves mesurées que le produit V1 n'est pas prêt à porter.

### 10. Quel modèle risque de faire perdre la confiance ?

`[RISQUE]` Les modèles qui font perdre la confiance : investissement financier implicite, rendement, impact garanti, Credits Impact créés sans soutien, boutique présentée comme action d'impact, RSE sans preuve robuste, Graines converties en preuve.

### 11. Quel modèle risque de transformer l'app en simple marketplace ?

`[RISQUE]` Mettre la boutique, les produits ou les avantages au centre de la navigation, de la communication ou des récompenses risque de transformer Make the Change en simple marketplace responsable.

### 12. Quel modèle risque de faire trop ONG sans plaisir d'usage ?

`[RISQUE]` Un modèle uniquement centré sur don, preuve et sérieux peut devenir trop ONG si l'expérience néglige Aventure, BioDex, Academy, Missions, Défis, mascottes, progression et plaisir de retour.

### 13. Quelles métriques business suivre au début ?

`[A_TESTER]` Métriques prioritaires :

- Compréhension de la promesse en test utilisateur
- Activation : première action comprise et initiée
- Don initié et don complété
- Soutien producteur initié et complété
- Montant moyen acceptable
- Abandon paiement / abandon compréhension
- Confiance perçue après explication d'impact
- Retour J+1 / J+7
- Consultation projet après Aventure
- Consultation BioDex après action
- Usage des Graines sans confusion avec preuve
- Usage ou intérêt pour Credits Impact
- Intérêt boutique sans brouillage de mission
- Intention B2B/RSE en entretiens qualifiés

### 14. Quelles hypothèses doivent être validées avant de développer plus loin ?

`[A_TESTER]` Hypothèses prioritaires :

- Les utilisateurs comprennent la différence don pur / soutien producteur / achat produit
- Les utilisateurs veulent soutenir un projet réel dans ce contexte
- Les utilisateurs font confiance aux preuves simples et estimations prudentes
- Les Credits Impact sont compris comme valeur boutique liée au soutien producteur
- Les Graines sont comprises comme progression symbolique, pas preuve d'impact
- Le BioDex augmente l'attachement au vivant et le retour
- Academy renforce la compréhension et l'envie d'agir
- La boutique ne brouille pas la mission
- Les producteurs/partenaires peuvent fournir contenu, preuve et éventuels avantages
- Les entreprises ont un besoin RSE réel et solvable

---

## 4. Doctrine V1 recommandée

### 4.1 Promesse principale B2C

`[CIBLE_VALIDEE]` Soutenir des projets biodiversité concrets, comprendre son geste et progresser dans une aventure vivante.

### 4.2 Promesse business initiale

`[HYPOTHESE_FORTE]` Tester d'abord la conversion autour du don pur et du soutien producteur.

`[CIBLE_VALIDEE]` Ne pas mettre la boutique au centre moral du produit.

`[CIBLE_VALIDEE]` Ne pas transformer les récompenses en preuve d'impact.

### 4.3 Boutique

`[HYPOTHESE_FORTE]` La boutique est utile comme récompense, avantage ou prolongement, mais pas comme cœur produit initial.

`[A_TESTER]` La boutique doit prouver qu'elle augmente la valeur perçue sans brouiller la mission.

### 4.4 RSE

`[A_TESTER]` RSE pilote / découverte commerciale avec premiers partenaires : à tester maintenant si des prospects intéressés existent.

`[PLUS_TARD]` RSE complète / reporting avancé : à structurer après validation d'une preuve d'impact crédible et d'un usage clair.

`[RISQUE]` Vendre trop tôt de la RSE peut créer des attentes de reporting, audit, sécurité, conformité et preuves mesurées que le produit V1 n'est pas prêt à porter.

### 4.5 Abonnement Ambassadeur

`[HYPOTHESE_FORTE]` Abonnement Ambassadeur = piste intéressante.

`[A_TESTER]` Ne pas le présenter comme lancé.

`[A_TESTER]` Ne pas le mettre au cœur de la promesse initiale tant que la proposition de valeur mensuelle n'est pas claire.

`[CIBLE_VALIDEE]` L'abonnement ne doit pas générer de Credits Impact gratuits chaque mois sans soutien producteur.

### 4.6 Projets

`[CIBLE_VALIDEE]` Les projets restent le lieu de l'impact réel : don ou soutien à un projet réel.

`[CIBLE_VALIDEE]` Le projet soutenu doit rester plus important que la récompense reçue.

---

## 5. Sources de revenus

### À tester en premier

`[HYPOTHESE_FORTE]` Don pur.

`[HYPOTHESE_FORTE]` Soutien producteur.

`[A_DECIDER]` Commission, frais ou marge exacts sur ces flux.

`[A_TESTER]` Acceptabilité des montants et wording de paiement.

`[A_DECIDER]` Modele de monetisation des dons (commission, frais de plateforme, don libre ou autre modele).

### À tester en second / en soutien

`[A_TESTER]` Produits / avantages en boutique comme prolongement.

`[A_TESTER]` Partenariats producteurs simples liés à des projets existants.

`[A_TESTER]` RSE pilote / découverte commerciale avec premiers partenaires intéressés.

### À garder pour plus tard

`[PLUS_TARD]` RSE complète / reporting avancé.

`[PLUS_TARD]` Abonnement Ambassadeur comme pilier.

`[PLUS_TARD]` Marketplace large.

`[PLUS_TARD]` Sponsoring avancé.

`[PLUS_TARD]` Contenus premium.

---

## 6. Classification synthétique

### `[CIBLE_VALIDEE]`

- La séparation don pur / soutien producteur / achat produit est validée
- Don pur ne donne pas de Credits Impact
- Soutien producteur peut donner des Credits Impact
- Achat produit ne crée pas d'impact direct seul
- Credits Impact = valeur boutique liée au soutien producteur
- Graines = progression symbolique et engagement
- Les récompenses ne doivent pas remplacer le projet soutenu
- La boutique ne doit pas devenir le cœur moral du produit
- La RSE ne doit pas promettre plus que ce qui est prouvé

### `[HYPOTHESE_FORTE]`

- La promesse business initiale doit tester don pur + soutien producteur
- La promesse utilisateur initiale doit être : soutenir, comprendre, progresser, revenir
- La boutique peut renforcer l'expérience si elle reste avantage/prolongement
- Les producteurs/partenaires peuvent apporter différenciation, récit et crédibilité
- RSE a un fort potentiel business, mais doit commencer par des pilotes
- Abonnement Ambassadeur est une piste intéressante, mais pas au cœur de la promesse initiale

### `[A_TESTER]`

- Conversion don pur
- Conversion soutien producteur
- Montants acceptables
- Compréhension des Credits Impact
- Compréhension des Graines
- Effet BioDex sur rétention
- Effet Academy sur compréhension et envie d'agir
- Boutique comme avantage sans brouillage
- Besoin RSE réel et solvable
- Propension à payer Ambassadeur

### `[A_DECIDER]`

- Commission sur dons
- Marge / commission produits
- Modele economique exact du soutien producteur
- Modele de monetisation des dons (commission, frais de plateforme, don libre ou autre modele)
- Prix et contenu Abonnement Ambassadeur
- Packaging RSE

### `[RISQUE]`

- Marketplace trop centrale
- RSE vendue trop tôt
- Abonnement lancé sans promesse claire
- Claims d'impact trop forts
- Vocabulaire d'investissement
- Credits Impact perçus comme monnaie financière
- Graines perçues comme preuve d'impact
- Récompenses plus importantes que projet soutenu
- Trop ONG sans plaisir d'usage
- Trop jeu sans crédibilité

### `[PLUS_TARD]`

- RSE complète
- Abonnement Ambassadeur comme pilier
- Marketplace large
- Sponsoring avancé
- Contenus premium
- Reporting externe robuste

### `[DEPRECIE]`

- Promesse de rendement, profit, ROI, part, investissement
- Achat produit présenté comme action d'impact principal
- Credits Impact gratuits sans soutien producteur
- Graines achetées directement comme raccourci de progression
- RSE claimée comme preuve sans méthode

---

## 7. Décisions validables maintenant

`[CIBLE_VALIDEE]` La promesse utilisateur initiale recommandée est : soutenir des projets biodiversité concrets, comprendre son geste et progresser dans une aventure vivante.

`[CIBLE_VALIDEE]` Le projet réel doit rester le centre de la promesse, pas la boutique, pas la récompense, pas le reporting RSE.

`[CIBLE_VALIDEE]` La boutique est un prolongement / avantage, pas le cœur moral du produit.

`[CIBLE_VALIDEE]` La RSE n'est pas validée comme offre mature en V1.

`[CIBLE_VALIDEE]` L'abonnement Ambassadeur ne doit pas être présenté comme lancé ou définitif.

`[CIBLE_VALIDEE]` Les récompenses ne doivent jamais devenir plus importantes que le projet soutenu.

---

## 8. Hypothèses à tester

`[A_TESTER]` Priorité 1 : les utilisateurs comprennent et acceptent la promesse don / soutien producteur.

`[A_TESTER]` Priorité 2 : les utilisateurs comprennent la différence Graines / Credits Impact / preuve d'impact.

`[A_TESTER]` Priorité 3 : les projets et le BioDex créent assez d'attachement pour revenir.

`[A_TESTER]` Priorité 4 : la boutique ajoute de la valeur sans brouiller la mission.

`[A_TESTER]` Priorité 5 : les entreprises ont un besoin RSE solvable et compatible avec le niveau de preuve disponible.

---

## 9. Prochaine question P0 recommandée

P0-8 — Quel est le statut de `Artisans Locaux` ?

Raison : le terme reste présent dans les mocks/flows et peut influencer le positionnement producteurs, factions, boutique et collectif.
