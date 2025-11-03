"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pizzaSchema = exports.crustSchema = void 0;
exports.validatePizza = validatePizza;
const zod_1 = require("zod");
const NEVER_TOPPINGS = new Set([
    "marshmellow",
    "chocolate",
    "apple",
    "vinegar",
    "carrot",
    "potato",
]);
const CRUST_VALUES = ["stuffed", "normal"];
exports.crustSchema = zod_1.z.enum(CRUST_VALUES, {
    message: 'crust must be "stuffed" or "normal"',
});
/**
 * Pizza schema
 */
exports.pizzaSchema = zod_1.z.object({
    size: zod_1.z
        .number()
        .min(8, "diameter must be at least 8 inches")
        .max(20, "diameter must not exceed 20 inches"),
    crust: exports.crustSchema,
    isDeepDish: zod_1.z.boolean().default(false),
    toppings: zod_1.z
        .array(zod_1.z.string())
        .optional()
        .superRefine((arr, ctx) => {
        if (!arr)
            return;
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
 * Validation function to be called
 */
function validatePizza(input) {
    const result = exports.pizzaSchema.safeParse(input);
    if (result.success) {
        return { isPizza: true, pizza: result.data };
    }
    const errors = result.error.issues.map((e) => {
        const path = e.path.length ? e.path.join(".") : "(root)";
        return `${path}: ${e.message}`;
    });
    return { isPizza: false, errors };
}
