# Schema.org Key Types

## Person
**Source:** [https://schema.org/Person](https://schema.org/Person)
**Parent:** `Thing`

Represents a person (living, dead, undead, or fictional).
**Key Properties:**
*   `givenName`, `familyName`
*   `email`, `telephone`
*   `jobTitle`, `worksFor` (Organization)
*   `address` (PostalAddress)
*   `birthDate`, `deathDate`
*   `colleague`, `knows` (Person)
*   `image` (ImageObject or URL)

## Place
**Source:** [https://schema.org/Place](https://schema.org/Place)
**Parent:** `Thing`

Entities that have a somewhat fixed, physical extension.
**Key Properties:**
*   `address` (PostalAddress)
*   `geo` (GeoCoordinates or GeoShape)
*   `telephone`
*   `photo`
*   `map`
*   `containsPlace` / `containedInPlace` (Hierarchy of places)

## LocalBusiness
**Source:** [https://schema.org/LocalBusiness](https://schema.org/LocalBusiness)
**Parent:** `Place`, `Organization`

A particular physical business or branch of an organization. Examples: Restaurant, Branch of a bank, Medical practice.
**Key Properties:**
*   `openingHours`
*   `priceRange`
*   `currenciesAccepted`, `paymentAccepted`
*   `address`, `geo` (Inherited from Place)
*   `telephone`, `email` (Inherited from Organization)

## Product
**Source:** [https://schema.org/Product](https://schema.org/Product)
**Parent:** `Thing`

Any offered product or service. For example: a pair of shoes, a concert ticket, the rental of a car.
**Key Properties:**
*   `brand` (Brand or Organization)
*   `offers` (Offer) -> Critical for pricing and availability.
*   `aggregateRating` (AggregateRating)
*   `review` (Review)
*   `sku`, `gtin`, `mpn` (Identifiers)
*   `image`, `description`, `name`
