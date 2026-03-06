export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface Weight {
  value: number;
  unit: string;
}

export interface Package {
  trackingId: string;
  dimensions: Dimensions;
  weight: Weight;
}

export interface PackageScanEvent {
  eventId: string;
  source: string;
  timestamp: string;
  package: Package;
}
