import { useState, FormEvent, ChangeEvent, MouseEvent, ReactElement } from 'react';

import { LoopsGenerationStatus, PlaceCategory } from '@src/utils/enums';
import { useLoopsPlannerStore } from '@src/store/loops.planner.store';

export const LoopsForm = (): ReactElement => {
  const {
    city,
    setCity,
    monthlyBudget,
    setMonthlyBudget,
    selectedCategories,
    setSelectedCategories,
    numberOfLoopsToGenerate,
    setNumberOfLoopsToGenerate,
    loopsGenerationStatus,
  } = useLoopsPlannerStore();

  const [localCityName, setLocalCityName] = useState(city);
  const [localMonthlyBudget, setLocalMonthlyBudget] = useState(monthlyBudget);
  const [localSelectedCategories, setLocalSelectedCategories] = useState(selectedCategories);
  const [localNumberOfLoopsToGenerate, setLocalNumberOfLoopsToGenerate] =
    useState(numberOfLoopsToGenerate);

  const handleCityChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLocalCityName(event.target.value);
  };

  const handleMonthlyBudgetChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLocalMonthlyBudget(Number(event.target.value));
  };

  const handleNumberOfLoopsToGenerateChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLocalNumberOfLoopsToGenerate(Number(event.target.value));
  };

  // Curry to consume the category and return a handler
  const handleCategoryClick =
    (category: PlaceCategory) =>
    (event: MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      toggleCategory(category);
    };

  const toggleCategory = (category: PlaceCategory): void => {
    const newSet = new Set(localSelectedCategories);
    newSet.has(category) ? newSet.delete(category) : newSet.add(category);
    setLocalSelectedCategories(newSet);
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setCity(localCityName);
    setMonthlyBudget(localMonthlyBudget);
    setSelectedCategories(localSelectedCategories);
    setNumberOfLoopsToGenerate(localNumberOfLoopsToGenerate);
  };

  const isFormValid =
    localMonthlyBudget > 0 &&
    localCityName.trim() !== '' &&
    localSelectedCategories.size > 0 &&
    localNumberOfLoopsToGenerate >= 1 &&
    localNumberOfLoopsToGenerate <= 3 &&
    loopsGenerationStatus !== LoopsGenerationStatus.GENERATING;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96 space-y-4">
      <div>
        <label className="block text-sm font-medium">City Name</label>
        <input
          value={localCityName}
          onChange={handleCityChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Monthly Budget</label>
        <input
          type="number"
          min={0}
          value={localMonthlyBudget}
          onChange={handleMonthlyBudgetChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Categories</label>
        <div className="flex flex-col gap-2">
          {Object.values(PlaceCategory).map((category) => (
            <button
              type="button"
              key={category}
              onClick={handleCategoryClick(category)}
              className={`px-2 py-1 border rounded ${
                localSelectedCategories.has(category) ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {/** Convert enum values to human readable format */}
              {category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Number of Loops to Generate</label>
        <input
          type="number"
          min={1}
          max={3}
          value={localNumberOfLoopsToGenerate}
          onChange={handleNumberOfLoopsToGenerateChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={!isFormValid}
        className={`w-full py-2 rounded 
    ${
      !isFormValid
        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
        : 'bg-blue-600 text-white hover:bg-blue-700'
    }`}
      >
        Submit
      </button>
    </form>
  );
};
