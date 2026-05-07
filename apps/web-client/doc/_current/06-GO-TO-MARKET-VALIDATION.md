# 06 - Go-to-market et validation

## Role de ce document

Ce document liste les hypotheses de marche et les tests a mener. Il ne valide pas encore le go-to-market final.

## Positionnement de travail

`[HYPOTHESE]` Make the Change peut se positionner comme une experience d'engagement biodiversite plus concrete, plus ludique et plus credible que les dons abstraits ou les contenus purement educatifs.

`[AUDITE]` P0-7 est documente dans `_audit/BUSINESS-INITIAL-PROMISE-AUDIT.md`.

`[CIBLE_VALIDEE]` Promesse utilisateur initiale recommandee : soutenir des projets biodiversite concrets, comprendre son geste et progresser dans une aventure vivante.

`[HYPOTHESE_FORTE]` Tester d'abord la conversion autour du don pur et du soutien producteur.

## Segments utilisateurs possibles

| Segment | Motivation possible | Statut |
|---|---|---|
| Individus sensibles au vivant | Agir simplement et suivre une progression | `[HYPOTHESE]` |
| Familles / jeunes adultes | Apprendre et agir de facon ludique | `[HYPOTHESE]` |
| Consommateurs responsables | Acheter ou recevoir des produits lies a l'impact | `[HYPOTHESE]` |
| Communautes / collectifs | Progresser ensemble | `[HYPOTHESE]` |
| Entreprises / RSE | Engager des collaborateurs et communiquer avec prudence | `[HYPOTHESE]` + `[A_TESTER]` |

## Hypotheses a tester

### H1 - Les utilisateurs comprennent la proposition

- Statut : `[A_TESTER]`
- Test : interviews, landing page, prototype guide.
- Signal attendu : l'utilisateur explique sans aide la difference entre projet, BioDex, Graines, Credits Impact.

### H2 - Les utilisateurs veulent soutenir un projet producteur

- Statut : `[A_TESTER]`
- Test : flow de soutien avec faux paiement ou paiement test Stripe.
- Signal attendu : intention de paiement, montant acceptable, comprehension des contreparties.

### H3 - Le BioDex augmente la retention

- Statut : `[A_TESTER]`
- Test : comparer experience avec et sans deblocage BioDex.
- Signal attendu : retour volontaire, consultation especes, partage.

### H4 - L'Academy cree de la valeur

- Statut : `[A_TESTER]`
- Test : module court d'apprentissage lie a une action.
- Signal attendu : completion, comprehension, envie d'agir.

### H5 - Les Credits Impact sont compris

- Statut : `[A_TESTER]`
- Test : tests utilisateurs sur wallet, boutique, rewards.
- Signal attendu : comprehension sans confusion avec don, euros ou points gratuits.

### H6 - La boutique ne brouille pas la mission

- Statut : `[A_TESTER]`
- Test : prototypes de catalogue produits vs avantages vs mix.
- Signal attendu : confiance maintenue, intention d'utilisation, absence de perception opportuniste.

### H7 - Les entreprises ont un besoin RSE reel

- Statut : `[A_TESTER]`
- Test : entretiens B2B, maquettes de reporting, offres pilotes.
- Signal attendu : budget, sponsor interne, exigences claires.

## Canaux possibles

- `[HYPOTHESE]` Contenu educatif court autour d'especes et projets.
- `[HYPOTHESE]` Partenariats producteurs.
- `[HYPOTHESE]` Communautes locales ou environnementales.
- `[HYPOTHESE]` B2B/RSE pilote.
- `[HYPOTHESE]` Ambassadeurs ou createurs lies au vivant.

## Metriques a suivre

| Metrique | Pourquoi |
|---|---|
| Activation | L'utilisateur comprend et fait une premiere action. |
| Don initie / don complete | Signal de conversion sur la promesse contribution. |
| Soutien producteur initie / complete | Signal de conversion sur le modele producteur. |
| Montant moyen acceptable | Indique la valeur percue et le niveau de friction. |
| Abandon paiement / abandon comprehension | Distingue friction business et confusion UX. |
| Confiance percue | Verifie que la preuve simple et la prudence d'impact fonctionnent. |
| Completion Academy | L'apprentissage fonctionne. |
| Soutien/don initie | Le modele economique a un signal. |
| Retour J+1/J+7 | L'aventure et le BioDex retiennent. |
| Utilisation Credits Impact | L'economie interne est comprise. |
| Consultation BioDex | Le vivant reste visible. |
| Conversion produit/avantage | La boutique apporte de la valeur. |
| Intention B2B | Le segment RSE est credible. |

## Risques go-to-market

- `[RISQUE]` Trop expliquer peut rendre l'experience lourde.
- `[RISQUE]` Trop gamifier peut reduire la credibilite impact.
- `[RISQUE]` Trop vendre des produits peut brouiller la mission.
- `[RISQUE]` Trop parler RSE trop tot peut creer des exigences disproportionnees.
- `[RISQUE]` Un vocabulaire financier peut bloquer la confiance.

## Test prioritaire recommande

`[A_TESTER]` Tester en premier la comprehension de la separation don / soutien producteur / achat, car elle conditionne le business, l'UX, la confiance et le paiement.

`[A_TESTER]` Tester ensuite la conversion don pur / soutien producteur avant de prioriser boutique, abonnement Ambassadeur ou RSE complete.

## Metriques a suivre en phase prototype / validation

`[A_TESTER]` Metriques business prioritaires :

- Comprehension de la promesse en moins de 30 secondes
- Clic vers don ou soutien
- Taux de conversion don / soutien
- Abandon checkout
- Comprehension Graines vs Credits Impact
- Interet pour BioDex apres contribution
- Retour dans Aventure J1 / J7
- Interet pour les avantages / boutique
- Nombre de partenaires producteurs interesses
- Nombre de prospects RSE interesses
- Signaux d'interet pour Ambassadeur
