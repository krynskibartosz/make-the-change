# Spécifications de l'Outil Producteur ("MTC Producer Studio")

## 1. Vision
L'objectif est de fournir aux producteurs (agriculteurs, porteurs de projets) une interface **ultra-simplifiée**, mobile-first, pour documenter la vie de leurs projets sans friction.
Ce n'est PAS le dashboard admin complexe (`apps/web`), mais un outil focalisé sur la **création de contenu rapide** ("Story-telling").

---

## 2. Fonctionnalités Clés (MVP)

### 2.1. "Snap & Update" (Fonction Principale)
*   **Action :** Le producteur prend une photo de son champ/ruche/équipe.
*   **Enrichissement :** Il ajoute une légende courte (ex: "Première récolte de miel de l'année !").
*   **Tagging :** Il sélectionne le projet concerné (si plusieurs) et le type d'update (Maintenance, Récolte, Impact).
*   **Publication :** En un clic, l'update est publiée sur le feed des investisseurs.

### 2.2. "Impact Dashboard" (Motivation)
*   Vue simple montrant :
    *   Nombre d'investisseurs qui le suivent.
    *   Total des fonds levés via MTC.
    *   Derniers commentaires des soutiens (pour répondre rapidement).

### 2.3. "Direct Message" (Optionnel V2)
*   Possibilité de répondre aux questions des investisseurs majeurs ou des guildes.

---

## 3. Architecture Technique

### 3.1. Frontend (PWA)
*   **Stack :** React 19 (Même stack que web-client), Tailwind CSS.
*   **Hébergement :** Sous-domaine dédié (ex: `studio.make-the-change.com`) ou route protégée dans `apps/web` (`/studio`).
*   **UX :** Design type "Instagram Stories" ou "Twitter Composer". Gros boutons, upload image optimisé.

### 3.2. Backend (Supabase)
*   **Table Cible :** `investment.project_updates`.
*   **Storage :** Bucket `project-updates-images`.
*   **Sécurité :** RLS strict. Un producteur ne peut poster QUE sur ses propres projets.

### 3.3. API Endpoints
*   `POST /api/producer/updates` : Création d'un post (multipart/form-data pour image + json).
*   `GET /api/producer/stats` : Récupération des métriques simples.

---

## 4. Maquettes (Wireframes textuels)

**Écran 1 : Accueil**
```
[ Bonjour, Pierre ! ]
[ Vos Projets : Ruches de Bretagne ]

GROS BOUTON [+] "Nouvelle Update"

Dernières activités :
- Alice a aimé votre update d'hier
- Commentaire de Bob : "Bravo !"
```

**Écran 2 : Création (Overlay)**
```
[ Zone Preview Photo ]
( Bouton "Prendre Photo" / "Galerie" )

[ Champ Texte : "Quoi de neuf ?" ]

[ Selecteur Type : 🛠 Maintenance | 🍯 Récolte | 🌱 Plantation ]

[ BOUTON PUBLIER ]
```
