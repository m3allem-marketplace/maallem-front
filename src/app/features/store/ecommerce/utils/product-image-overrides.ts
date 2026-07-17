/**
 * product-image-utils.ts
 *
 * Pure TypeScript utility for replacing product image URLs at runtime.
 * No static JSON, no dictionaries, no external dependencies.
 */

// ---------------------------------------------------------------------------
// CLOUDINARY URL FORMAT REFERENCE
//
// A valid Cloudinary delivery URL has this structure:
//   https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/<public_id>.<ext>
//
// Common pitfalls that produce broken images:
//   1. Missing "/image/upload/" segment in the base URL.
//   2. Wrong file extension (.jpg vs .png vs .webp).
//   3. The public_id in Cloudinary does NOT match the MongoDB _id string.
//
// Pass a fully-qualified base URL including "/image/upload/" and any
// transformation string, e.g.:
//   "https://res.cloudinary.com/my-cloud/image/upload/f_auto,q_auto/products"
//
// The function appends:  /<product._id>.jpg
// Resulting URL example:
//   "https://res.cloudinary.com/my-cloud/image/upload/f_auto,q_auto/products/60d5ecb8b392d700155e8e1a.jpg"
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// replaceImagesWithDynamicUrl
//
// Maps over the API products array and derives each product's Cloudinary URL
// by interpolating its _id into the provided base URL string.
//
// Parameters:
//   productsList  – raw products array returned by the API
//   cloudBaseUrl  – fully-qualified Cloudinary base URL including
//                   "/image/upload/", e.g.:
//                   "https://res.cloudinary.com/<cloud>/image/upload/products"
//
// Returns a new array – the original productsList is never mutated.
//
// Performance:
//   O(n) single .map() pass, zero dictionary lookups, zero side effects.
//   Safe for use inside RxJS map() operators and Angular OnPush components.
// ---------------------------------------------------------------------------
export function replaceImagesWithDynamicUrl<
  T extends { _id?: string; image?: string; imageUrl?: string }
>(productsList: T[], cloudBaseUrl: string): T[] {
  const normalizedCloudBaseUrl = cloudBaseUrl.replace(/\/$/, '');

  return productsList.map((product, index) => {
    const existingImageUrl = product.imageUrl || product.image;

    if (!product._id) {
      return product; // fallback: keep original image when _id is absent
    }

    const constructedUrl = existingImageUrl || `${normalizedCloudBaseUrl}/${product._id}.jpg`;

    // Temporary debug log: inspect the first 3 products in the browser console.
    // Remove this block once the correct URL structure is confirmed.
    if (index < 3) {
      console.log(
        `[ImageDebug] Product #${index + 1}`,
        '\n  _id          :', product._id,
        '\n  cloudBaseUrl :', cloudBaseUrl,
        '\n  Final URL    :', constructedUrl
      );
    }

    return { ...product, imageUrl: constructedUrl };
  });
}

// ---------------------------------------------------------------------------
// FALLBACK_IMAGE_URL
//
// Displayed by the (error) handler in the Angular template when a Cloudinary
// image returns 404 or fails to load.
// Replace this with any publicly accessible placeholder image URL.
// ---------------------------------------------------------------------------
export const FALLBACK_IMAGE_URL =
  'https://res.cloudinary.com/demo/image/upload/sample.jpg';
