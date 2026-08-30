# Remove background from the Muse image in ComingSoon

## Goal
Make the Muse portrait blend seamlessly with the light ComingSoon background by removing its existing light-grey backdrop and rendering her as a transparent cutout.

## Steps

1. **Generate transparent Muse asset**
   - Use AI image editing on `public/avatar/muse-hero.jpg` with background removal enabled.
   - Save the result as `public/avatar/muse-hero.png` (transparent PNG).

2. **Update `src/components/thynk/ComingSoon.tsx`**
   - Change the `<img>` `src` from `/avatar/muse-hero.jpg` to `/avatar/muse-hero.png`.
   - Remove the CSS `maskImage` / `WebkitMaskImage` inline styles because the image will already have clean transparent edges.
   - Keep the atmospheric bloom, floor glow, and gentle float animation exactly as they are.

3. **Verify visually**
   - Run a production build.
   - Capture desktop and mobile screenshots of the ComingSoon page.
   - Confirm the Muse no longer shows a visible rectangular backdrop and blends with the white/blue gradient.

## Out of scope
- No changes to `styles.css` or any other component.
- No changes to the dark-themed main site (TopNav, Splash, HomeView, etc.).
