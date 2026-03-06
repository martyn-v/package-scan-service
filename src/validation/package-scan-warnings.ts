import { PackageScanEvent } from '../models/package-scan';

const MIN_DIMENSION = 5;
const MAX_HEIGHT = 500;

/**
 * Checks a valid package scan event for absurd dimension values.
 * @param event - The validated event to check for warnings.
 * @returns An array of warning messages.
 */
export function checkDimensionWarnings(event: PackageScanEvent): string[] {
  const warnings: string[] = [];
  const { length, width, height } = event.package.dimensions;

  if (length < MIN_DIMENSION) {
    warnings.push(`"package.dimensions.length" value ${length} is suspiciously small (< ${MIN_DIMENSION})`);
  }
  if (width < MIN_DIMENSION) {
    warnings.push(`"package.dimensions.width" value ${width} is suspiciously small (< ${MIN_DIMENSION})`);
  }
  if (height < MIN_DIMENSION) {
    warnings.push(`"package.dimensions.height" value ${height} is suspiciously small (< ${MIN_DIMENSION})`);
  }
  if (height > MAX_HEIGHT) {
    warnings.push(`"package.dimensions.height" value ${height} exceeds ${MAX_HEIGHT}`);
  }

  return warnings;
}
