# Family seed images for example generation

Place **3** family photos here to generate style examples (Renaissance, Baroque, Victorian, etc.):

- **family1** — first example in each style
- **family2** — second example
- **family3** — third example

Use any of: `family1.jpg`, `family1.jpeg`, `family1.png`, `family1.avif` (and same for family2, family3).

**Tips:** Photos should show **everyone fully in frame** — no one cropped. Centered, not too zoomed in. Then run:

```bash
# Terminal 1: start the app
npm run dev

# Terminal 2: regenerate all family examples (overwrites existing)
npm run generate-family-examples -- --force
```

To regenerate only the first few styles: `npm run generate-family-examples -- --force 3`

Output goes to `public/examples/family-{styleId}-1.png`, `-2.png`, `-3.png` for each style.

**Using photos from the Bilder folder:** Copy your 3 family photos from `C:\Users\adria\Documents\Road to glory\Bilder` into this folder and name them `family1`, `family2`, `family3` (with the same file extension, e.g. .jpg).
