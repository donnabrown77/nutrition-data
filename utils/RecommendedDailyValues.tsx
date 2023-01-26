import { DailyValue } from "./types";

// Calculate percent daily value of nutrient
// Source for daily values
// https://www.fda.gov/food/new-nutrition-facts-label/daily-value-new-nutrition-and-supplement-facts-labels

// "Fatty acids, total saturated": "unknown",
let dailyValues: DailyValue[] = [
  { nutrient: "Protein", amount: 50 },
  { nutrient: "Calcium,Ca", amount: 1300 },
  { nutrient: "Total Fat", amount: 78 },
  { nutrient: "Iron, Fe", amount: 18 },
  { nutrient: "Magnesium, Mg", amount: 420 },
  { nutrient: "Phosphorus, P", amount: 1520 },
  { nutrient: "Potassium, K", amount: 4700 },
  { nutrient: "Sodium, Na", amount: 2300 },
  { nutrient: "Zinc, Zn", amount: 11 },
  { nutrient: "Copper, Cu", amount: 0.9 },
  { nutrient: "Vitamin C, total ascorbic acid", amount: 90 },
  { nutrient: "Vitamin A, RAE", amount: 900 },
  { nutrient: "Vitamin E", amount: 15 },
  { nutrient: "Cholesterol", amount: 300 },
  { nutrient: "Carbohydrate", amount: 275 },
  { nutrient: "Added Sugars", amount: 50 },
  { nutrient: "Saturated Fat", amount: 20 },
  { nutrient: "Trans Fat", amount: 2.2 },
  { nutrient: "Fiber", amount: 28 },
  { nutrient: "Calories", amount: 2000 },
];

/**
 * Calculate percent daily value of specific nutrient
 * @param nutrient
 * @param amount
 * @returns precent daily value
 */
export default function percentDailyValue(nutrient: string, amount: number) {
  let percentDV = 0;

  let dailyValue: DailyValue[] = dailyValues.filter((dv) => {
    let trimmedNutrient = nutrient.trim();
    if (trimmedNutrient.includes(dv.nutrient)) {
      return dv.nutrient;
    } else if (dv.nutrient.includes(trimmedNutrient)) {
      return dv.nutrient;
    }
    return null;
  });

  // (food amount value ÷ daily value) × 100 = % DV
  if (dailyValue.length > 0) {
    percentDV = (amount / dailyValue[0].amount) * 100;
    // round number to two places behind the decimal point
    percentDV = Math.round((percentDV + Number.EPSILON) * 100) / 100;
  }
  return percentDV;
}

export const asteriksText =
  "The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet.  2000 calories a day is used for general nutrition advice.";
