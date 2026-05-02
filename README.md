# A Man and His Mower

> [manandhismower.ca](https://manandhismower.ca/)

## Project

Static marketing website for "A Man and His Mower", a family-run lawn care business in Chilliwack, BC.

Deployed via AWS S3 + CloudFront.

## Images

Images are stored in the `images/` folder. See [`images/README.md`](images/README.md) for which image goes where and recommended dimensions/formats.

## Making Changes to the Website

You can update the website directly through GitHub in your browser — no technical setup needed.

**Files you can edit freely** (changes go live automatically):
- `index.html` — all page content: text, headings, phone number, service descriptions, colours, fonts, spacing, and layout
- `images/` — all static images

**How to make a change:**
1. Open the file on GitHub (e.g. click `index.html` in the file list)
2. Click the **pencil icon** (Edit this file) in the top-right corner
3. Make your changes
4. Click **Commit changes...**, add a short note describing what you changed (e.g. `update phone number`), then click **Propose changes**
5. On the next screen click **Create pull request**, then **Merge pull request**, then **Confirm merge**

The website updates automatically within about a minute. Check [manandhismower.ca](https://manandhismower.ca) to confirm.

The GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) handles deployment automatically on push to `main`.
