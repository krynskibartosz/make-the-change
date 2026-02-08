# Analyse Approfondie de la Base de Données

Ce document présente une vue d'ensemble de la structure de la base de données actuelle, classée par schéma fonctionnel.

## 1. Schéma `public` (Données Générales & Utilisateurs)

| Table | Description | Colonnes Clés |
|-------|-------------|---------------|
| **profiles** | Profils utilisateurs unifiés | `id`, `email`, `first_name`, `last_name`, `user_level`, `points_balance` |
| **countries** | Référentiel des pays | `code`, `name_fr`, `name_en` |
| **languages** | Langues supportées | `code`, `name` |
| **producer_messages** | Messagerie producteurs | `sender_user_id`, `producer_id`, `message` |
| **security_fixes_log** | Audit sécurité | `fix_type`, `status` |

## 2. Schéma `commerce` (E-commerce)

| Table | Description | Colonnes Clés |
|-------|-------------|---------------|
| **products** | Catalogue produits | `id`, `slug`, `price_points`, `stock_quantity`, `producer_id` |
| **categories** | Catégories hiérarchiques | `id`, `slug`, `parent_id`, `name_i18n` |
| **orders** | Commandes clients | `id`, `user_id`, `total_points`, `status`, `shipping_address` |
| **order_items** | Lignes de commande | `order_id`, `product_id`, `quantity`, `unit_price_points` |
| **subscriptions** | Abonnements récurrents | `user_id`, `status`, `next_billing_date` |

## 3. Schéma `investment` (Investissement Participatif)

| Table | Description | Colonnes Clés |
|-------|-------------|---------------|
| **producers** | Producteurs partenaires | `id`, `slug`, `type` (farmer, etc.), `location` |
| **projects** | Projets à financer | `id`, `slug`, `target_budget`, `current_funding`, `producer_id` |
| **investments** | Investissements utilisateurs | `user_id`, `project_id`, `amount_points` |
| **project_updates** | Actualités des projets | `project_id`, `title`, `content`, `type` |
| **species** | Espèces liées (Biodex) | `scientific_name`, `common_name` |
| **user_unlocked_species** | Espèces débloquées | `user_id`, `species_id` |

## 4. Schéma `content` (CMS & Média)

| Table | Description | Colonnes Clés |
|-------|-------------|---------------|
| **blog_posts** | Articles de blog | `title`, `slug`, `content`, `author_id` |
| **blog_authors** | Auteurs | `name`, `bio`, `user_id` |
| **blog_categories** | Catégories blog | `name`, `slug` |
| **media_assets** | Gestionnaire de fichiers | `storage_path`, `mime_type`, `width`, `height` |
| **media_relations** | Liens médias polymorphes | `media_asset_id`, `entity_type`, `entity_id` |

## 5. Schéma `finance` (Comptabilité)

| Table | Description | Colonnes Clés |
|-------|-------------|---------------|
| **accounts** | Comptes comptables | `code`, `name`, `type` |
| **journal_entries** | Écritures journal | `account_id`, `debit`, `credit` |

## 6. Schéma `ledger` (Transactions Points)

| Table | Description | Colonnes Clés |
|-------|-------------|---------------|
| **points_transactions** | Historique points | `user_id`, `amount`, `type`, `reference_id` |

## 7. Schéma `identity` (Auth & RGPD)

| Table | Description | Colonnes Clés |
|-------|-------------|---------------|
| **user_consents** | Consentements RGPD | `user_id`, `consent_type`, `agreed` |
| **user_roles** | RBAC (Rôles) | `user_id`, `role` |

---

### Statistiques Rapides

- **Utilisateurs** : ~50+ profils
- **Produits** : ~40+ références
- **Projets** : ~10+ projets actifs
- **Commandes** : Historique généré
