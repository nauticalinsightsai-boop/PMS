declare const catalogue: {
  meta?: {
    overview?: {
      recommendedMessage?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  regions?: unknown[];
  offerings?: unknown[];
  [key: string]: unknown;
};

export default catalogue;
export declare const offeringCount: number;
export declare function getCatalogue(): typeof catalogue;
export declare function getRegions(): unknown[];
