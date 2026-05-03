# Make the Change - Design, UX et UI

> Source pour les Gems Design, Produit et Frontend.
> Perimetre: `apps/web-client`.

---

## 1. Direction Generale

Positionnement design recommande:

> Impact premium sobre + gamification chaleureuse.

L'app doit inspirer confiance pour l'argent et l'impact, tout en gardant une energie d'aventure grace aux mascottes, a l'Academy, au BioDex et aux moments de progression.

Elle ne doit pas devenir:

- un jeu mobile enfantin;
- une marketplace froide;
- une app ONG austere;
- un produit suranime qui fatigue.

## 2. Mobile-First

Le produit cible est mobile-first.

Principes:

- navigation basse claire;
- parcours courts;
- ecrans immersifs pour Academy, onboarding, checkout, detail projet;
- CTA visibles mais non agressifs;
- lisibilite forte;
- animations utiles, pas decoratives.

## 3. Onglets Cibles

| Onglet      | Intention UX                                        |
| ----------- | --------------------------------------------------- |
| Aventure    | hub quotidien, progression, Academy, action du jour |
| Projets     | choisir un projet a soutenir ou financer            |
| Collectif   | voir l'impact commun et les factions                |
| Recompenses | utiliser Points d'Impact ou acheter                 |
| Profil      | soi, progression, BioDex, historiques               |

L'onglet `Aventure` est la priorite design a cadrer.

## 4. Hub Aventure

### 4.1 Role

Le hub Aventure est la page d'accueil connectee cible.

Il doit repondre a:

- "Qu'est-ce que je fais maintenant ?"
- "Ou en est mon impact ?"
- "Qu'est-ce que j'apprends ou debloque ?"
- "Quel projet merite mon attention ?"

### 4.2 Structure Recommandee

1. Hero compact avec mascotte/faction.
2. Carte "Continuer l'Academy".
3. Action prioritaire du jour.
4. Projet recommande.
5. BioDex: espece proche ou debloquee.
6. Objectif collectif.
7. Recompense ou solde discret.

### 4.3 Personnalisation

Recommandation:

- structure identique pour tous;
- accents faction;
- copy adaptee;
- recommandations adaptees;
- mascotte visible mais non envahissante.

## 5. Mascottes

Les mascottes sont un actif emotionnel majeur.

### 5.1 Presence Forte

- onboarding;
- Aventure;
- Academy;
- BioDex;
- succes;
- recompenses;
- empty states emotionnels.

### 5.2 Presence Discrete

- paiement;
- don;
- soutien producteur;
- pages legales;
- informations de confiance;
- RSE.

Dans les moments financiers, la mascotte accompagne; elle ne doit pas faire perdre le serieux.

## 6. Factions Et Accents Visuels

| Faction                    | Couleur cible | Sens                              |
| -------------------------- | ------------- | --------------------------------- |
| Vie Sauvage / Melli        | amber         | pollinisation, energie, proximite |
| Terres & Forets / Sylva    | emerald       | regeneration, sols, patience      |
| Gardiens des mers / Ondine | blue          | oceans, eau, fluidite             |

Regle:

- ne pas creer trois interfaces differentes;
- garder un systeme commun;
- changer les accents, les illustrations et certaines recommandations.

## 7. Style UI

Recommandations:

- surfaces sobres;
- contrastes forts;
- cartes utiles, pas empilement decoratif;
- typographie lisible;
- motion douce;
- elements ludiques reserves aux bons moments;
- pas de surcharge d'effets visuels dans les parcours argent.

## 8. Academy

Style cible:

- plus ludique;
- immersif;
- feedback rapide;
- progression claire;
- mascotte active;
- sentiment d'apprentissage par aventure.

L'Academy peut avoir une identite plus expressive que les pages projet ou paiement.

## 9. Projets

Style cible:

- credible;
- concret;
- photos ou visuels d'impact;
- donnees lisibles;
- CTA clair;
- transparence sur le type: don pur ou soutien producteur.

Les pages projet doivent inspirer confiance avant de generer de l'emotion.

## 10. Boutique

Style cible:

- marketplace premium selectionnee;
- produits desirables;
- lien clair avec producteur/projet;
- priorite aux Points d'Impact;
- achat euros disponible mais secondaire dans la narration.

## 11. BioDex

Style cible:

- collection vivante;
- fiches accessibles;
- verrouillage partiel motivant;
- image floutee/silhouette avant debloquage;
- contenus enrichis avec Graines;
- evolution visuelle IA en V2 si coherence artistique.

## 12. RSE

Style cible:

- professionnel;
- sobre;
- exportable;
- preuve et reporting;
- peu de gamification visible cote entreprise;
- gamification possible cote salaries.

## 13. Accessibilite

Principes:

- tailles tactiles suffisantes;
- contrastes lisibles;
- textes non tronques;
- motion reduite respectee;
- navigation comprehensible;
- labels clairs;
- pas d'information critique uniquement par couleur.

## 14. Risques Design

| Risque                          | Effet                       | Correction                         |
| ------------------------------- | --------------------------- | ---------------------------------- |
| trop de mascottes partout       | infantilisation             | hierarchiser leur presence         |
| trop sobre                      | perte de magie              | moments de progression vivants     |
| trop jeu mobile                 | perte de confiance paiement | sobriete dans l'argent             |
| onglet Defis trop etroit        | experience fragmentee       | hub Aventure                       |
| trois factions trop differentes | maintenance lourde          | meme structure, accents differents |
