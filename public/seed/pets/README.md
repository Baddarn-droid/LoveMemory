# Pet seed images for example generation

Place **3** seed photos here to generate style examples (Renaissance, Baroque, Rococo, etc.):

- **pet1** — e.g. cat (first example in each style)
- **pet2** — e.g. horse (second example)
- **pet3** — e.g. dachshund (third example)

Use any of: `pet1.jpg`, `pet1.jpeg`, `pet1.png` (and same for pet2, pet3).

**Tips:** Photos should be **centered**, **not too zoomed in**, and show the full pet clearly.

**Regenerate all example images** (needs dev server running and `OPENAI_API_KEY` in `.env.local`):

```bash
# Terminal 1: start the app
npm run dev

# Terminal 2: regenerate all 60 examples (overwrites existing)
npm run generate-pet-examples -- --force
```

To regenerate only the first few styles: `npm run generate-pet-examples -- --force 3`

Output goes to `public/examples/pets-{styleId}-1.png`, `-2.png`, `-3.png` for each style.
