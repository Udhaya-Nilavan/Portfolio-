/**
 * Industry-training record shape.
 *
 * Lifted verbatim from the original project's `types/builder.ts` so that
 * `data/industryTraining.ts` can stay byte-identical to the source of truth.
 */
export interface IndustryTrainingItem {
  id: string;
  title: string;
  provider: string;
  collaboration: string;
  duration: string;
  status: string;
  credentialId?: string;
  verificationUrl?: string;
  badgeImage?: string;
  certificateImage?: string;
  coreFocus: string;
  highlights: string[];
  toolsAndFrameworks: string[];
  capstoneProject?: {
    title: string;
    description: string;
    tags: string[];
  };
}
