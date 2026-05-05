# Sai — Women's Fashion & Cosmetics Affiliate Site

A premium, Kylie Cosmetics-inspired affiliate marketing storefront for dresses and cosmetics. No checkout — every "Shop Now" routes through a branded redirect modal to partner URLs.

## Design System

- **Palette**: blush pink primary, nude/beige secondary, rose gold accents, black/white neutrals. Wired into `src/styles.css` as semantic tokens (oklch).
- **Typography**: Playfair Display (headings), Inter (body), loaded via Google Fonts in `__root.tsx`.
- **Aesthetic**: generous whitespace, soft shadows, 1:1 product imagery with pink-toned editorial feel, smooth fade/scale hover transitions.
- **Components**: shadcn (already installed) — Button, Card, Dialog, Sheet, Carousel, Badge, Slider, Checkbox, Select, Input.

## Routes (file-based, TanStack Start)

```
src/routes/
  __root.tsx              header + footer shell, fonts, providers
  index.tsx               homepage
  shop.$category.tsx      /shop/dresses, /shop/cosmetics, /shop/new, /shop/sale
  shop.$category.$sub.tsx /shop/cosmetics/lipsticks etc.
  product.$id.tsx         full product page
  wishlist.tsx
  about.tsx
  policies.returns.tsx
  policies.privacy.tsx
  policies.terms.tsx
  contact.tsx
```

Each route gets its own `head()` metadata (title, description, og tags).

## Key Features

### 1. Header / Nav
Sticky, translucent on scroll. Logo (Sai wordmark) · Categories dropdown (Dresses, Cosmetics, New Arrivals, Sale) · Search icon (opens command palette overlay) · Wishlist heart with badge count · Mobile hamburger → Sheet drawer.

### 2. Homepage
- Auto-rotating hero carousel (3 slides, 6s, pause on hover)
- "Trending Now" — 8-product grid
- "Shop Dresses" / "Shop Cosmetics" — category tile rows
- "Why Shop with Sai" — 3 trust badges
- "New Arrivals" — horizontal scroll carousel
- Newsletter signup (10% off hook)
- Footer with affiliate disclaimer

### 3. Category Listing
Breadcrumb · title + count · filter sidebar (price slider, brand checkboxes, color swatches, size, rating) · sort dropdown · grid/list toggle · responsive grid (4/3/2 cols) · load-more pagination. Filters mirror to URL search params for shareable links.

### 4. Product Card
1:1 image with hover swap to second angle · brand (uppercase) · name · price + strikethrough original · star rating + review count · SALE/NEW badge · wishlist heart top-right · "Quick View" button on hover.

### 5. Quick View + Product Page
- **Quick View** = Dialog with image carousel, price, rating, short desc, color/size selector, "Shop Now" CTA, wishlist, share, "View Full Details" link.
- **Full Product Page** expands with description, ingredients/size-guide tab, "You May Also Like" carousel, curated reviews.

### 6. Affiliate Redirect Modal
Clicking any "Shop Now" opens a Dialog: partner logo · "You're being redirected to our trusted partner" · 3-second countdown · "Continue Now" / "Cancel" buttons. Opens partner URL in new tab with `rel="sponsored noopener"`. Fires a tracking event (window-level, ready for GA wiring later).

### 7. Wishlist
Persisted in `localStorage` via a small Zustand store + custom hook. Wishlist page shows grid, remove button, share link (copies URL with encoded ids), empty state.

### 8. Static Pages
About Sai, Return & Refund (affiliate-clarified: returns via partners), Privacy, Terms, Contact (form posts to a server function stub).

## Data

A static catalog seeded in `src/data/products.ts` (~40–60 products spanning all categories) with: id, name, brand, category, subcategory, price, originalPrice, images[], rating, reviewCount, colors[], sizes[], description, ingredients/sizeGuide, affiliateUrl, partnerName, badges. Easy to swap for a CMS/DB later.

## Technical Notes

- All client-side (no Lovable Cloud needed for v1) — wishlist in localStorage, newsletter form just shows a toast.
- Filter/sort logic runs on the client over the static catalog.
- Carousels use shadcn `carousel.tsx` (embla).
- Images sourced from Unsplash with consistent pink-toned aesthetic (or generated placeholders).
- All affiliate links go through a single `<AffiliateLink>` component to keep redirect UX consistent.
- Accessibility: focus rings, alt text, keyboard-navigable dialogs, reduced-motion respect.

## Out of Scope (v1)

- Real auth / user accounts
- Real reviews ingestion (curated/static for now)
- Real Instagram embed (placeholder grid)
- Analytics provider wiring (event hooks ready, no GA key)
- Email capture backend (toast confirmation only)

These can be added later by enabling Lovable Cloud + AI Gateway.
