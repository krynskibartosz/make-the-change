# Schema.org Core Concepts

## Data Model
**Source:** [https://schema.org/docs/datamodel.html](https://schema.org/docs/datamodel.html)

The data model is generic, derived from RDF Schema (RDFS).
1.  **Types (Classes):** Arranged in a multiple inheritance hierarchy.
2.  **Properties:** 
    *   Have **Domains** (types they apply to).
    *   Have **Ranges** (expected value types).
3.  **Flexibility:**
    *   Permissions are distinct from obligations.
    *   "Some data is better than none."
    *   Properties can often accept text strings even if a specific Type is expected (Pragmatic conformance).

## The Root: Thing
**Source:** [https://schema.org/Thing](https://schema.org/Thing)

`Thing` is the most generic type of item. All other types are subclasses of `Thing`.
**Key Properties:**
*   `name`: The name of the item.
*   `description`: A description of the item.
*   `image`: An image of the item.
*   `url`: URL of the item.
*   `identifier`: The identifier property represents any kind of identifier for any kind of Thing, such as ISBNs, GTIN codes, UUIDs etc.
*   `sameAs`: URL of a reference Web page that unambiguously indicates the item's identity (e.g., Wikipedia page).

## Data Types (DataType)
**Source:** [https://schema.org/DataType](https://schema.org/DataType)

The basic data types used for literals:
*   `Text`
*   `Number` (Integer, Float)
*   `Boolean`
*   `Date`, `DateTime`, `Time`
*   `URL` (often treated as Text with specific format)

## Full Hierarchy
**Source:** [https://schema.org/docs/full.html](https://schema.org/docs/full.html)

A single page listing every Type in the Schema.org vocabulary, indented to show the subclass structure. Useful for exploring the breadth of the ontology.
