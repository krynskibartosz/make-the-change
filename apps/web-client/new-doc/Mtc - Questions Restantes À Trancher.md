# Make the Change — Questions restantes à trancher

## Objectif du document

Ce document liste les questions encore ouvertes autour de l’argent, du modèle économique, du paiement, de la structure juridique, des partenaires, de la boutique et du suivi terrain.

Il sert à préparer une discussion avec les partenaires, le comptable, le juriste et l’équipe produit.

## Mode d’emploi

[RECOMMANDÉ] Ce document doit être utilisé comme registre de décision. Chaque question importante doit recevoir :

* un propriétaire ;
* un niveau de priorité ;
* une décision par défaut ;
* une validation attendue ;
* une date limite ;
* un impact produit.

Statuts recommandés :

| Statut | Signification |
| --- | --- |
| À trancher | Décision ouverte, bloque ou influence la V1. |
| Décision par défaut | Choix recommandé si aucun expert ne s’y oppose. |
| À valider expert | Décision probable, mais comptable / juriste / PSP requis. |
| Validé | Décision confirmée et prête à passer en produit / contrat / CGU. |
| Repoussé V2 | Sujet réel mais non nécessaire pour la V1. |

## Registre prioritaire V1

| Priorité | Sujet | Décision par défaut recommandée | Validation requise | Impact si non tranché |
| --- | --- | --- | --- | --- |
| P0 | Structure juridique | SRL Make the Change en V1 | Comptable + juriste | Impossible de lancer des paiements publics proprement. |
| P0 | Vocabulaire public | “Contribution” par défaut, “don fiscal” interdit sans validation | Juriste | Risque de confusion fiscale et confiance utilisateur. |
| P0 | PSP | Stripe Connect cible, Mollie Connect test possible | PSP + tech + comptable | Risque de mauvais modèle de responsabilité paiement. |
| P0 | Ledger | Ledger interne obligatoire dès V1 | Tech + comptable | Perte de traçabilité financière. |
| P0 | Vendeur officiel | Partenaire vendeur officiel pour produits | Juriste + comptable + partenaire | TVA, retours, SAV et responsabilité flous. |
| P0 | Credits Impact | 1 € soutien producteur = 1 CI interne, non monétaire | Comptable + juriste | Risque de créer une monnaie, une dette ou une promesse. |
| P0 | Remboursements | Règles distinctes par flux | Juriste + PSP | Litiges et chargebacks mal gérés. |
| P1 | Claims impact | 4 niveaux de preuve + registre des claims | Juriste + expert impact | Risque greenwashing. |
| P1 | RGPD | Matrice traitement / base légale / durée / accès | Juriste RGPD | Risque données personnelles et partenaires. |
| P1 | DSA / marketplace | Vendeur identifié + signalement + suspension | Juriste | Risque plateforme si produits tiers. |
| P1 | Droit de rétractation | Politique produit avant checkout | Juriste + partenaires | Risque consommateur et remboursements. |
| P1 | Réserve CI / litiges | Réserve financée par commission ou accord partenaire | Comptable | Avantages CI financés au hasard. |
| P2 | Graines | Retirer de la V1 publique | Produit | Confusion UX avec Credits Impact. |
| P2 | ASBL sœur | Repousser sauf dons centraux | Juriste + stratégie | Complexité prématurée. |
| P2 | Coopérative | Repousser phase Europe | Stratégie | Gouvernance trop lourde V1. |

## Décisions par défaut à appliquer si aucune objection

| Sujet | Décision recommandée | À intégrer dans |
| --- | --- | --- |
| Structure | SRL V1 | statuts, comptabilité, contrats |
| Contribution | Reçu de contribution, pas reçu fiscal | UX, email, historique, CGU |
| Soutien producteur | Commission de base 12 %, ajustable 8-15 % par catégorie | pricing, contrat partenaire, dashboard |
| Achat produit | Partenaire vendeur et expéditeur | fiche produit, checkout, CGV |
| Stock | Pas de stock MTC en V1 | opérations, assurance |
| PSP | Abstraction interne, Stripe cible | architecture paiement |
| Ledger | Source métier de vérité | back-office, comptabilité |
| Credits Impact | Non monétaires, non transférables, non remboursables | wallet, CGU, support |
| Expiration CI | 24 mois | wallet, notifications, CGU |
| Graines | Hors V1 publique | UX, gamification |
| Nouvelles terrain | Timeline + badge + niveau de preuve | pages projet, profil, notifications |

---

## 1. Questions de structure juridique

### A. Forme juridique

Make the Change sera-t-il :

une SRL ;

une ASBL ;

une coopérative ;

un projet porté temporairement par une société existante ;

une SRL + ASBL sœur plus tard ?

Qui seront les fondateurs officiels ?

Qui aura le pouvoir de signature ?

Qui prendra les décisions financières ?

Y aura-t-il une mission d’impact inscrite dans les statuts ?

Faut-il prévoir une structure séparée pour les dons purs à moyen terme ?

Faut-il étudier une reconnaissance liée à l’économie sociale plus tard ?

### B. Responsabilités

Qui est responsable de la plateforme ?

Qui est responsable de l’usage terrain des contributions ?

Qui est responsable des produits vendus ?

Qui est responsable de la livraison ?

Qui est responsable des remboursements ?

Qui est responsable en cas de litige utilisateur ?

Qui est responsable si un partenaire ne donne plus de nouvelles ?

Qui est responsable si un projet ne se déroule pas comme prévu ?

## 2. Questions de paiement

### A. Prestataire de paiement

Choisit-on Stripe Connect, Mollie Connect ou autre ?

Le PSP permet-il :

comptes connectés ;

split payments ;

commissions plateforme ;

remboursements partiels ;

paiements multi-pays ;

paiements Bancontact ;

cartes ;

Apple Pay ;

Google Pay ;

abonnements futurs ;

exports comptables ?

Les partenaires doivent-ils créer un compte connecté ?

Qui gère le KYC des partenaires ?

Le PSP accepte-t-il les partenaires internationaux ?

Le PSP accepte-t-il les types de projets visés ?

Les limites de commission du PSP sont-elles compatibles avec le modèle Make the Change ?

Peut-on changer de PSP plus tard sans tout casser ?

### B. Encaissement

L’argent est-il techniquement encaissé par le PSP ?

L’argent transite-t-il par Make the Change ?

L’argent est-il automatiquement routé vers les partenaires ?

Make the Change garde-t-il uniquement sa commission ?

Y a-t-il des versements manuels ?

À quelle fréquence les partenaires reçoivent-ils leur argent ?

Peut-on bloquer temporairement les fonds en cas de litige ?

Quelle réserve faut-il prévoir ?

## 3. Questions liées au don pur

Est-ce que Make the Change propose réellement du don pur en V1 ?

Qui reçoit le don ?

Le bénéficiaire est-il une association, un producteur, un projet, une société ou une autre structure ?

Le don donne-t-il droit à un reçu fiscal ?

Si oui, qui l’émet ?

Si non, utilise-t-on uniquement un reçu de contribution ?

Est-ce que Make the Change prend des frais sur le don ?

Les frais sont-ils obligatoires ou volontaires ?

Sont-ils fixes ou variables ?

L’utilisateur voit-il le montant net transmis au projet ?

Les frais de paiement sont-ils :

absorbés par Make the Change ;

déduits du don ;

ajoutés au paiement utilisateur ?

Le don est-il remboursable ?

Que se passe-t-il si le projet est annulé ?

Que se passe-t-il si le partenaire ne donne pas de nouvelles ?

Le don donne-t-il une trace dans le profil ?

Le don peut-il débloquer une espèce BioDex si le lien est documenté ?

Le don donne-t-il une progression symbolique si les Graines sont supprimées ?

## 4. Questions liées au soutien producteur

Quels projets sont éligibles au soutien producteur ?

Quelle commission prend Make the Change ?

Commission recommandée à discuter : 10 à 15 %.

Commission unique ou variable ?

Les frais de paiement sont-ils inclus ou séparés ?

Quand le producteur reçoit-il l’argent ?

Le soutien producteur est-il remboursable ?

Que deviennent les Credits Impact en cas de remboursement ?

Les Credits Impact sont-ils attribués immédiatement ou après validation du paiement ?

Faut-il un délai anti-fraude avant utilisation des Credits Impact ?

Le producteur voit-il le détail :

montant brut ;

frais paiement ;

commission MTC ;

montant net ;

date de versement ?

Le soutien producteur donne-t-il une trace BioDex si le lien espèce-projet est documenté ?

Le soutien producteur doit-il toujours être lié à un projet terrain précis ?

## 5. Questions liées aux Credits Impact

Confirme-t-on la règle : 1 € de soutien producteur = 1 CI reçu ?

Confirme-t-on que les CI n’ont pas de valeur monétaire publique ?

Confirme-t-on que les CI ne sont pas remboursables ?

Confirme-t-on que les CI ne sont pas transférables ?

Confirme-t-on qu’on ne peut pas acheter directement des CI ?

Confirme-t-on que les CI ne viennent jamais :

d’un don ;

d’un achat produit ;

d’un quiz ;

d’une mission ;

d’un défi ;

de l’Academy ?

Quelle est la durée de validité ?

Recommandation à discuter : 24 mois.

Comment afficher l’expiration ?

Que se passe-t-il si un utilisateur utilise ses CI puis demande un remboursement ?

Peut-on créer un solde négatif ?

Peut-on bloquer les CI jusqu’à confirmation définitive ?

Les CI servent-ils à :

réduction produit ;

livraison offerte ;

produit découverte ;

avantage partenaire ;

expérience ;

contenu premium ?

Qui finance les avantages CI ?

Faut-il une réserve financière interne pour les CI ?

Quel ledger CI doit être prévu ?

## 6. Questions liées aux Graines

Garde-t-on les Graines dans la V1 ?

Si non, par quoi les remplace-t-on ?

Progression pédagogique ?

Badges ?

BioDex ?

Parcours complétés ?

Traces d’action ?

Si les Graines restent, à quoi servent-elles exactement ?

Sont-elles dépensables ou seulement accumulées ?

Risquent-elles de créer une confusion avec les Credits Impact ?

Les Graines doivent-elles être invisibles en V1 ?

Les Graines doivent-elles être repoussées en V2 ?

## 7. Questions liées aux produits et avantages

Make the Change vend-il des produits physiques en V1 ?

Ou uniquement des avantages partenaires ?

Ou les deux ?

Qui est vendeur officiel ?

Le partenaire ou Make the Change ?

Qui facture ?

Qui gère la TVA ?

Qui livre ?

Qui gère les retours ?

Qui gère les remboursements ?

Qui gère le SAV ?

Make the Change prend-il une commission produit ?

Quel pourcentage ?

Les produits doivent-ils être liés à un projet ?

Peut-on vendre un produit responsable non lié directement à un projet ?

Combien de produits maximum en V1 ?

Qui valide la qualité des produits ?

Qui valide les photos, textes, prix et stocks ?

Les Credits Impact peuvent-ils être utilisés sur les produits ?

Si oui, sous quelle forme ?

## 8. Questions liées au stock, packaging et livraison

Make the Change achète-t-il du stock ?

Si oui, où est-il stocké ?

Qui emballe ?

Qui expédie ?

Qui paie les emballages ?

Qui gère les invendus ?

Qui gère les produits abîmés ?

Si le partenaire expédie, quel standard impose-t-on ?

Délai de livraison maximum ?

Suivi colis obligatoire ?

Transporteurs acceptés ?

Packaging Make the Change obligatoire ou optionnel ?

Peut-on imposer :

carte Make the Change ;

QR code projet ;

sticker ;

fiche producteur ;

message de remerciement ?

Qui paie ces éléments de packaging ?

Qui gère les réclamations livraison ?

## 9. Questions liées aux reçus, factures et documents

Quel document reçoit l’utilisateur après un don ?

Quel document reçoit l’utilisateur après un soutien producteur ?

Quel document reçoit l’utilisateur après un achat produit ?

Qui émet chaque document ?

Qu’est-ce qui est une facture ?

Qu’est-ce qui est un reçu de contribution ?

Qu’est-ce qui est une confirmation de paiement ?

Qu’est-ce qui est un reçu fiscal ?

Quels documents sont visibles dans le profil ?

Quels documents sont envoyés par email ?

Quels documents sont accessibles au partenaire ?

Quel wording légal faut-il valider ?

## 10. Questions liées au suivi terrain

Qui produit les nouvelles terrain ?

Make the Change se rend-il sur place ?

Les partenaires envoient-ils les updates ?

Faut-il former les partenaires ?

Faut-il un kit partenaire ?

Quel format d’update ?

texte ;

photo ;

vidéo ;

donnée chiffrée ;

localisation ;

date ;

preuve.

Quelle fréquence ?

Qui valide avant publication ?

Que montre-t-on s’il n’y a pas encore d’update ?

Quels niveaux de preuve affiche-t-on ?

Les nouvelles sont-elles visibles :

dans la liste projet ;

sur la page projet ;

dans une timeline ;

dans une notification ;

dans Aventure ;

dans le profil ?

Comment éviter de transformer une nouvelle terrain en preuve d’impact trop forte ?

## 11. Questions liées au dashboard admin

Quels indicateurs financiers l’admin doit-il voir ?

Quels indicateurs partenaires ?

Quels indicateurs projets ?

Quels indicateurs Credits Impact ?

Quels statuts de paiement ?

Quels statuts de transfert ?

Quels statuts de remboursement ?

Quels statuts de litige ?

Quels exports comptables ?

Qui peut valider un remboursement ?

Qui peut modifier une transaction ?

Qui peut créer un ajustement de Credits Impact ?

Qui peut publier une nouvelle terrain ?

## 12. Questions liées au dashboard partenaire

Le partenaire a-t-il un compte ?

Voit-il ses contributions ?

Voit-il ses ventes ?

Voit-il ses montants à recevoir ?

Voit-il les frais ?

Voit-il la commission Make the Change ?

Peut-il publier une nouvelle terrain ?

Peut-il modifier ses produits ?

Peut-il gérer son stock ?

Peut-il télécharger des exports ?

Peut-il gérer ses documents ?

## 13. Questions liées au modèle économique global

Quelle est la source de revenu principale de la V1 ?

Quelle source de revenu est secondaire ?

Quelle source est repoussée à plus tard ?

Combien coûte un projet à maintenir ?

Combien coûte une nouvelle terrain ?

Combien coûte un utilisateur actif ?

Combien coûte le support ?

Combien coûte la plateforme technique ?

Quel volume minimum rend le modèle viable ?

Quel est le seuil de rentabilité ?

Faut-il un abonnement Ambassadeur ?

Faut-il une offre B2B / RSE ?

Faut-il des offres partenaires payantes ?

Faut-il du sponsoring projet ?

## 14. Questions à poser en priorité absolue

Quelle structure juridique pour la V1 ?

Stripe Connect ou Mollie Connect ?

Qui est vendeur officiel pour les produits ?

Qui reçoit l’argent des dons ?

Quelle commission sur le soutien producteur ?

Garde-t-on ou retire-t-on les Graines ?

Confirme-t-on la règle Credits Impact ?

Qui finance les avantages liés aux CI ?

Qui produit les nouvelles terrain ?

Quel dashboard minimal faut-il pour ne pas perdre le contrôle financier ?

## 15. Décisions recommandées par défaut

[HYPOTHESE] Si aucune autre décision n’est prise, prendre ces décisions par défaut :

| Sujet | Décision recommandée | Statut |
| --- | --- | --- |
| Structure | SRL Make the Change en V1 | À valider comptable / juriste |
| ASBL | Plus tard si dons purs importants | Repoussé V2 |
| PSP | Stripe Connect cible, Mollie test possible | À valider PSP |
| Contribution / don pur | Frais transparents, pas de marge cachée, pas de reçu fiscal sans validation | À valider juridique |
| Soutien producteur | Commission 10-15 %, proposition 12 % | Décision par défaut |
| Produit | Partenaire vendeur officiel | À valider juridique / comptable |
| Stock | Pas de stock interne | Décision par défaut |
| Livraison | Partenaire livre | Décision par défaut |
| Packaging | Carte / QR code co-brandé, optionnel en V1 | À valider partenaire |
| Credits Impact | 1 € soutien = 1 CI interne, sans valeur cash publique | À valider comptable / juridique |
| Expiration CI | 24 mois | Décision par défaut |
| Graines | Retirées de la V1 publique | Décision par défaut |
| Ledger | Obligatoire dès la V1 | Décision par défaut |
| Dashboard admin | Minimum viable dès la V1 | Décision par défaut |
| Reçu fiscal | Non, sauf validation légale spécifique | Décision par défaut |
| Nouvelles terrain | Timeline + badge + niveaux de preuve | Décision par défaut |

## 16. Format de suivi recommandé

[RECOMMANDÉ] Chaque décision prioritaire devrait ensuite être suivie dans un tableau opérationnel séparé ou dans un outil projet.

| Champ | Exemple |
| --- | --- |
| decision_id | DEC-2026-001 |
| sujet | PSP V1 |
| décision | Stripe Connect cible, Mollie test possible |
| propriétaire | Responsable produit / finance |
| validation | PSP + comptable |
| statut | À valider expert |
| deadline | Avant intégration paiement réel |
| impact produit | Checkout, ledger, dashboard partenaire |
| documents touchés | CGU, contrat partenaire, modèle ledger |

