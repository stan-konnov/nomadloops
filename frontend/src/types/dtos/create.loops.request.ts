import { PlaceCategory } from '@src/utils/enums';

export interface CreateLoopsRequestDto {
  city: string;
  monthlyBudget: number;
  selectedCategories: PlaceCategory[];
  numberOfLoopsToGenerate: number;
}
