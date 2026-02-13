# FAMATrivial

Rapid-fire FAMAT regional practice web app inspired by the workflow of amctrivial.com.

## Local development

```bash
npm install
npm run dev
```

## GitHub Pages deployment

This repository is configured for static export + GitHub Pages:

- `next.config.mjs` uses `output: 'export'`.
- `.github/workflows/deploy-pages.yml` builds and deploys the `out/` folder to Pages.

### One-time repository settings

1. In GitHub repo settings, open **Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` to trigger deployment.

The action automatically sets the correct base path based on the repository name.
