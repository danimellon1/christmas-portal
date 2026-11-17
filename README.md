# Dani's Christmas Portal

A static, responsive Christmas wishlist experience for GitHub Pages.

## Files
- `index.html` — page structure
- `styles.css` — design and responsive styling
- `script.js` — screens, filters, budget paths, snowfall and surprise picker
- `wishlist-data.js` — **the only file you need to edit for wishlist content**

## Before publishing
Open `wishlist-data.js` and replace the sample gift ideas with Dani's actual wishlist. Add product URLs, image URLs if wanted, and set favourites/priorities.

## Publish on GitHub Pages
1. Sign in at https://github.com and create a new **public** repository, e.g. `christmas-portal`.
2. Upload all four files to the repository's top/root level (not inside another folder).
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**, then Save.
6. Wait a minute or two. GitHub displays the public website URL in the Pages section. Share that URL with family.

## Update the wishlist after publishing
1. Open the GitHub repository and click `wishlist-data.js`.
2. Click the pencil icon (**Edit this file**).
3. Edit only the `gifts` array. Keep the object format and commas intact.
4. Click **Commit changes**. GitHub Pages republishes automatically, usually within a minute or two.
5. Refresh the public website. If an old version appears, hard-refresh or wait briefly for caching.

### Add a gift
Copy one complete gift object inside the `gifts: [ ... ]` array, paste it with a comma separating it from its neighbours, then change the fields:
- `id`: unique short identifier (letters, numbers and hyphens)
- `name`, `description`: what the item is
- `category`: one of the six categories listed in the file comments
- `priority`: `Top`, `High`, `Medium` or `Low`
- `priceBand`: `small`, `medium`, `big` or `any`
- `link`: full product URL, or `""` if you don't have one
- `image`: direct image URL, or `""` to show the emoji
- `emoji`: fallback icon
- `favorite`: `true` or `false`

To remove a gift, delete its entire object (including the comma needed to separate surrounding objects). To update a link or priority, change just that field.

**Budget note:** the price bands are broad suggestions, not exact prices. The budget choice filters items by `priceBand`; an item marked `any` appears in every budget.

## Important
- GitHub Pages is static hosting. Wishlist data is public to anyone with the URL/repository access; don't put private information in it.
- Use full `https://...` product and image URLs. Image links should point directly to an image file or a stable image CDN URL.
- Google Fonts are an optional external font dependency; the page still has fallback fonts if they are unavailable.
- This starter includes sample ideas, not a finished personal gift list. Replace them before sharing.


## Automatic seasonal closing
The visitor experience automatically switches to a "That's a wrap!" page at **12:00 a.m. Pacific time on December 27, 2026**. The portal remains available through December 26. This is a front-end expiry: it hides the wishlist in the normal website experience, but it does not delete the hosted files or make the URL return a server-level 404. Anyone with direct access to the public repository or raw files could still inspect them.
