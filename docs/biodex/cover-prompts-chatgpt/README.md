# BioDex Cover Prompts for ChatGPT

This folder is a copy-paste kit for generating BioDex species cover images in ChatGPT, one species per chat if needed.

Canonical source used for the species list:

- `apps/web-client/src/lib/mock/mock-biodex.ts`
- `apps/web-client/src/lib/mock/mock-ids.ts`
- `docs/biodex/metadata/species-index.md`

Important count note:

- The current code contains 31 `MOCK_SPECIES` entries.
- The metadata index also documents 31 BioDex species entries.
- Cover assets are keyed by scientific species name, so there are 30 unique cover filenames because two code entries currently resolve to `Acropora muricata`.
- The existing reference cover is already present at `apps/web-client/public/images/biodex/hero-apis-mellifera-unicolor.png`.

Recommended workflow:

1. Create a ChatGPT project/folder named `BioDex Covers`.
2. Paste `00-project-instructions.md` as the project-level instruction/context.
3. Add or upload the reference image `apps/web-client/public/images/biodex/hero-apis-mellifera-unicolor.png`.
4. Use one file from `species/` per chat.
5. Generate one vertical image at a time.
6. Save approved images into `apps/web-client/public/images/biodex/` with the exact target filename.
7. Use `04-asset-manifest.md` to track what is generated, reused, or still missing.

Do not regenerate the existing dioramas. They are UI assets and are not part of this cover generation workflow.

