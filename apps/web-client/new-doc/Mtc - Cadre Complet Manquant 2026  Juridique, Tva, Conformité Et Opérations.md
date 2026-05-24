# Make the Change — Cadre complet manquant 2026 : juridique, TVA, conformité et opérations

## Objectif du document

Ce document complète les canevas existants avec les blocs qui manquaient encore pour pouvoir prendre des décisions solides avant une V1 réelle :

* commissions par typologie ;
* TVA ;
* CGU / CGV ;
* contrat partenaire ;
* KYC et validation partenaire ;
* RGPD ;
* claims impact et greenwashing ;
* DSA / marketplace ;
* droit de rétractation ;
* assurances ;
* unit economics ;
* multi-pays Europe ;
* gouvernance financière ;
* décisions recommandées par défaut.

Ce document ne remplace pas un avis juridique ou comptable. Il sert de cadre produit/business pour préparer les discussions avec un comptable, un juriste, un PSP et les partenaires.

## Doctrine V1 consolidée après revue

[RECOMMANDÉ] Si aucune validation externe ne contredit ces choix, la V1 doit suivre cette doctrine :

1. Make the Change démarre comme SRL avec mission d’impact claire.
2. Le mot public par défaut est “contribution”, pas “don fiscal”.
3. Les flux sont strictement séparés : contribution au projet, soutien producteur, achat produit, avantage Credits Impact.
4. Le soutien producteur est le seul flux qui génère des Credits Impact.
5. Les Credits Impact sont une valeur d’usage interne, jamais une monnaie ni une créance utilisateur.
6. Le partenaire est vendeur officiel des produits en V1.
7. Make the Change ne gère pas de stock et ne devient pas vendeur officiel en V1.
8. Le PSP route les paiements, mais le ledger MTC reste la source métier de vérité.
9. Chaque claim d’impact doit être sourcé, daté, qualifié et relié à un niveau de preuve.
10. Aucun reçu fiscal n’est promis sans bénéficiaire agréé, document validé et processus fiscal conforme.

## Niveau de certitude des documents

| Marqueur | Signification | Action |
| --- | --- | --- |
| [VALIDÉ] | Décision produit ou règle interne déjà acceptée | À appliquer dans UX, data model et CGU. |
| [HYPOTHESE] | Recommandation stratégique non validée par expert externe | À confirmer ou transformer en décision. |
| [RECOMMANDÉ] | Ajout après revue, considéré comme choix par défaut robuste | À intégrer dans le backlog de validation. |
| [POINT DE VIGILANCE] | Risque juridique, fiscal, comptable ou opérationnel | À traiter avant flux réel. |

---

# 1. Commission par typologie : décision affinée

## Conclusion

[HYPOTHESE] Une commission différente par grande typologie de projet ou de flux est plus intelligente qu’une commission unique.

Mais il faut éviter une commission improvisée projet par projet.

Bonne approche :

> Grille simple par catégorie + transparence utilisateur + détail complet côté partenaire + ledger interne.

Mauvaise approche :

> Taux négocié au hasard pour chaque projet, sans logique, sans grille, sans justification.

---

## Grille recommandée V1

| Flux / catégorie                    |             Commission recommandée | Décision recommandée                                |
| ----------------------------------- | ---------------------------------: | --------------------------------------------------- |
| Don pur associatif / restauration   | 0 à 5 % ou contribution volontaire | Frais très transparents, pas marge cachée           |
| Soutien producteur standard         |                               12 % | Taux de base V1                                     |
| Soutien producteur fragile / pilote |                           8 à 10 % | Exception documentée                                |
| Soutien producteur premium          |                               15 % | Si Make the Change apporte forte visibilité / suivi |
| Achat produit alimentaire           |                           8 à 12 % | Marges souvent plus faibles                         |
| Achat cosmétique / bien-être        |                          15 à 25 % | Marges souvent plus fortes                          |
| Coffret / édition spéciale          |                          20 à 30 % | Si packaging, storytelling, valeur ajoutée forte    |
| Produit avec stock MTC              |                          20 à 35 % | Uniquement si MTC gère stock, emballage, SAV        |
| Avantage partenaire sans livraison  |                           5 à 15 % | Coût opérationnel plus léger                        |
| Projet international complexe       |           base + frais spécifiques | À justifier selon frais réels                       |
| Offre B2B / RSE                     |            prix fixe ou abonnement | Ne pas traiter comme simple commission              |

---

## Règle d’affichage utilisateur

[HYPOTHESE] L’utilisateur n’a pas besoin de voir toute la grille. Il doit voir une répartition claire.

Exemple :

```text
Votre contribution : 100 €
Transmis au partenaire : 85,50 €
Frais de paiement et fonctionnement : 14,50 €
```

Ou :

```text
Make the Change conserve une commission de plateforme pour couvrir le paiement, le suivi, l’application et la relation partenaire.
```

---

## Règle côté partenaire

[HYPOTHESE] Le partenaire doit voir le détail complet :

* montant brut ;
* frais de paiement ;
* commission Make the Change ;
* montant net ;
* date du paiement ;
* date de versement ;
* statut du versement ;
* éventuel remboursement ;
* éventuel litige.

---

# 2. TVA : ce qu’il faut cadrer

## Conclusion

[HYPOTHESE] La TVA est l’un des sujets les plus importants avant de lancer des paiements réels.

Make the Change doit distinguer :

1. commission de plateforme ;
2. don pur ;
3. soutien producteur ;
4. vente produit ;
5. frais de livraison ;
6. avantage Credits Impact ;
7. service B2B / RSE.

Chaque type peut avoir un traitement TVA différent.

---

## Décision recommandée

[HYPOTHESE] Pour la V1 :

* Make the Change facture une commission ou un service de plateforme aux partenaires ;
* cette commission est probablement soumise à TVA belge si Make the Change est assujettie, à valider selon la nature exacte du service ;
* le partenaire reste vendeur officiel pour les produits ;
* le partenaire gère sa TVA produit ;
* Make the Change ne devient pas vendeur officiel en V1 ;
* les dons purs doivent être séparés des ventes et commissions ;
* toute promesse de reçu fiscal est interdite sans validation.

[POINT DE VIGILANCE] Le taux standard belge de TVA est 21 %, mais cela ne suffit pas à conclure que chaque flux MTC est soumis à 21 %. Le traitement dépend de la nature du flux, du statut TVA de MTC, du pays du partenaire, du pays de l’utilisateur, de la qualité B2B/B2C, et du fait que MTC soit ou non vendeur officiel.

[RECOMMANDÉ] Ajouter dans le ledger un statut `vat_treatment_status` pour éviter de mélanger les flux validés et les flux encore en hypothèse.

---

## Questions TVA à valider avec comptable

1. Make the Change sera-t-elle assujettie TVA ?

2. La commission Make the Change est-elle soumise à 21 % TVA ?

3. Si le partenaire est belge, comment facturer la commission ?

4. Si le partenaire est dans l’UE, comment appliquer la TVA intracommunautaire ?

5. Si le partenaire est hors UE, comment traiter la commission ?

6. Si Make the Change vend un service B2B / RSE, quel taux TVA ?

7. Si Make the Change vend directement des produits plus tard, qui collecte la TVA ?

8. Si des produits sont vendus dans plusieurs pays européens, faut-il OSS ?

9. Les frais de livraison sont-ils facturés par le partenaire ou Make the Change ?

10. Les Credits Impact créent-ils une obligation comptable ou TVA au moment de leur émission ou seulement à l’utilisation ?

11. Si MTC retient des frais sur une contribution, ces frais sont-ils un service taxable distinct ?

12. Si un partenaire est vendeur officiel mais MTC influence fortement le checkout, les prix ou les conditions, y a-t-il un risque que MTC soit considérée comme intervenant dans la vente ?

---

## Décision produit en attendant validation

[HYPOTHESE] Ne pas faire de Make the Change le vendeur officiel en V1.

Cela réduit fortement :

* complexité TVA ;
* facturation produit ;
* retours ;
* droit de rétractation ;
* responsabilité produit ;
* stock ;
* livraison.

---

# 3. CGU / CGV / politiques utilisateur

## Conclusion

[HYPOTHESE] Make the Change aura besoin de plusieurs documents publics, pas seulement de “conditions générales”.

Même si certains documents ne sont pas toujours obligatoires sous la forme attendue, il faut les avoir pour la clarté, la confiance et la protection du projet.

---

## Documents recommandés V1

1. Conditions Générales d’Utilisation de l’app.
2. Conditions spécifiques aux contributions / dons.
3. Conditions spécifiques au soutien producteur.
4. Conditions spécifiques aux Credits Impact.
5. Conditions boutique / produits partenaires.
6. Politique de remboursement.
7. Politique de livraison.
8. Politique de confidentialité.
9. Politique cookies / consentement.
10. Charte de transparence impact.
11. Charte partenaire.
12. Mentions légales.

---

## Décision recommandée

[HYPOTHESE] Séparer les règles par flux pour éviter la confusion.

Structure recommandée :

```text
CGU générales
  ├── Don / contribution
  ├── Soutien producteur
  ├── Credits Impact
  ├── Produits et avantages partenaires
  ├── Remboursements
  ├── Suivi terrain et impact
  └── Données personnelles
```

---

## Clauses importantes à prévoir

### Don / contribution

* le paiement confirme une contribution ;
* pas de résultat garanti ;
* pas de reçu fiscal sauf mention explicite ;
* frais affichés ;
* conditions de remboursement ;
* suivi terrain dépendant du partenaire.

### Soutien producteur

* soutien non assimilable à un investissement ;
* pas de rendement ;
* pas de propriété ;
* pas de remboursement garanti ;
* Credits Impact attribués selon règles internes ;
* annulation possible des CI en cas de remboursement.

### Credits Impact

* valeur d’usage interne ;
* non convertibles en argent ;
* non transférables ;
* non remboursables ;
* expiration recommandée ;
* utilisables uniquement dans Make the Change ;
* ne constituent pas une preuve d’impact.

### Produits partenaires

* vendeur officiel identifié ;
* responsable de livraison identifié ;
* conditions retour ;
* SAV ;
* délai de livraison ;
* frais ;
* droit de rétractation si applicable.

---

# 4. Contrat partenaire

## Conclusion

[HYPOTHESE] Make the Change doit avoir une convention partenaire avant toute mise en ligne sérieuse d’un projet.

---

## Contrat partenaire : sections recommandées

1. Identification du partenaire.
2. Statut juridique du partenaire.
3. Description du projet.
4. Type de flux autorisé : don, soutien producteur, produit, avantage.
5. Commission Make the Change.
6. Frais de paiement.
7. Fréquence de versement.
8. Remboursements et litiges.
9. Responsabilité du partenaire.
10. Responsabilité Make the Change.
11. Nouvelles terrain obligatoires.
12. Format des preuves et contenus.
13. Autorisation d’utiliser photos, vidéos, textes, logos.
14. Qualité et exactitude des informations.
15. Produits, stocks et livraison si applicable.
16. TVA et facturation.
17. Protection des données.
18. Durée du partenariat.
19. Résiliation.
20. Clause anti-greenwashing.
21. Clause de transparence.
22. Droit de suspendre un projet si informations insuffisantes.

---

## Décision recommandée

[HYPOTHESE] En V1, aucun projet ne devrait être public sans fiche partenaire validée.

Minimum obligatoire :

* identité ;
* compte bancaire ou compte PSP connecté ;
* description projet ;
* type de flux ;
* commission ;
* responsabilités ;
* suivi terrain ;
* documents / preuves minimales ;
* autorisation d’utiliser les contenus.

---

# 5. KYC et validation partenaire

## Conclusion

[HYPOTHESE] Make the Change doit vérifier ses partenaires avant de les afficher, même si le PSP fait déjà un KYC financier.

Le KYC PSP vérifie souvent l’identité et la conformité paiement. Make the Change doit aussi vérifier la crédibilité produit/projet.

---

## Checklist validation partenaire

1. Nom légal.
2. Numéro d’entreprise ou équivalent.
3. Pays.
4. Adresse.
5. Contact responsable.
6. Compte bancaire ou compte connecté PSP.
7. Statut : association, société, producteur, indépendant, coopérative.
8. Description activité.
9. Description projet.
10. Photos / preuves d’existence.
11. Capacité à recevoir les paiements.
12. Capacité à livrer si produit.
13. Capacité à fournir des nouvelles terrain.
14. Documents qualité produit si applicable.
15. Engagement sur la véracité des informations.
16. Niveau de preuve disponible.
17. Risques spécifiques.

---

## Décision recommandée

[HYPOTHESE] Créer trois statuts partenaires :

| Statut          | Signification                               |
| --------------- | ------------------------------------------- |
| En vérification | Partenaire pas encore public                |
| Validé V1       | Peut recevoir soutien / afficher projet     |
| Validé renforcé | Dispose de preuves, process et suivi solide |

---

# 6. RGPD et données personnelles

## Conclusion

[HYPOTHESE] Make the Change doit être privacy-by-design dès la V1, surtout parce que l’app combine compte utilisateur, historique de contributions, paiements, préférences, notifications, progression pédagogique et potentiellement localisation large de projets.

---

## Données à cartographier

1. Compte utilisateur.
2. Email.
3. Nom / prénom si demandé.
4. Historique des contributions.
5. Historique des soutiens.
6. Historique des achats.
7. Solde Credits Impact.
8. Usage des Credits Impact.
9. Parcours pédagogiques.
10. BioDex / espèces suivies.
11. Notifications.
12. Données paiement via PSP.
13. Données analytics.
14. Données partenaires.
15. Données de support.

---

## Décisions recommandées

[HYPOTHESE]

* minimiser les données ;
* ne pas stocker les données carte bancaire ;
* laisser le PSP gérer les données sensibles paiement ;
* stocker seulement les identifiants de transaction nécessaires ;
* permettre export et suppression de compte ;
* prévoir consentement cookies/analytics ;
* distinguer emails transactionnels et marketing ;
* documenter les durées de conservation ;
* prévoir un registre de traitements simplifié.

## Matrice RGPD minimale à produire

[RECOMMANDÉ] Avant bêta publique, créer une matrice avec une ligne par traitement.

| Traitement | Données | Base légale probable | Durée | Accès partenaire |
| --- | --- | --- | --- | --- |
| Compte utilisateur | email, identifiant, préférences | contrat ou intérêt légitime selon usage | durée du compte + archive limitée | non |
| Paiement | identifiants transaction, montant, statut PSP | contrat + obligation comptable | durée comptable à valider | données agrégées ou nécessaires |
| Contribution / soutien | projet, partenaire, montant, date | contrat / intérêt légitime | durée comptable + historique utilisateur | selon anonymat choisi |
| Credits Impact | émissions, utilisations, expirations | contrat | durée du compte + archive litige | non |
| Marketing | email, consentements, préférences | consentement | jusqu’au retrait | non |
| Analytics | événements d’usage minimisés | consentement ou intérêt légitime selon outil | courte et documentée | non |

[POINT DE VIGILANCE] Si des attestations fiscales deviennent possibles plus tard, la collecte du numéro national est un traitement très sensible qui doit être limité à cet objectif et validé juridiquement.

---

## Questions à valider

1. Qui est responsable de traitement ?

2. Qui sont les sous-traitants ?

3. Quelles données sont nécessaires ?

4. Quelles données sont optionnelles ?

5. Quelle base légale pour chaque traitement ?

6. Combien de temps conserve-t-on les transactions ?

7. Combien de temps conserve-t-on les données marketing ?

8. Les partenaires ont-ils accès à des données utilisateurs ?

9. Les partenaires voient-ils les noms des contributeurs ?

10. Peut-on soutenir anonymement ?

11. Qui reçoit les emails ?

12. Quels outils analytics sont utilisés ?

---

# 7. Claims impact, greenwashing et preuve

## Conclusion

[HYPOTHESE] Make the Change doit avoir une politique de claims impact avant la V1 publique.

La règle principale :

> Ne jamais dire plus que ce qui est prouvé.

---

## Niveaux recommandés

| Niveau | Nom       | Usage                            | Formulation autorisée                            |
| ------ | --------- | -------------------------------- | ------------------------------------------------ |
| 1      | Narratif  | Nouvelle partenaire              | “Le partenaire partage une nouvelle du terrain.” |
| 2      | Documenté | Date, source, contexte           | “Suivi documenté par le partenaire le…”          |
| 3      | Estimé    | Méthode ou hypothèse             | “Impact estimé selon l’hypothèse du projet.”     |
| 4      | Vérifié   | Méthode robuste, source, période | “Donnée vérifiée selon…”                         |

---

## Formulations recommandées

À utiliser :

* “contribuer à” ;
* “soutenir” ;
* “projet lié à” ;
* “impact estimé” ;
* “suivi terrain” ;
* “nouvelle partenaire” ;
* “preuve en attente” ;
* “donnée documentée”.

À éviter :

* “impact garanti” ;
* “sauver une espèce” ;
* “abeilles sauvées” ;
* “CO2 capturé” sans méthode ;
* “compensation carbone” ;
* “impact vérifié” sans preuve ;
* “ton don a restauré X”.

---

## Décision recommandée

[HYPOTHESE] Chaque métrique affichée doit avoir :

* source ;
* date ;
* méthode ;
* périmètre ;
* niveau de confiance ;
* limites.

Si ces éléments manquent, afficher une formulation narrative ou estimée, pas vérifiée.

## Registre des claims impact

[RECOMMANDÉ] Créer un registre interne pour tout chiffre ou claim affiché publiquement.

| Champ | Exemple |
| --- | --- |
| claim_id | CLAIM-2026-0001 |
| projet | rucher_01 |
| texte_affiché | “Suivi documenté par le partenaire le 24/05/2026.” |
| niveau_preuve | documenté |
| source | photo partenaire + rapport terrain |
| date_source | 2026-05-24 |
| méthode | description courte |
| périmètre | projet, période, zone concernée |
| limites | donnée déclarative partenaire, non auditée |
| responsable_validation | admin MTC |
| date_publication | 2026-05-24 |
| date_revision | 2026-08-24 |

[POINT DE VIGILANCE] Les nouvelles terrain ne doivent pas devenir automatiquement des preuves d’impact. Une photo, un texte ou une visite partenaire peut être une preuve d’activité, pas forcément une preuve de résultat écologique.

---

# 8. DSA / marketplace / obligations plateforme

## Conclusion

[HYPOTHESE] Si Make the Change affiche des produits ou partenaires tiers, elle doit penser comme une plateforme, même si elle démarre petit.

---

## Décisions recommandées

1. Identifier clairement le vendeur ou partenaire.
2. Afficher les informations essentielles avant paiement.
3. Prévoir un mécanisme de signalement.
4. Pouvoir suspendre un produit ou partenaire.
5. Garder une trace des validations.
6. Éviter les dark patterns.
7. Clarifier les frais.
8. Clarifier qui livre et qui rembourse.
9. Prévoir un canal support.
10. Éviter les avis ou badges trompeurs.

[RECOMMANDÉ] Même en petite V1, prévoir ces éléments dans le produit :

* page partenaire avec identité, pays, statut et contact utile ;
* bouton “signaler un problème” sur projet, produit et partenaire ;
* statut interne de modération : actif, en revue, suspendu ;
* historique des validations partenaire ;
* trace de la version des informations affichées au moment du paiement ;
* procédure de suspension si contenu, produit ou claim devient douteux.

---

## Application Make the Change

Même si Make the Change n’est pas Amazon, il faut prévoir :

* page partenaire claire ;
* vendeur officiel clairement indiqué ;
* mentions produit ;
* conditions de retour ;
* bouton signaler un problème ;
* modération des contenus partenaires ;
* suspension possible.

---

# 9. Droit de rétractation et remboursements

## Conclusion

[HYPOTHESE] Pour les produits vendus à distance aux consommateurs européens, il faut prévoir le droit de rétractation de 14 jours, sauf exceptions.

---

## Décision recommandée V1

[HYPOTHESE]

* partenaire vendeur officiel ;
* partenaire responsable des retours ;
* Make the Change affiche la politique clairement ;
* Make the Change facilite le support ;
* remboursements gérés via PSP ;
* ledger mis à jour automatiquement.

---

## Questions à trancher

1. Les produits vendus sont-ils soumis au droit de rétractation ?

2. Y a-t-il des produits périssables ?

3. Y a-t-il des produits personnalisés ?

4. Qui paie le retour ?

5. Qui rembourse les frais de livraison ?

6. Que deviennent les Credits Impact utilisés sur une commande remboursée ?

7. Le partenaire a-t-il reçu l’argent avant fin du délai de rétractation ?

8. Faut-il retarder les payouts produit jusqu’à expiration du délai ?

---

## Décision recommandée

[HYPOTHESE] Pour les produits physiques :

* payout partenaire après délai de sécurité ou avec réserve ;
* politique de retour standardisée ;
* aucun produit complexe en V1 si la politique retour n’est pas claire.

[RECOMMANDÉ] Le checkout produit doit afficher avant paiement :

* vendeur officiel ;
* pays du vendeur ;
* prix total ;
* frais de livraison ;
* délai de livraison estimé ;
* politique de retour ;
* exceptions éventuelles au droit de rétractation ;
* contact support ;
* rôle exact de Make the Change.

---

# 10. Assurances et responsabilité

## Conclusion

[HYPOTHESE] Make the Change doit vérifier les assurances nécessaires avant des flux réels.

---

## Assurances à étudier

1. RC professionnelle Make the Change.
2. RC exploitation si événements ou expériences.
3. Assurance cyber / données si app publique.
4. Assurance responsabilité produit si Make the Change devient vendeur.
5. Assurance transport / stock si Make the Change gère la logistique.
6. Assurance administrateurs si structure avec gouvernance plus large.

---

## Décision recommandée

[HYPOTHESE] En V1 :

* ne pas gérer de stock ;
* ne pas devenir vendeur officiel ;
* demander au partenaire de garantir qu’il est responsable de ses produits ;
* inclure une clause d’assurance / responsabilité dans la convention partenaire.

---

# 11. Unit economics

## Conclusion

[HYPOTHESE] Avant de confirmer les commissions, il faut calculer les coûts réels.

Une commission de 12 % n’est une bonne décision que si elle couvre une partie raisonnable des coûts.

---

## Coûts à mesurer

### Coûts plateforme

* hébergement ;
* base de données ;
* emails ;
* notifications ;
* outils analytics ;
* outils support ;
* maintenance ;
* développement ;
* design ;
* sécurité.

### Coûts paiement

* frais carte ;
* frais Bancontact ;
* frais PSP ;
* frais conversion ;
* frais remboursement ;
* litiges ;
* chargebacks.

### Coûts projet

* onboarding partenaire ;
* rédaction fiche projet ;
* validation preuve ;
* traduction ;
* suivi terrain ;
* support partenaire ;
* mise à jour contenu.

### Coûts produit

* photos ;
* fiche produit ;
* support commande ;
* suivi livraison ;
* litige ;
* retours ;
* packaging si applicable.

### Coûts Credits Impact

* avantages financés par MTC ;
* réductions ;
* livraison offerte ;
* coûts partenaires ;
* expiration ;
* support.

---

## Indicateurs à suivre

1. Contribution moyenne.
2. Soutien producteur moyen.
3. Panier produit moyen.
4. Commission moyenne.
5. Coût paiement moyen.
6. Coût support par utilisateur.
7. Coût onboarding partenaire.
8. Coût mensuel par projet actif.
9. Coût d’une nouvelle terrain.
10. Taux d’utilisation des Credits Impact.
11. Taux de remboursement.
12. Taux de litige.
13. Marge nette par flux.

---

## Décision recommandée

[HYPOTHESE] Revoir les commissions tous les 3 mois pendant la V1.

Si un flux coûte plus qu’il ne rapporte, ajuster :

* commission ;
* frais ;
* fréquence de suivi ;
* nombre de projets ;
* niveau de service ;
* avantages CI.

## Seuils d’alerte V1

[RECOMMANDÉ] Suivre ces seuils dès les premiers paiements :

| Indicateur | Seuil d’alerte proposé | Action |
| --- | --- | --- |
| Marge nette soutien producteur | inférieure à 5 % après frais directs | revoir commission ou coût de service |
| Taux de remboursement produit | supérieur à 5 % | revoir partenaire, fiche produit ou livraison |
| Taux de litige | supérieur à 1 % | audit process paiement / produit |
| Nouvelles terrain en retard | plus de 30 jours après échéance | relance puis suspension visibilité |
| Utilisation Credits Impact | supérieure au budget réserve | réduire avantages ou renégocier financement |
| Coût onboarding partenaire | supérieur à la commission attendue sur 3 mois | limiter nouveaux partenaires |

---

# 12. Multi-pays Europe

## Conclusion

[HYPOTHESE] Même si les premiers utilisateurs sont belges, l’architecture doit anticiper l’Europe.

---

## Décisions recommandées

1. Utiliser un PSP compatible Europe.
2. Prévoir multi-langue.
3. Prévoir TVA / OSS plus tard.
4. Prévoir devises, même si l’euro reste prioritaire.
5. Prévoir pays du partenaire.
6. Prévoir pays de l’utilisateur.
7. Prévoir règles produits par pays.
8. Prévoir support FR/NL/EN à terme.
9. Prévoir contrats partenaires adaptés selon pays.
10. Prévoir niveaux de preuve homogènes.

---

## Décision V1

[HYPOTHESE]

* utilisateurs : Belgique d’abord ;
* partenaires : Belgique + quelques partenaires internationaux sélectionnés ;
* devise : euro ;
* langues : français en premier, prévoir néerlandais / anglais ;
* PSP : Stripe Connect cible ou Mollie si V1 simple ;
* pas de vente produit internationale complexe au départ.

---

# 13. Dashboard minimal à prévoir

## Dashboard admin MTC

[HYPOTHESE] Minimum à prévoir :

* transactions ;
* type de flux ;
* utilisateur ;
* projet ;
* partenaire ;
* montant brut ;
* frais paiement ;
* commission ;
* montant net partenaire ;
* statut paiement ;
* statut payout ;
* remboursement ;
* litige ;
* Credits Impact émis/utilisés ;
* nouvelles terrain attendues ;
* niveau de preuve projet.

---

## Dashboard partenaire

[HYPOTHESE] Minimum à prévoir :

* contributions reçues ;
* soutiens reçus ;
* ventes produit ;
* frais ;
* commission ;
* montant net ;
* statut versement ;
* commandes à traiter ;
* nouvelles terrain à envoyer ;
* documents à fournir.

---

# 14. Décisions recommandées consolidées

| Sujet                      | Décision recommandée                                          |
| -------------------------- | ------------------------------------------------------------- |
| Structure juridique        | SRL V1, ASBL sœur plus tard si dons importants                |
| PSP                        | Stripe Connect cible, Mollie possible pour test simple        |
| Commission                 | Grille par typologie, pas taux unique aveugle                 |
| Don pur                    | 0–5 % ou contribution volontaire, frais transparents          |
| Soutien producteur         | 12 % standard, 8–15 % selon catégorie                         |
| Produit alimentaire        | 8–12 %                                                        |
| Cosmétique / bien-être     | 15–25 %                                                       |
| Coffret / édition spéciale | 20–30 %                                                       |
| Produit avec stock MTC     | 20–35 %, mais pas en V1                                       |
| TVA                        | Partenaire vendeur officiel en V1 pour limiter complexité     |
| Facturation                | MTC facture sa commission/service, partenaire facture produit |
| Reçu fiscal                | Non sauf validation spécifique                                |
| CGU/CGV                    | Documents séparés par flux                                    |
| Contrat partenaire         | Obligatoire avant publication projet                          |
| KYC partenaire             | Validation identité + crédibilité projet                      |
| RGPD                       | Privacy-by-design, données minimales                          |
| Claims impact              | 4 niveaux : narratif, documenté, estimé, vérifié              |
| DSA / marketplace          | Identifier vendeur, mécanisme signalement, transparence       |
| Rétractation               | À prévoir sur produits physiques B2C                          |
| Assurances                 | RC pro + clauses partenaire ; pas stock en V1                 |
| Unit economics             | Revue trimestrielle des coûts et commissions                  |
| Multi-pays                 | Belgique d’abord, architecture Europe dès le départ           |
| Graines                    | Retirer ou repousser en V2 si confusion                       |
| Credits Impact             | 1 € soutien = 1 CI, sans valeur cash publique                 |
| Ledger                     | Obligatoire dès V1                                            |

---

# 15. Ce qu’il faut faire maintenant

## Priorité 1 — Validation comptable

À demander au comptable :

* structure SRL ;
* TVA commission ;
* TVA produit ;
* facturation partenaire ;
* traitement Credits Impact ;
* traitement frais plateforme ;
* traitement dons / contributions ;
* exports nécessaires.

## Priorité 2 — Validation juridique

À demander au juriste :

* CGU ;
* CGV ;
* contrat partenaire ;
* politique remboursement ;
* droit de rétractation ;
* claims impact ;
* responsabilité plateforme ;
* RGPD ;
* DSA si marketplace ;
* reçus / contributions.

## Priorité 3 — Validation PSP

À demander à Stripe / Mollie :

* comptes connectés ;
* commissions variables ;
* partenaires internationaux ;
* frais ;
* remboursements partiels ;
* litiges ;
* exports ;
* Bancontact ;
* Apple Pay ;
* payouts ;
* limites éventuelles.

## Priorité 4 — Validation partenaire

À demander aux partenaires :

* capacité à recevoir paiements ;
* capacité à fournir nouvelles terrain ;
* capacité à livrer ;
* documents disponibles ;
* marge acceptable ;
* photos / contenus ;
* responsabilités ;
* fréquence de suivi.

---

# 16. Phrase de cadrage finale

> Make the Change doit être conçu comme une plateforme de confiance : chaque euro, chaque avantage, chaque produit, chaque nouvelle terrain et chaque claim d’impact doit avoir une source, un responsable, une règle et une trace.

C’est cette discipline qui permettra de grandir de la Belgique vers l’Europe sans perdre la confiance utilisateur.

---

# 17. Références officielles à utiliser pour validation

[RECOMMANDÉ] Ces sources ne remplacent pas un avis expert, mais elles cadrent les validations à demander.

* SPF Finances Belgique : taux TVA belges, dont taux standard 21 %, taux intermédiaire 12 % et taux réduit 6 %.
* SPF Finances Belgique : attestations fiscales pour dons uniquement par institutions agréées et sous conditions.
* Commission européenne : Digital Services Act, transparence marketplace, identification des vendeurs et mécanismes de signalement.
* Your Europe / Commission européenne : droit de rétractation de 14 jours pour contrats à distance, avec exceptions.
* Commission européenne : règles anti-greenwashing et interdiction des claims environnementaux vagues non démontrés à partir de l’application nationale des nouvelles règles.
* EDPB : principes RGPD de minimisation, limitation des finalités, sécurité, information et droits des personnes.
* Documentation Stripe Connect : direct charges, destination charges, separate charges and transfers, remboursements et responsabilité selon le modèle choisi.
* Documentation Mollie Connect : distinction Platforms / Marketplaces, onboarding, application fees, split payments et responsabilité selon modèle.

Liens de travail :

* [SPF Finances - taux TVA](https://finance.belgium.be/en/node/12035)
* [SPF Finances - attestations pour dons](https://finance.belgium.be/en/node/1459)
* [Commission européenne - Digital Services Act](https://digital-strategy.ec.europa.eu/en/policies/digital-services-act)
* [Your Europe - returns and right of withdrawal](https://europa.eu/youreurope/citizens/consumers/shopping/returns/indexamp_en.htm)
* [Commission européenne - green transition / greenwashing](https://energy.ec.europa.eu/news/new-eu-rules-empower-consumers-green-transition-enter-force-2024-03-27_en)
* [EDPB - data protection basics](https://www.edpb.europa.eu/sme-data-protection-guide/data-protection-basics_en)
* [Stripe Connect - charges](https://docs.stripe.com/connect/charges)
* [Mollie Connect - overview](https://docs.mollie.com/docs/connect-overview)
