// Paystack's local-transaction fee schedule (confirmed from their pricing page,
// 19 Oct 2026): 1.5% + ₦100, with the ₦100 flat fee waived under ₦2,500, and
// the total fee capped at ₦2,000 no matter how large the transaction.
//
// IMPORTANT: this is charged ONCE per checkout (the whole cart), not once per
// item. getDisplayPrice() grosses up each item's price individually so every
// product card shows the exact amount a customer pays for THAT item alone —
// which means a multi-item cart's total collects slightly more than the bare
// minimum needed to cover the one real transaction fee (the ₦100 portion
// effectively "stacks" across items here). That's a deliberate, safe
// trade-off: you always net at least your listed prices, never less, and
// every price shown to a customer is honest about what they'll pay for it.
// If you'd rather charge the fee exactly once per cart instead, the fee
// would need to move to the checkout total instead of each item — ask if you
// want that version instead.

const FEE_RATE = 0.015;
const FEE_FLAT = 100;
const FEE_WAIVER_THRESHOLD = 2500; // flat ₦100 is waived below this charged amount
const FEE_CAP = 2000; // fee never exceeds this, regardless of amount

/** The fee Paystack actually deducts from a given charged amount. */
export const computePaystackFee = (chargedAmount: number): number => {
  const flat = chargedAmount < FEE_WAIVER_THRESHOLD ? 0 : FEE_FLAT;
  const fee = chargedAmount * FEE_RATE + flat;
  return Math.min(fee, FEE_CAP);
};

/**
 * Given the amount you want to actually NET (your listed product price),
 * returns the amount to charge the customer so that, after Paystack takes
 * their fee, you receive at least `netAmount`. Rounded up to the nearest
 * naira, so you're never left short by a rounding error.
 *
 * Uses a closed-form estimate first, then nudges it up in a short loop to
 * guarantee correctness across the fee schedule's threshold and cap
 * boundaries (where a plain formula alone can land a naira or two short).
 */
export const getDisplayPrice = (netAmount: number): number => {
  if (netAmount <= 0) return netAmount;

  // Closed-form guess, assuming the uncapped, flat-fee-included regime
  // (true for most realistic product prices).
  let charged = Math.ceil((netAmount + FEE_FLAT) / (1 - FEE_RATE));

  // Verify, and nudge up if the real (possibly capped, possibly waived) fee
  // schedule means this guess doesn't actually net enough. At most a few
  // iterations — the fee schedule is piecewise-linear, so this converges
  // immediately in practice.
  for (let i = 0; i < 5; i++) {
    const net = charged - computePaystackFee(charged);
    if (net >= netAmount) break;
    charged += Math.ceil(netAmount - net);
  }

  return charged;
};

/** Sums getDisplayPrice() across cart lines — what the customer is actually charged. */
export const getDisplayTotal = (
  lines: { netPrice: number; quantity: number }[],
): number =>
  lines.reduce(
    (sum, line) => sum + getDisplayPrice(line.netPrice) * line.quantity,
    0,
  );
