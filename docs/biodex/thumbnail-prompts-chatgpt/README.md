# BioDex Thumbnail Prompts for ChatGPT

This folder is a copy-paste kit for generating only the missing BioDex species thumbnails in ChatGPT.

Canonical source used for the species list:

- `apps/web-client/src/lib/mock/mock-biodex.ts`
- `apps/web-client/src/lib/mock/mock-ids.ts`

Existing thumbnail source folder:

- `apps/web-client/public/images/species-thumbnails/`

Important count note:

- The current code contains 31 `MOCK_SPECIES` entries.
- There are already 13 thumbnail files in `apps/web-client/public/images/species-thumbnails/`.
- This kit contains 17 prompt files for missing unique thumbnail images.
- The 31 species entries map to 30 unique thumbnail image targets because the two Acropora entries can reuse the same thumbnail.

Recommended workflow:

1. Create or reuse the ChatGPT project/folder named `BioDex Thumbnails`.
2. Paste `00-project-instructions.md` as the project-level instruction/context.
3. Do not attach a reference file unless you explicitly want to; the prompts are self-contained.
4. Use one file from `species/` per chat.
5. Generate one square image at a time.
6. Save approved images into `apps/web-client/public/images/species-thumbnails/` with the exact target filename.
7. Use `04-asset-manifest.md` to track what is existing, missing, generated, or reused.

Do not regenerate thumbnails marked as `Exists` unless a human explicitly rejects the existing asset.

