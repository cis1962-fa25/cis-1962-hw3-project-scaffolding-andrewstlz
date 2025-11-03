"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
describe("validatePizza", () => {
    test("accepts a valid pizza", () => {
        const res = (0, src_1.validatePizza)({
            size: 14,
            crust: "normal",
            toppings: ["pepperoni", "mushroom"],
        });
        expect(res.isPizza).toBe(true);
        if (res.isPizza) {
            const p = res.pizza;
            expect(p.size).toBe(14);
            expect(p.isDeepDish).toBe(false);
            expect(p.crust).toBe("normal");
        }
        test("accepts deep dish pizza", () => {
            const res = (0, src_1.validatePizza)({
                size: 18,
                crust: "stuffed",
                isDeepDish: true,
                toppings: ["ham", "pineapple", "cheese", "tomato"],
            });
            expect(res.isPizza).toBe(true);
            if (res.isPizza) {
                const p = res.pizza;
                expect(p.size).toBe(18);
                expect(p.crust).toBe("stuffed");
                expect(p.isDeepDish).toBe(true);
            }
        });
        test("reject too small pizza", () => {
            const res = (0, src_1.validatePizza)({
                size: 7,
                crust: "normal",
                toppings: ["raspberry"],
            });
            expect(res.isPizza).toBe(false);
        });
        test("reject too large pizza", () => {
            const res = (0, src_1.validatePizza)({
                size: 27,
                crust: "normal",
                toppings: ["raspberry"],
            });
            expect(res.isPizza).toBe(false);
        });
        test("reject invalid crust", () => {
            const res = (0, src_1.validatePizza)({
                size: 17,
                crust: "non-existent",
                toppings: ["cucumber"],
            });
            expect(res.isPizza).toBe(false);
            if (!res.isPizza)
                expect(res.errors.join("")).toMatch(/crust/i);
        });
        test("reject invalid toppings", () => {
            const res = (0, src_1.validatePizza)({
                size: 17,
                crust: "stuffed",
                toppings: ["marshmellow"],
            });
            expect(res.isPizza).toBe(false);
            if (!res.isPizza) {
                expect(res.errors.some((e) => e.includes("marshmellow"))).toBeTruthy();
            }
        });
    });
});
