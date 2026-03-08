/**
 * Complexity Calculation Functions
 * Handles scoring, tier determination, and price range calculations
 */

import type {
  ComplexityAnswerSelection,
  ComplexityCalculationResult,
  ComplexityQuestionWithAnswers,
  ComplexityTierRow,
} from "@/types";

/**
 * Calculate total score from answer selections
 * @param questions - List of questions with answer options
 * @param selections - Array of selected answer options (question_id, answer_option_id)
 * @returns Total score as integer
 */
export function calculateTotalScore(
  questions: ComplexityQuestionWithAnswers[],
  selections: ComplexityAnswerSelection[]
): number {
  const selectionMap = new Map(
    selections.map((s) => [s.question_id, s.answer_option_id])
  );

  let totalScore = 0;

  for (const question of questions) {
    const selectedOptionId = selectionMap.get(question.id);

    if (!selectedOptionId) {
      // Unanswered questions contribute 0 to score
      continue;
    }

    const selectedOption = question.answer_options.find(
      (opt) => opt.id === selectedOptionId
    );

    if (selectedOption) {
      totalScore += selectedOption.score;
    }
  }

  return totalScore;
}

/**
 * Determine complexity tier from score with fallback logic
 * @param score - Total complexity score
 * @param tiers - List of available tiers
 * @returns Matching tier or null if no tiers available
 */
export function determineTierByScore(
  score: number,
  tiers: ComplexityTierRow[]
): ComplexityTierRow | null {
  if (tiers.length === 0) {
    return null;
  }

  // Filter to active tiers only
  const activeTiers = tiers.filter((t) => t.is_active);

  if (activeTiers.length === 0) {
    return null;
  }

  // Find the tier whose score range contains the given score
  const matchingTier = activeTiers.find(
    (tier) => score >= tier.min_score && (tier.max_score === null || score <= tier.max_score)
  );

  if (matchingTier) {
    return matchingTier;
  }

  // Fallback: if score is below all tiers, use the lowest tier
  if (score < activeTiers[0].min_score) {
    return activeTiers[0];
  }

  // Fallback: if score is above all tiers, use the highest tier
  const sortedTiers = [...activeTiers].sort(
    (a, b) => (a.max_score || Infinity) - (b.max_score || Infinity)
  );
  return sortedTiers[sortedTiers.length - 1];
}

/**
 * Calculate price range applying multipliers
 * @param basePriceCents - Base service price in cents
 * @param tier - Complexity tier with multiplier and price range
 * @param tierOverrideMultiplier - Optional service-specific override multiplier
 * @returns Calculated price range object
 */
export function calculatePriceRange(
  basePriceCents: number,
  tier: ComplexityTierRow | null,
  tierOverrideMultiplier: number | null = null
): {
    minPriceCents: number;
    maxPriceCents: number;
    multiplier: number;
  } {
  if (!tier) {
    // Fallback: use 1.0 multiplier if no tier
    return {
      minPriceCents: basePriceCents,
      maxPriceCents: basePriceCents,
      multiplier: 1.0,
    };
  }

  const effectiveMultiplier = tierOverrideMultiplier ?? tier.multiplier;

  const basePrice = Math.round(basePriceCents * effectiveMultiplier);

  let minPriceCents: number;
  let maxPriceCents: number;

  if (tier.base_min_price_cents !== null && tier.base_max_price_cents !== null) {
    // Use tier's base price range
    minPriceCents = tier.base_min_price_cents;
    maxPriceCents = tier.base_max_price_cents;
  } else if (tier.base_min_price_cents !== null) {
    // Only min price set, calculate max as percentage above min
    minPriceCents = tier.base_min_price_cents;
    maxPriceCents = Math.round(tier.base_min_price_cents * 1.2);
  } else if (tier.base_max_price_cents !== null) {
    // Only max price set, calculate min as percentage below max
    maxPriceCents = tier.base_max_price_cents;
    minPriceCents = Math.round(tier.base_max_price_cents / 1.2);
  } else {
    // No base price range set, use calculated price
    minPriceCents = Math.round(basePrice * 0.9);
    maxPriceCents = Math.round(basePrice * 1.1);
  }

  return {
    minPriceCents,
    maxPriceCents,
    multiplier: effectiveMultiplier,
  };
}

/**
 * Validate tier score ranges for admin configuration
 * Detects overlaps and gaps in tier configurations
 * @param tiers - List of all configured tiers
 * @returns Validation result with overlaps and gaps
 */
export function validateTierScoreRanges(tiers: ComplexityTierRow[]): {
  valid: boolean;
  overlaps: Array<{
    tier1: string;
    tier2: string;
    range: string;
  }>;
  gaps: Array<{
    startScore: number;
    endScore: number;
  }>;
  warnings: string[];
} {
  const activeTiers = tiers.filter((t) => t.is_active);

  if (activeTiers.length === 0) {
    return {
      valid: false,
      overlaps: [],
      gaps: [],
      warnings: ["No active complexity tiers configured"],
    };
  }

  const overlaps: Array<{ tier1: string; tier2: string; range: string }> = [];
  const gaps: Array<{ startScore: number; endScore: number }> = [];
  const warnings: string[] = [];

  // Sort tiers by min_score
  const sortedTiers = [...activeTiers].sort(
    (a, b) => a.min_score - b.min_score
  );

  // Check for overlaps and gaps
  for (let i = 0; i < sortedTiers.length - 1; i++) {
    const current = sortedTiers[i];
    const next = sortedTiers[i + 1];

    const currentMax = current.max_score ?? Infinity;
    const nextMin = next.min_score;

    // Check for overlap
    if (currentMax >= nextMin) {
      overlaps.push({
        tier1: current.name,
        tier2: next.name,
        range: `${current.min_score}-${currentMax} overlaps with ${nextMin}-${next.max_score ?? "∞"}`,
      });
      warnings.push(
        `Tier "${current.name}" and "${next.name}" have overlapping score ranges`
      );
    }

    // Check for gaps
    if (currentMax < nextMin - 1) {
      const gapStart = currentMax + 1;
      const gapEnd = nextMin - 1;
      gaps.push({
        startScore: gapStart,
        endScore: gapEnd,
      });
      warnings.push(
        `Scores ${gapStart}-${gapEnd} are not covered by any tier`
      );
    }
  }

  // Check if tier 0 has a gap before it
  if (sortedTiers[0].min_score > 1) {
    gaps.push({
      startScore: 1,
      endScore: sortedTiers[0].min_score - 1,
    });
    warnings.push(
      `Scores 1-${sortedTiers[0].min_score - 1} are not covered by any tier`
    );
  }

  return {
    valid: overlaps.length === 0,
    overlaps,
    gaps,
    warnings,
  };
}

/**
 * Validate calculation on server for order submission
 * Recalculates score and tier to ensure client-side calculation wasn't manipulated
 * @param questions - List of questions with answer options
 * @param selections - Client-provided answer selections
 * @param expectedScore - Client-provided total score
 * @param expectedTierId - Client-provided tier ID
 * @returns Validation result
 */
export function validateCalculationOnServer(
  questions: ComplexityQuestionWithAnswers[],
  selections: ComplexityAnswerSelection[],
  expectedScore: number,
  expectedTierId: string | null,
  tiers: ComplexityTierRow[]
): {
  valid: boolean;
  actualScore: number;
  actualTierId: string | null;
  errors: string[];
} {
  const errors: string[] = [];

  // Recalculate score
  const actualScore = calculateTotalScore(questions, selections);

  if (actualScore !== expectedScore) {
    errors.push(
      `Score mismatch: client reported ${expectedScore}, server calculated ${actualScore}`
    );
  }

  // Determine correct tier
  const actualTier = determineTierByScore(actualScore, tiers);
  const actualTierId = actualTier?.id ?? null;

  if (actualTierId !== expectedTierId) {
    errors.push(
      `Tier mismatch: client reported ${expectedTierId}, server determined ${actualTierId}`
    );
  }

  return {
    valid: errors.length === 0,
    actualScore,
    actualTierId,
    errors,
  };
}
