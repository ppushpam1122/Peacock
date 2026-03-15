# 🦚 Peacock — Clothing Catalog

A modern, static clothing storefront built with **Next.js 16** and **Tailwind CSS**.  
No backend. No database. No login. Just JSON files, static pages, and WhatsApp ordering.

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Project Structure](#2-project-structure)
3. [Configuration](#3-configuration)
   - [WhatsApp Number](#31-whatsapp-number)
   - [Brand Name & Colors](#32-brand-name--colors)
   - [Announcement Bar & Promo Code](#33-announcement-bar--promo-code)
   - [Navigation Links](#34-navigation-links)
4. [Managing the Catalog](#4-managing-the-catalog)
   - [Product Data Structure](#41-product-data-structure)
   - [Adding a Product](#42-adding-a-product)
   - [Adding Multiple Images](#43-adding-multiple-images)
   - [Adding a New Category](#44-adding-a-new-category)
   - [Featured Products](#45-featured-products)
   - [Sale / Discount Pricing](#46-sale--discount-pricing)
5. [Editing Components](#5-editing-components)
   - [Navbar](#51-navbar)
   - [Footer](#52-footer)
   - [Hero Section](#53-hero-section)
   - [Product Card](#54-product-card)
   - [Size & Color Selectors](#55-size--color-selectors)
6. [Deploying to GitHub Pages](#6-deploying-to-github-pages)
   - [First-Time Setup](#61-first-time-setup)
   - [Every Subsequent Deploy](#62-every-subsequent-deploy)
   - [Custom Domain (Optional)](#63-custom-domain-optional)
7. [Common Issues & Fixes](#7-common-issues--fixes)

---

## 1. Quick Start

> **Requirement:** Node.js version **20.9.0 or higher**  
> Check yours: `node -v`  
> Download: https://nodejs.org

```bash
# Clone or extract the project, then:
cd peacock

# Install dependencies
npm install

# Start development server
npm run dev
# → Open http://localhost:3000
```

To create a production build:
```bash
npm run build
# Generates a static /out folder ready for any hosting platform
```

---

## 2. Project Structure

```
peacock/
├── public/
│   └── products/               ← Product images go here
│       ├── TSHIRT-001/
│       │   ├── 1.jpg           ← Main image
│       │   └── 2.jpg           ← Gallery image
│       └── SHIRT-001/
│           └── 1.jpg
│
├── src/
│   ├── components/             ← Reusable UI pieces
│   │   ├── Navbar.jsx          ← Top navigation bar
│   │   ├── ProductCard.jsx     ← Grid card (image + name + price)
│   │   ├── ProductGallery.jsx  ← Image viewer on product page
│   │   ├── ColorSelector.jsx   ← Color swatch picker
│   │   ├── SizeSelector.jsx    ← Size button grid
│   │   └── Breadcrumb.jsx      ← Home > Clothing > T-Shirts > ...
│   │
│   ├── data/
│   │   ├── taxonomy.json       ← Category hierarchy + nav menu
│   │   └── catalog/
│   │       ├── tshirts.json    ← All T-shirt products
│   │       └── shirts.json     ← All shirt products
│   │
│   ├── lib/
│   │   ├── catalogLoader.js    ← Loads & merges all catalog files
│   │   └── productUtils.js     ← Helpers: pricing, images, WhatsApp link
│   │
│   ├── pages/
│   │   ├── index.jsx           ← Homepage
│   │   ├── clothing/
│   │   │   ├── index.jsx       ← All products page
│   │   │   └── [category].jsx  ← Dynamic category page
│   │   └── product/
│   │       └── [slug].jsx      ← Dynamic product detail page
│   │
│   └── styles/
│       └── globals.css         ← Global styles + Tailwind imports
│
├── next.config.js              ← Next.js configuration
├── tailwind.config.js          ← Tailwind theme (colors, fonts)
├── package.json                ← Dependencies
└── jsconfig.json               ← Path aliases (@/ = src/)
```

---

## 3. Configuration

### 3.1 WhatsApp Number

**File:** `src/pages/product/[slug].jsx`

Find this line near the top of the file (around line 10):

```js
const WHATSAPP_NUMBER = '919999999999';
```

Replace with your number in **international format — no `+` sign**:

| Country | Format | Example |
|---------|--------|---------|
| India   | `91` + 10-digit number | `919876543210` |
| UAE     | `971` + 9-digit number | `971501234567` |
| UK      | `44` + 10-digit number | `447911123456` |

When a customer clicks "Order on WhatsApp", they will receive a pre-filled message like:
```
Hi, I want to order:
Product: Classic Cotton Tee
Color: Black
Size: M
Price: ₹699
```

---

### 3.2 Brand Name & Colors

**To change the brand name** — do a find-and-replace across the whole project:
- Find: `PEACOCK`
- Replace with: `YOUR BRAND`

Then update the logo in `src/components/Navbar.jsx` (line ~40):
```jsx
// Before
PEACOCK<span className="text-teal-600">.</span>

// After — example for a brand called "NOVA"
NOVA<span className="text-teal-600">.</span>
```

**To change the accent color** — open `tailwind.config.js`:
```js
// Current: teal
// To change to, say, amber — replace every occurrence of teal with amber
// in tailwind.config.js AND in src/styles/globals.css
```

Tailwind color options: `rose`, `amber`, `violet`, `sky`, `emerald`, `orange`, `indigo`  
Full list: https://tailwindcss.com/docs/customizing-colors

---

### 3.3 Announcement Bar & Promo Code

**File:** `src/components/Navbar.jsx` — look for this block near the top:

```jsx
<div className="bg-neutral-900 text-white text-center py-2 text-xs tracking-widest uppercase">
  Free shipping on orders above ₹999 &nbsp;·&nbsp; Use code{' '}
  <span className="text-teal-400 font-semibold">PEACOCK10</span> for 10% off
</div>
```

Edit the text, promo code, or shipping threshold directly here.  
To **hide** the announcement bar entirely, delete that `<div>` block.

---

### 3.4 Navigation Links

**File:** `src/data/taxonomy.json`

The `"nav"` array controls the desktop and mobile menu links:

```json
"nav": [
  { "label": "New Arrivals", "href": "/clothing" },
  { "label": "T-Shirts",    "href": "/clothing/tshirts" },
  { "label": "Shirts",      "href": "/clothing/shirts" },
  { "label": "Sale",        "href": "/clothing" }
]
```

To add a link, append a new object. To remove one, delete its line.  
The `href` must match an existing page route.

---

## 4. Managing the Catalog

### 4.1 Product Data Structure

Each product is a JSON object. Here is every available field explained:

```json
{
  "id": "TSHIRT-001",
  
  "name": "Classic Cotton Tee",
  
  "slug": "classic-cotton-tee",
  
  "category": "tshirts",
  
  "subcategory": "casual",
  
  "price": 699,
  
  "originalPrice": 999,
  
  "featured": true,
  
  "description": "Full product description shown on the product page.",
  
  "material": "100% Ring-Spun Cotton, 220 GSM",
  
  "fit": "Regular Fit",
  
  "images": ["1.jpg", "2.jpg", "3.jpg"],
  
  "colors": [
    {
      "name": "Jet Black",
      "hex": "#1a1a1a",
      "sizes": {
        "XS":  false,
        "S":   true,
        "M":   true,
        "L":   true,
        "XL":  true,
        "XXL": false
      }
    }
  ]
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique ID. Also the name of the image folder in `public/products/` |
| `name` | ✅ | Display name shown on cards and product pages |
| `slug` | ✅ | URL-friendly name. Must be unique. No spaces, use hyphens |
| `category` | ✅ | Must match a category `id` in `taxonomy.json` |
| `subcategory` | ❌ | Optional sub-grouping (not used in routing) |
| `price` | ✅ | Current selling price in ₹ (integer) |
| `originalPrice` | ❌ | If set, shows a strikethrough price and discount % badge |
| `featured` | ❌ | `true` = appears in the Featured section on homepage |
| `description` | ❌ | Paragraph shown on product detail page |
| `material` | ❌ | Shown in the product spec table |
| `fit` | ❌ | Shown in the product spec table |
| `images` | ✅ | Array of filenames from the product's image folder |
| `colors` | ✅ | Array of color objects (see below) |

**Each color object:**

| Field | Description |
|-------|-------------|
| `name` | Display name (shown when color is selected) |
| `hex` | Hex color code for the swatch circle |
| `sizes` | Object mapping size → `true` (in stock) or `false` (out of stock) |

---

### 4.2 Adding a Product

**Step 1 — Create the image folder**

```
public/
└── products/
    └── TSHIRT-005/       ← folder name = product ID
        └── 1.jpg
```

**Step 2 — Add to the catalog JSON**

Open `src/data/catalog/tshirts.json` and add your product to the array:

```json
[
  { ...existing product... },
  { ...existing product... },
  {
    "id": "TSHIRT-005",
    "name": "Striped Summer Tee",
    "slug": "striped-summer-tee",
    "category": "tshirts",
    "subcategory": "casual",
    "price": 749,
    "originalPrice": null,
    "featured": false,
    "description": "A breezy striped tee perfect for summer outings.",
    "material": "100% Cotton, 180 GSM",
    "fit": "Regular Fit",
    "images": ["1.jpg"],
    "colors": [
      {
        "name": "Navy Stripe",
        "hex": "#1b2a4a",
        "sizes": {
          "XS": false, "S": true, "M": true, "L": true, "XL": false, "XXL": false
        }
      }
    ]
  }
]
```

**Step 3 — Rebuild**

```bash
npm run build
```

Your product is now live at `/product/striped-summer-tee`. ✓

> **Slug rules:** lowercase only, hyphens instead of spaces, no special characters.  
> Good: `striped-summer-tee` Bad: `Striped Summer Tee`, `striped_summer_tee`

---

### 4.3 Adding Multiple Images

Images are shown in the gallery on the product page. The first image is the thumbnail on cards.

**Step 1 — Add image files to the product folder:**

```
public/products/TSHIRT-005/
├── 1.jpg    ← main / thumbnail
├── 2.jpg    ← back view
├── 3.jpg    ← detail / close-up
└── 4.jpg    ← lifestyle shot
```

**Step 2 — List them in the `images` array in your catalog JSON:**

```json
"images": ["1.jpg", "2.jpg", "3.jpg", "4.jpg"]
```

That's it. The gallery component automatically handles thumbnails, arrows, and dot navigation.

**Recommended image specs:**

| Property | Recommended |
|----------|-------------|
| Dimensions | 600 × 750 px (portrait, 4:3 ratio) |
| Format | JPG for photos, PNG if transparency needed |
| File size | Under 200 KB per image (compress at tinypng.com) |
| Naming | Sequential numbers: `1.jpg`, `2.jpg`, `3.jpg` |

---

### 4.4 Adding a New Category

Example: adding **Hoodies** as a new category.

**Step 1 — Create the catalog file**

Create `src/data/catalog/hoodies.json`:

```json
[
  {
    "id": "HOODIE-001",
    "name": "Fleece Pullover Hoodie",
    "slug": "fleece-pullover-hoodie",
    "category": "hoodies",
    "subcategory": "casual",
    "price": 1299,
    "originalPrice": null,
    "featured": true,
    "description": "Heavyweight fleece hoodie for cold days.",
    "material": "80% Cotton, 20% Polyester, 320 GSM",
    "fit": "Relaxed Fit",
    "images": ["1.jpg"],
    "colors": [
      {
        "name": "Charcoal",
        "hex": "#3a3a3a",
        "sizes": { "XS": false, "S": true, "M": true, "L": true, "XL": true, "XXL": false }
      }
    ]
  }
]
```

**Step 2 — Register in `catalogLoader.js`**

Open `src/lib/catalogLoader.js` and add two lines:

```js
// Add this import at the top with the others
import hoodies from '@/data/catalog/hoodies.json';

// Add to the CATALOG_MAP object
const CATALOG_MAP = {
  tshirts,
  shirts,
  hoodies,   // ← add this line
};
```

**Step 3 — Add to `taxonomy.json`**

Open `src/data/taxonomy.json` and add hoodies under the appropriate parent:

```json
{
  "id": "casual",
  "label": "Casual",
  "slug": "casual",
  "children": [
    { "id": "tshirts",  "label": "T-Shirts", "slug": "tshirts",  "catalogFile": "tshirts" },
    { "id": "hoodies",  "label": "Hoodies",  "slug": "hoodies",  "catalogFile": "hoodies" }
  ]
}
```

**Step 4 — Add to the nav menu** (same file, `"nav"` array):

```json
{ "label": "Hoodies", "href": "/clothing/hoodies" }
```

**Step 5 — Add images and rebuild**

```
public/products/HOODIE-001/1.jpg
```

```bash
npm run build
```

Hoodies category is now live at `/clothing/hoodies`. ✓

---

### 4.5 Featured Products

Featured products appear in the **"Featured Pieces"** grid on the homepage.

To mark a product as featured, set `"featured": true` in its JSON entry:

```json
"featured": true
```

To remove it from the homepage grid:

```json
"featured": false
```

The homepage shows up to **4 featured products**. If you have more than 4 with `featured: true`, the first 4 from the merged catalog will be shown. To control which 4 appear, only mark exactly 4 products as featured.

---

### 4.6 Sale / Discount Pricing

To show a sale price with a strikethrough original price and a discount badge:

```json
"price": 899,
"originalPrice": 1299
```

This automatically:
- Shows `₹899` as the current price
- Shows `₹1299` with a strikethrough
- Calculates and shows a `31% OFF` badge on the card and product page

To remove a sale, set `"originalPrice": null`.

---

## 5. Editing Components

### 5.1 Navbar

**File:** `src/components/Navbar.jsx`

| What to change | Where to find it |
|----------------|-----------------|
| Logo text | Line ~40 — `PEACOCK<span ...>.</span>` |
| Announcement bar text | Lines ~30-34 — the dark `<div>` at the very top |
| Announcement bar background color | `bg-neutral-900` on that same `<div>` |
| Nav links | Edit `"nav"` in `src/data/taxonomy.json` — no JSX changes needed |
| WhatsApp number in nav icon | Line ~60 — `href="https://wa.me/919999999999"` |
| Hide announcement bar | Delete the entire dark `<div>` block (lines ~30-35) |

---

### 5.2 Footer

**File:** `src/pages/index.jsx` — scroll to the very bottom, find the `<footer>` tag.

| What to change | How |
|----------------|-----|
| Brand tagline | Edit the `<p>` inside the brand column |
| WhatsApp number | Change `href="https://wa.me/919999999999"` and the display number |
| Footer links | Edit the arrays inside the "Shop" and "Info" columns |
| Copyright text | Edit the line with `© {new Date().getFullYear()}` |
| Footer background | Change `bg-neutral-900` on the `<footer>` tag |

---

### 5.3 Hero Section

**File:** `src/pages/index.jsx` — find the `{/* ── HERO ── */}` comment.

| What to change | How |
|----------------|-----|
| Headline text | Edit the `<h1>` — three lines with `Wear What`, `Speaks`, `for You.` |
| Subheading | Edit the `<p>` below the `<h1>` |
| Stats row | Edit the `{ value, label }` objects in the stats array |
| CTA button text | Edit `Shop Collection` and `Explore T-Shirts` inside the `<Link>` tags |
| CTA button links | Change the `href` on the `<Link>` tags |
| Background color | Change `bg-neutral-900` on the `<section>` tag |
| Accent color in headline | Change `text-teal-400` on the `<em>` tag |

To use a **background image** instead of the dark gradient:

```jsx
// Replace the gradient divs inside the hero <section> with:
<div className="absolute inset-0">
  <img src="/your-hero-image.jpg" className="w-full h-full object-cover" alt="" />
  <div className="absolute inset-0 bg-black/50" /> {/* dark overlay */}
</div>
```

Place your image in the `public/` folder and reference it as `/your-hero-image.jpg`.

---

### 5.4 Product Card

**File:** `src/components/ProductCard.jsx`

The card shows: product image, color swatches, name, and price.

| What to change | How |
|----------------|-----|
| Hide color swatches | Delete the `{product.colors && ...}` block |
| Hide discount badge | Delete the `{discount && ...}` block |
| Change hover overlay text | Find `View Product` and edit it |
| Card image aspect ratio | Change `aspect-[3/4]` to e.g. `aspect-square` for square cards |
| Number of swatches shown | Change `.slice(0, 4)` to `.slice(0, 3)` or more |

---

### 5.5 Size & Color Selectors

**Color Selector** — `src/components/ColorSelector.jsx`  
**Size Selector** — `src/components/SizeSelector.jsx`

To change the **available size options** across all products, edit the `SIZE_ORDER` array in `SizeSelector.jsx`:

```js
// Default
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Example: add 3XL
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

// Example: numeric sizes
const SIZE_ORDER = ['28', '30', '32', '34', '36', '38'];
```

Then update your product JSON to use the same size keys in the `sizes` object.

---

## 6. Deploying to GitHub Pages

### 6.1 First-Time Setup

**Step 1 — Create a GitHub account**  
Go to https://github.com and sign up if you don't have an account.

**Step 2 — Create a new repository**
1. Click the **+** icon (top right) → **New repository**
2. Repository name: `peacock` (or any name you want)
3. Set to **Public**
4. Do **NOT** check "Initialize with README"
5. Click **Create repository**

**Step 3 — Install Git**  
Download from https://git-scm.com/downloads and install with default settings.  
Verify: open a new terminal and run `git --version`

**Step 4 — Connect and push your project**

Open a terminal in your `peacock` project folder:

```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit"

# Connect to your GitHub repo (replace YOUR-USERNAME and YOUR-REPO-NAME)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Step 5 — Enable GitHub Pages**
1. Go to your repository on GitHub
2. Click **Settings** tab (top menu)
3. Click **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

**Step 6 — Trigger the first deployment**

The deploy workflow runs automatically on every push. Since you just pushed in Step 4, it may already be running. Check:

1. Click the **Actions** tab in your repository
2. You should see a workflow run called **"Deploy to GitHub Pages"**
3. Wait for it to complete (green checkmark ✓) — takes about 2–3 minutes

**Step 7 — Visit your live site**

Your site will be live at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

You can also find this URL in **Settings → Pages**.

---

### 6.2 Every Subsequent Deploy

Whenever you make changes (add products, edit text, etc.), just push again:

```bash
# Stage your changes
git add .

# Commit with a message describing what you changed
git commit -m "Add 3 new T-shirts and update homepage hero text"

# Push to GitHub — deployment starts automatically
git push
```

GitHub Actions picks it up, rebuilds the site, and deploys it in ~2–3 minutes.

---

### 6.3 Custom Domain (Optional)

If you own a domain (e.g. `peacockclothing.in`), you can use it instead of the `.github.io` URL.

**Step 1 — Add a CNAME file**

Create a file named `CNAME` (no extension) in your `public/` folder with just your domain:

```
peacockclothing.in
```

**Step 2 — Configure GitHub**
1. Go to **Settings → Pages**
2. Under **Custom domain**, enter `peacockclothing.in`
3. Click **Save**

**Step 3 — Configure your domain registrar**

In your domain registrar's DNS settings, add:

| Type | Name | Value |
|------|------|-------|
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `CNAME` | `www` | `YOUR-USERNAME.github.io` |

DNS changes take 15 minutes to 48 hours to propagate.

**Step 4 — Enable HTTPS**

Once the custom domain is verified, go back to **Settings → Pages** and check **"Enforce HTTPS"**.

> **Note:** If using a subdirectory URL (`username.github.io/peacock`), you do NOT need a custom domain setup. But if you add a custom domain, remove the `basePath` and `assetPrefix` from `next.config.js` if you had them set.

---

## 7. Common Issues & Fixes

**`npm audit` shows vulnerabilities**
```bash
# Always start fresh when upgrading
rm -rf node_modules package-lock.json
npm install
```

**Images not showing on the live site**
- Make sure image filenames in JSON match exactly (case-sensitive): `1.jpg` ≠ `1.JPG`
- Images must be in `public/products/PRODUCT-ID/` where `PRODUCT-ID` matches the `id` field in JSON
- After adding images, commit and push — the live site only updates on push

**Product page returns 404**
- The `slug` in your JSON must be unique across all catalog files
- Slugs must be lowercase with hyphens only — no spaces, no uppercase
- Run `npm run build` locally first to catch errors before pushing

**Build fails on GitHub Actions**
- Click the failed run in the **Actions** tab to see the error log
- Most common cause: a JSON syntax error in a catalog file
- Validate your JSON at https://jsonlint.com

**Changes not showing after push**
- Check the **Actions** tab — the workflow might still be running
- Hard-refresh the browser: `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)
- GitHub Pages can take up to 5 minutes after a successful deploy

**Dev server crashes with module error**
```bash
rm -rf node_modules .next
npm install
npm run dev
```

**How to check your Node.js version**
```bash
node -v
# Must be v20.9.0 or higher for Next.js 16
```
