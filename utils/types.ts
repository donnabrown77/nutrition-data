export interface IFoodOption {
  label: string;
  value: number;
}

export type Nutrient = {
  amount: number;
  id: number;
  name: string;
  unitName: string;
};

export type Portion = {
  gramWeight: number;
  portionDescription: string;
};

export type FoodDetailProps = {
  description: string;
  nutrients: Nutrient[];
  portions: Portion[];
  foodItemID: string;
};

export type LabelNutrient = {
  nutrient: string;
  value: number;
  unitName?: string; // made this property optional so I can add it in because
  // I can't find it in the json returned from the api call
};

export interface BrandedFoodDetailProps {
  description: string;
  servingSize: string;
  ingredients: string;
  labelNutrients: LabelNutrient[];
  foodItemID: string;
}

export type DailyValue = {
  nutrient: string;
  amount: number;
};
