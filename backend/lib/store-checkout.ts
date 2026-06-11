import { defaultStoreCatalog } from '@pms/site-content/store';
import { toStripeCurrency, toStripeMinorUnits } from '@/lib/regional-checkout-price';

export function getStoreProductById(productId: string) {
  const catalog = defaultStoreCatalog();
  return catalog.products.find((p) => p.id === productId && p.visible) ?? null;
}

export function resolveStoreCheckoutPrice(productId: string) {
  const product = getStoreProductById(productId);
  if (!product) return null;

  const currency = toStripeCurrency(product.currency || 'USD');
  const unitAmount = toStripeMinorUnits(product.price, currency);

  return {
    product,
    currency,
    unitAmount,
    display: product.displayPrice,
  };
}
