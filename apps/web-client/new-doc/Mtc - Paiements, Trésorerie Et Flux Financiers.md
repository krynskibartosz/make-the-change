# Make the Change — Paiements, trésorerie et flux financiers

## Conclusion courte

[HYPOTHESE] Make the Change ne devrait pas gérer une grande caisse manuelle où tout l’argent arrive sur un compte bancaire avant d’être redistribué à la main.

Le meilleur modèle recommandé est :

> Utilisateur → PSP plateforme → répartition automatique entre partenaire et Make the Change → ledger interne → historique utilisateur + dashboard partenaire + comptabilité.

PSP possibles :

* Stripe Connect ;
* Mollie Connect ;
* Adyen for Platforms plus tard si volume important.

## Décision renforcée après revue

[RECOMMANDÉ] La V1 doit être pensée comme une architecture de plateforme, même si le volume est faible au départ.

Décision opérationnelle :

```text
PSP = source technique des paiements
Ledger MTC = source métier de vérité
Comptabilité = source légale et fiscale
Dashboard = vue de pilotage
```

Le PSP ne doit pas être la seule source de vérité : il ne connaît pas toujours le sens métier d’un paiement, le niveau de preuve d’un projet, la règle Credits Impact, la réserve avantages, ni la distinction exacte entre contribution, soutien producteur et achat produit.

[RECOMMANDÉ] Chaque paiement doit créer des événements immuables dans le ledger. Les corrections se font par écritures d’ajustement, pas par modification silencieuse d’une transaction passée.

---

## 1. Principe de base

Chaque euro doit avoir un statut clair :

* revenu Make the Change ;
* montant dû au partenaire ;
* frais de paiement ;
* frais de plateforme ;
* commission ;
* TVA éventuelle ;
* remboursement potentiel ;
* réserve ;
* avantage futur lié aux Credits Impact.

À éviter :

* virements manuels non structurés ;
* Excel comme source principale ;
* mélange entre don, soutien et achat ;
* argent partenaire considéré comme revenu Make the Change ;
* absence de ledger.

---

## 2. Modèle de paiement recommandé

[HYPOTHESE] Le modèle recommandé est un modèle plateforme avec comptes connectés.

Schéma :

```text
Utilisateur
   ↓ paiement
Stripe Connect / Mollie Connect / Adyen
   ↓ routing / split
Partenaire reçoit sa part
Make the Change reçoit ses frais ou commissions
   ↓
Ledger interne Make the Change
   ↓
Historique utilisateur + dashboard partenaire + comptabilité
```

---

## 3. Pourquoi éviter la caisse manuelle

À éviter :

```text
Utilisateur → compte Make the Change → virements manuels aux partenaires
```

Risques :

* confusion comptable ;
* erreurs de virement ;
* retards partenaires ;
* argent de tiers mélangé aux revenus propres ;
* difficulté en cas de remboursement ;
* manque de transparence ;
* risque réglementaire ;
* perte de confiance.

---

## 4. Stripe Connect vs Mollie Connect

### Mollie Connect

[HYPOTHESE] Mollie est intéressant si :

* V1 belge ou européenne simple ;
* peu de partenaires ;
* paiements simples ;
* besoin d’une solution accessible ;
* Bancontact et moyens de paiement locaux importants ;
* intégration plus légère.

Points d’attention :

* vérifier les limites de frais plateforme ;
* vérifier la flexibilité des commissions ;
* vérifier la gestion des partenaires internationaux ;
* vérifier les remboursements partiels ;
* vérifier les exports comptables.

### Stripe Connect

[HYPOTHESE] Stripe est plus adapté si :

* ambition européenne ;
* partenaires multiples ;
* partenaires internationaux ;
* commissions variables ;
* remboursements partiels ;
* dashboard partenaire ;
* abonnements futurs ;
* B2B / RSE ;
* architecture plus scalable.

Points d’attention :

* intégration plus technique ;
* besoin d’un bon ledger interne ;
* configuration plus complexe ;
* gestion des litiges et soldes négatifs à anticiper.

### Décision recommandée

[HYPOTHESE] Pour Make the Change :

* architecture cible : Stripe Connect ;
* test simple possible : Mollie Connect ;
* ne pas lier le modèle métier au PSP ;
* créer une abstraction interne de paiement.

Recommandation pratique :

> Designer l’architecture comme si Stripe Connect était la cible long terme, même si Mollie est testé en V1.

## Décision PSP à documenter avant intégration

[RECOMMANDÉ] Avant de coder le paiement réel, choisir explicitement le modèle de flux et de responsabilité.

| Question | Stripe Connect | Mollie Connect | Décision MTC recommandée |
| --- | --- | --- | --- |
| Partenaires multiples | Très adapté | Adapté selon modèle Platforms / Marketplaces | Concevoir une abstraction interne. |
| Frais plateforme | Application fee / solde plateforme selon type de charge | Application fees / split payments selon modèle | Ne pas coder la commission directement dans la logique produit. |
| Remboursements | Responsabilité différente selon direct / destination / separate charges | Responsabilité différente selon Platforms / Marketplaces | Documenter qui supporte refund, chargeback et solde négatif. |
| Multi-pays | Fort pour ambition Europe | Bon pour V1 européenne simple | Stripe cible long terme, Mollie test possible. |
| Bancontact | Disponible selon configuration | Très naturel en Belgique | Critère important pour V1 belge. |
| Ledger interne | Obligatoire | Obligatoire | Indépendant du PSP choisi. |

Points à décider avec le PSP :

* qui est merchant of record selon chaque flux ;
* quel compte porte le risque de remboursement et chargeback ;
* peut-on retarder les payouts produit ;
* comment gérer remboursement partiel + annulation partielle des Credits Impact ;
* comment exporter les frais PSP, commissions, payouts et litiges ;
* comment migrer si MTC change de PSP plus tard.

---

## 5. Les trois flux financiers principaux

### A. Don pur

[VALIDÉ] Un don pur ne donne pas de Credits Impact.

[HYPOTHESE] Flux recommandé :

1. L’utilisateur fait une contribution.
2. Le PSP encaisse.
3. Les frais sont calculés.
4. Le montant net est transféré au projet ou partenaire.
5. Make the Change garde uniquement des frais affichés si prévus.
6. L’utilisateur reçoit un reçu de contribution.
7. Le suivi terrain reste séparé du paiement.

Exemple :

| Élément                         | Montant |
| ------------------------------- | ------: |
| Contribution utilisateur        | 50,00 € |
| Frais paiement + fonctionnement | -5,00 € |
| Montant net projet              | 45,00 € |

Wording recommandé :

> Votre contribution soutient ce projet. Le montant net transmis au projet et les frais de fonctionnement sont affichés clairement. Ce reçu n’est pas un reçu fiscal.

---

### B. Soutien producteur

[VALIDÉ] Les Credits Impact viennent uniquement du soutien producteur.

[HYPOTHESE] Flux recommandé :

1. L’utilisateur soutient un producteur.
2. Le PSP encaisse.
3. Make the Change garde une commission claire.
4. Le producteur reçoit sa part.
5. L’utilisateur reçoit des Credits Impact.
6. Une ligne est créée dans le ledger.

Exemple :

| Élément                    |  Montant |
| -------------------------- | -------: |
| Soutien utilisateur        | 100,00 € |
| Frais paiement             |  -2,50 € |
| Commission Make the Change | -12,00 € |
| Montant producteur         |  85,50 € |
| Credits Impact émis        |   100 CI |

Décision recommandée :

* commission standard : 10 à 15 % ;
* proposition de départ : 12 % ;
* règle simple en V1 ;
* détails visibles côté partenaire.

---

### C. Achat produit

[VALIDÉ] Un achat produit ne crée pas de Credits Impact.

[HYPOTHESE] En V1, le partenaire devrait être vendeur officiel.

Flux recommandé :

1. L’utilisateur achète un produit partenaire.
2. Le PSP encaisse.
3. Le partenaire reçoit sa part.
4. Make the Change reçoit une commission.
5. Le partenaire livre.
6. Make the Change affiche le suivi si disponible.

Exemple :

| Élément                    | Montant |
| -------------------------- | ------: |
| Prix produit               | 20,00 € |
| Frais paiement             | -0,80 € |
| Commission Make the Change | -3,00 € |
| Net partenaire             | 16,20 € |

Wording recommandé :

> Produit vendu et expédié par le partenaire. Make the Change facilite l’expérience et le suivi. Cet achat ne génère pas de Credits Impact.

---

## 6. Credits Impact et paiement

[HYPOTHESE] Règle recommandée :

* 1 € de soutien producteur = 1 Credit Impact reçu ;
* pas de valeur monétaire affichée ;
* pas de conversion cash ;
* pas de transfert entre utilisateurs ;
* pas d’achat direct de CI ;
* expiration recommandée : 24 mois ;
* annulation des CI en cas de remboursement du soutien ;
* financement des avantages via une réserve interne ou accord partenaire.

[RECOMMANDÉ] Les Credits Impact doivent être traités comme un ledger séparé du solde financier, avec des événements propres :

* émission ;
* utilisation ;
* expiration ;
* annulation ;
* ajustement manuel justifié ;
* blocage temporaire en cas de litige ;
* solde négatif exceptionnel en cas de remboursement après utilisation.

[RECOMMANDÉ] Attribution V1 : émettre les Credits Impact seulement après paiement capturé et confirmé par webhook PSP. Pour les montants élevés ou comportements suspects, prévoir un statut “en attente” avant utilisation.

À ne pas dire :

* 1 CI = 1 € ;
* payer avec mes CI ;
* mes CI valent X € ;
* rendement ;
* remboursement ;
* monnaie.

Wording recommandé :

> Utiliser mes Credits Impact pour débloquer cet avantage.

---

## 7. Réserve financière recommandée

[HYPOTHESE] Une partie de la commission Make the Change devrait financer les avantages liés aux Credits Impact.

Exemple sur 100 € de soutien producteur :

| Élément                    | Montant |
| -------------------------- | ------: |
| Commission Make the Change | 12,00 € |
| Réserve avantages CI       |  3,00 € |
| Revenu opérationnel MTC    |  9,00 € |

Objectif : éviter que les avantages futurs soient financés au hasard.

---

## 8. Ledger interne obligatoire

[HYPOTHESE] Make the Change doit avoir un ledger interne dès la V1, même si les données sont encore mockées.

Objets à suivre :

* transactions ;
* frais paiement ;
* commissions ;
* montants partenaires ;
* remboursements ;
* litiges ;
* payouts ;
* Credits Impact émis ;
* Credits Impact utilisés ;
* Credits Impact expirés ;
* annulations.

Exemple de champs transaction :

| Champ                 | Exemple          |
| --------------------- | ---------------- |
| transaction_id        | TX-2026-0001     |
| user_id               | User 42          |
| type                  | producer_support |
| project_id            | rucher_01        |
| partner_id            | partner_01       |
| gross_amount          | 100 €            |
| payment_fee           | 2,50 €           |
| platform_fee          | 12 €             |
| partner_net           | 85,50 €          |
| impact_credits_issued | 100              |
| status                | paid             |
| transfer_status       | pending          |
| created_at            | 2026-05-24       |

Champs complémentaires recommandés :

| Champ | Pourquoi |
| --- | --- |
| seller_of_record | Identifie le vendeur officiel ou bénéficiaire réel. |
| merchant_of_record | Clarifie qui porte le paiement côté PSP. |
| vat_treatment_status | Marque “à valider”, “TVA belge”, “intracom”, “hors champ”, etc. |
| receipt_type | Contribution, confirmation de soutien, facture partenaire, reçu fiscal validé. |
| refund_policy_snapshot | Version des conditions acceptées au moment du paiement. |
| evidence_level_at_payment | Niveau de preuve affiché au moment de la contribution. |
| terms_version | Version CGU / CGV acceptée. |
| psp_charge_id | Référence PSP. |
| psp_transfer_id | Référence payout / transfert si disponible. |
| ledger_version | Version du modèle ledger utilisé. |

[RECOMMANDÉ] Les dashboards doivent lire le ledger MTC, pas recalculer les montants depuis l’interface PSP à la volée.

---

## 9. Dashboard admin minimal

[HYPOTHESE] Le dashboard Make the Change doit afficher :

* total encaissé ;
* frais paiement ;
* commissions Make the Change ;
* montants dus aux partenaires ;
* montants transférés ;
* montants en attente ;
* remboursements ;
* litiges ;
* Credits Impact émis ;
* Credits Impact utilisés ;
* projets actifs ;
* partenaires à payer ;
* nouvelles terrain en attente.

---

## 10. Dashboard partenaire minimal

[HYPOTHESE] Le partenaire doit pouvoir voir ou recevoir :

* montants bruts soutenus ;
* frais ;
* commission Make the Change ;
* montant net ;
* statut du versement ;
* commandes à traiter ;
* produits vendus ;
* nouvelles terrain demandées ;
* historique des contributions.

---

## 11. Remboursements et litiges

Questions à décider :

* Un don est-il remboursable ?
* Un soutien producteur est-il remboursable ?
* Un achat produit suit-il le droit de rétractation ?
* Qui rembourse ?
* Les frais plateforme sont-ils remboursés ?
* Que deviennent les Credits Impact ?
* Que faire si les CI ont déjà été utilisés ?
* Que faire si le partenaire a déjà reçu l’argent ?
* Que faire si le produit n’est pas livré ?

[HYPOTHESE] Règle recommandée :

* remboursement soutien producteur = annulation des Credits Impact liés ;
* CI déjà utilisés = solde négatif ou remboursement partiel ajusté ;
* produit non livré = responsabilité vendeur partenaire en V1 ;
* Make the Change doit prévoir une réserve litiges.

## Politique de remboursement V1 proposée

[RECOMMANDÉ] Décider ces règles avant le premier paiement réel :

| Flux | Règle V1 proposée | Point à valider |
| --- | --- | --- |
| Contribution au projet | Non remboursable par défaut après affectation, sauf erreur, fraude ou annulation projet | Validation juridique et wording public. |
| Soutien producteur | Remboursable selon fenêtre courte définie, puis au cas par cas | Annulation totale ou partielle des Credits Impact. |
| Achat produit | Droit de rétractation consommateur si applicable | Exceptions : périssable, personnalisé, hygiène, contenu numérique. |
| Avantage CI | Annulation de l’avantage si commande remboursée | Traitement du solde CI déjà consommé. |

Workflow recommandé :

1. Demande utilisateur créée.
2. Statut ledger : refund_requested.
3. Vérification du flux, vendeur, délai, conditions applicables.
4. Validation admin ou partenaire selon responsabilité.
5. Remboursement PSP.
6. Écriture ledger de remboursement.
7. Écriture Credits Impact si nécessaire.
8. Notification utilisateur et partenaire.

---

## 12. Trésorerie

[HYPOTHESE] Le rôle du responsable financier ou trésorier est de garantir que l’argent est traçable.

Il doit pouvoir répondre à :

> Sur les montants encaissés ce mois-ci, combien appartient à Make the Change, combien doit être reversé, combien a été reversé, combien est en attente, combien est en litige, et pourquoi ?

Contrôles recommandés :

* rapprochement PSP / banque / ledger ;
* revue mensuelle des partenaires à payer ;
* validation des remboursements ;
* suivi des litiges ;
* suivi des CI en circulation ;
* suivi des réserves ;
* export comptable mensuel.

---

## 13. Décision finale recommandée

[HYPOTHESE] Pour Make the Change :

* utiliser un PSP plateforme ;
* viser Stripe Connect comme architecture cible ;
* tester Mollie Connect uniquement si la V1 reste simple ;
* éviter les virements manuels ;
* créer un ledger interne dès maintenant ;
* ne pas considérer l’argent partenaire comme revenu Make the Change ;
* séparer strictement les flux don, soutien, achat ;
* afficher les frais avec transparence ;
* ne pas créer de valeur monétaire publique pour les Credits Impact.
