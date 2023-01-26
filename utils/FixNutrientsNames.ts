function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Adjust nutrient names to be more readable.
 * @param name
 * @returns adjusted name
 */
export default function fixNutrientName(name: string) {
  // nutrients have inconsistent names
  // create a consistent name for certain nutrients
  name = capitalizeFirstLetter(name);

  // add space before "Fat" as in saturated Fat
  if (name === "SaturatedFat") name = "Saturated Fat";
  // if nutrient name contains fat, replace with Total Fat
  else if (name.includes("Total lipid")) name = "Total Fat";
  // if nutrient name contains Fatty acids, total staturated, replace with Saturated Fat
  else if (name.includes("Fatty acids")) name = "Saturated Fat";
  else if (name === "Energy") name = "Calories";
  else if (name.includes("Calcium")) name = "Calcium";
  else if (name.includes("Vitamin E")) name = "Vitamin E";
  else if (name.includes("Carbohydrate")) name = "Carbohydrate";
  else if (name === "AddedSugar") name = "Added Sugar";
  return name;
}
