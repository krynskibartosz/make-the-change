# 04 — Don, soutien producteur et achat : trois gestes distincts

Make the Change distingue trois types de gestes financiers. Les confondre crée de la confusion chez l'utilisateur et des risques légaux ou de crédibilité.

---

## Vue d'ensemble

| Geste | Définition courte | Nom technique cible |
|---|---|---|
| **Don pur** | Contribution à un projet biodiversité sans contrepartie économique directe | `donation` |
| **Soutien producteur** | Contribution à un projet porté par un producteur, sans rendement ni propriété | `producer_support` |
| **Achat produit** | Achat direct d'un produit ou avantage, en euros ou en Credits Impact | `product_purchase` |

---

## Don pur — règles détaillées

### Ce que c'est
Une contribution financière à un projet biodiversité ou environnemental. L'utilisateur donne sans attendre de retour économique.

### Ce que le don pur peut donner à l'utilisateur
- Des Graines (reconnaissance symbolique de l'engagement)
- Une trace simple du geste (historique)
- Une explication pédagogique de l'impact attendu
- Un certificat ou badge symbolique
- Un déblocage d'espèce BioDex **si et seulement si** le projet est explicitement lié à cette espèce

### Ce que le don pur ne doit jamais donner ou promettre
- Des Credits Impact
- Un produit ou avantage boutique
- Un rendement ou retour financier
- Une promesse d'impact non prouvée
- Un vocabulaire d'investissement

### Comment en parler
✅ "Faire un don" — "Donner pour ce projet" — "Contribuer à ce projet" — "Soutenir la biodiversité"

❌ "Investir" — "Financer" — "Obtenir un retour" — "Impact validé sans preuve"

---

## Soutien producteur — règles détaillées

### Ce que c'est
Une contribution financière à un projet porté par un producteur ou un partenaire (rucher, oliveraie, vignoble, filière locale, etc.). Il y a une logique économique liée à une production réelle.

**Ce n'est pas un investissement financier :** pas de rendement, pas de part, pas de propriété, pas de remboursement garanti.

### Ce que le soutien producteur peut donner à l'utilisateur
- Des Credits Impact
- Un petit bonus symbolique de Graines
- Une preuve simple du soutien
- Une explication pédagogique de l'impact attendu
- Un déblocage d'espèce BioDex si le projet est explicitement lié à cette espèce
- Un accès futur à des produits partenaires via Credits Impact

### Ce que le soutien producteur ne doit jamais donner ou promettre
- Un rendement, un profit, une part de propriété
- Un remboursement garanti
- Une confusion avec un don pur
- Un investissement au sens financier

### Comment en parler
✅ "Soutenir ce producteur" — "Soutenir ce rucher" — "Soutenir cette oliveraie" — "Contribuer à ce projet producteur"

❌ "Investir" — "Financement" — "Placement" — "Rendement" — "ROI" — "Acheter une part"

---

## Achat produit — règles détaillées

### Ce que c'est
L'achat direct d'un produit ou avantage partenaire, dans la boutique ou dans les avantages. Peut se faire en euros ou en Credits Impact.

### Ce que l'achat produit donne à l'utilisateur
- Le produit ou l'avantage
- Un historique de commande
- Une reconnaissance symbolique éventuelle

### Ce que l'achat produit ne doit jamais faire
- Être présenté comme l'action d'impact principale
- Créer des Credits Impact
- Débloquer automatiquement une espèce BioDex
- Prétendre "sauver une espèce"

### Comment en parler
✅ "Acheter en euros" — "Utiliser mes Credits Impact" — "Produit partenaire" — "Avantage partenaire"

❌ "Sauver une espèce" — "Créer de l'impact direct" — "Générer des Credits Impact"

---

## Séparation dans les paiements

Les trois gestes doivent utiliser des flux de paiement séparés, avec des métadonnées distinctes (`donation`, `producer_support`, `product_purchase`). Ils ne doivent pas être mélangés dans un même flux ou un même reçu.

`[ACTUEL_CODE]` Le code contient encore du legacy `investment` pour une partie du soutien producteur. Ce legacy ne doit pas être renforcé dans le wording utilisateur et doit être migré progressivement.

Un reçu de paiement confirme une transaction. Il ne constitue pas une preuve d'impact terrain et ne doit pas être présenté comme un reçu fiscal sans validation légale.

---

## Règle générale

Un paiement confirmé ≠ un impact mesuré.

Le projet soutenu est la source de la trace d'impact. Le paiement est la trace financière, pas la preuve terrain.
