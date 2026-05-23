import catalogue from '../../frontend/data/regional-catalogue.json' with { type: 'json' };

export default catalogue;
export const offeringCount = catalogue.offerings?.length ?? 0;

export function getCatalogue() {
  return catalogue;
}

export function getRegions() {
  return catalogue.regions ?? [];
}
