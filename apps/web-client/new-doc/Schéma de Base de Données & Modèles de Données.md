Schéma de Base de Données & Modèles de Données
Ce document définit la structure des données pour l'application. Il est optimisé pour une implémentation avec PostgreSQL et un ORM comme Prisma ou Drizzle.
1. Entités Principales
Table: User (Utilisateurs)
Champ
Type
Description
 
id
UUID / String
Clé primaire.
username
String
Nom d'utilisateur unique.
email
String
Email unique.
faction
Enum
SYLVA, MELLI, ONDINE.
impact_points
Int
Points pour la boutique (solde actuel).
seeds
Int
Graines pour le BioDex (solde actuel).
streak_days
Int
Nombre de jours consécutifs.
last_login
DateTime
Pour le calcul des streaks.

Table: Project (Projets de conservation)
Champ
Type
Description
 
id
UUID / String
Clé primaire.
title
String
Ex: "Ruchers d'Antsirabe".
description
Text
Détails du projet.
location
String
Lieu géographique.
goal_amount
Decimal
Objectif financier total (en EUR).
current_amount
Decimal
Montant récolté.
partner_id
String
Lien vers l'organisation (ex: Ilanga Nature).
main_species_id
String
Lien vers l'espèce protégée par ce projet.

Table: Species (BioDex)
Champ
Type
Description
 
id
UUID / String
Clé primaire.
name
String
Ex: "Abeille Noire".
rarity
Enum
COMMON, RARE, EPIC, LEGENDARY.
origin
String
Ex: "Madagascar".
image_url
String
Lien vers l'asset 3D / Illustration.

Table: UserSpecies (Relation Many-to-Many)
Cette table suit quelles espèces l'utilisateur a débloquées et leur niveau d'évolution.
user_id : Référence User.
species_id : Référence Species.
level : Int (Niveau d'évolution de l'espèce pour cet utilisateur).
unlocked_at : DateTime.
2. Relations et Logique
Dons : Chaque don crée une entrée dans une table Donations, met à jour Project.current_amount et incrémente User.impact_points.
Déblocage : La complétion d'un don sur un projet vérifie si l'utilisateur possède déjà la main_species_id liée. Sinon, elle l'ajoute à UserSpecies.
