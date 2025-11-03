import { z } from "zod";

const NEVER_TOPPINGS = new Set([
  "marshmellow",
  "chocolate",
  "apple",
  "vinegar",
  "carrot",
  "potato",
]);

const CRUST_VALUES = ["stuffed", "normal"] as const;

export const crustSchema = z.enum(CRUST_VALUES, {
  message: 'crust must be "stuffed" or "normal"',
});

/**
 * Pizza schema
 */
export const pizzaSchema = z.object({
  size: z
    .number()
    .min(8, "diameter must be at least 8 inches")
    .max(20, "diameter must not exceed 20 inches"),
  crust: crustSchema,
  isDeepDish: z.boolean().default(false),
  toppings: z
    .array(z.string())
    .optional()
    .superRefine((arr, ctx) => {
      if (!arr) return;
      for (let i = 0; i < arr.length; i++) {
        const t = arr[i];
        if (NEVER_TOPPINGS.has(t)) {
          ctx.addIssue({
            code: "custom",
            path: [i],
            message: `"${t}" should never go on pizza`,
          });
        }
      }
    }),
});

/**
 * Define pizza type in TypeScript
 */
export type Pizza = z.infer<typeof pizzaSchema>;

/**
 * Discriminated union
 */
export type PizzaValidationResult =
  | { isPizza: true; pizza: Pizza }
  | { isPizza: false; errors: string[] };

/**
 * Validation function to be called
 */
export function validatePizza(input: unknown): PizzaValidationResult {
  const result = pizzaSchema.safeParse(input);

  if (result.success) {
    return { isPizza: true, pizza: result.data };
  }

  const errors = result.error.issues.map((e) => {
    const path = e.path.length ? e.path.join(".") : "(root)";
    return `${path}: ${e.message}`;
  });

  return { isPizza: false, errors };
}
