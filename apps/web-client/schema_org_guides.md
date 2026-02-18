# Schema.org Guides & Advanced Topics

## Style Guide
**Source:** [https://schema.org/docs/styleguide.html](https://schema.org/docs/styleguide.html)

Specific conventions for Schema.org authoring:
1.  **Types:** Use **TitleCase** (e.g., `Event`, `Person`).
    *   Singular naming only (e.g., `Person` not `People`).
2.  **Properties:** Use **camelCase** (e.g., `image`, `datePublished`).
    *   Do not give the same name to a type and a property.
3.  **Terms:**
    *   Prepositions come AFTER the term name (e.g., `memberOf`, `reservationFor`).
    *   Avoid abbreviations (e.g., `numberOfTracks` preferred over `numTracks`).
    *   US English spelling (e.g., `color` not `colour`).

## For Developers
**Source:** [https://schema.org/docs/developers.html](https://schema.org/docs/developers.html)

Schema.org provides machine-readable representations:
*   **Formats:** Data is available in RDF/Turtle, JSON-LD, and CSV.
*   **JSON-LD:** This is the preferred format for web implementation.
*   **Definitions:** Full vocabulary definition files are available for download (including `schemaorg-current-https.jsonld`).
    *   **Link:** [https://schema.org/version/latest/schemaorg-current-https.jsonld](https://schema.org/version/latest/schemaorg-current-https.jsonld)
    *   Contains the complete definition of all terms in the vocabulary.

## Data and Datasets
**Source:** [https://schema.org/docs/data-and-datasets.html](https://schema.org/docs/data-and-datasets.html)

Schema.org is extensively used to describe datasets, particularly in scientific and government open data.
**Key Types:**
*   `Dataset`: A body of structured information describing some topic(s) of interest.
*   `DataCatalog`: A collection of datasets.
*   `DataDownload`: A specific downloadable form of a dataset.

**Usage:**
*   Used by Google Dataset Search.
*   Integrating statistical observations via `StatisticalPopulation` and `Observation`.
