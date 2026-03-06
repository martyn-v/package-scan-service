/** Physical dimensions of a package. */
export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

/** Weight measurement of a package. */
export interface Weight {
  value: number;
  unit: string;
}

/** Package details including tracking ID, dimensions, and weight. */
export interface Package {
  trackingId: string;
  dimensions: Dimensions;
  weight: Weight;
}

/** Event payload for a package scan from an edge device. */
export interface PackageScanEvent {
  eventId: string;
  source: string;
  timestamp: string;
  package: Package;
}
