/** Result of processing a package scan event. */
export interface ProcessResult {
  status: 'accepted' | 'accepted_with_warnings' | 'rejected';
  reasons?: string[];
  warnings?: string[];
}
