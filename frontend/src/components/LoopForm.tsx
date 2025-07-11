import { useState, FormEvent, ChangeEvent, MouseEvent, ReactElement } from 'react';

import { PlaceCategory } from '@src/utils/enums';
import { createLoopsRequest } from '@src/api/loops.api';

export const LoopForm = (): ReactElement => {
  const [city, setCity] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState<Set<PlaceCategory>>(new Set());
  const [numberOfLoopsToGenerate, setNumberOfLoopsToGenerate] = useState(1);

  const handleCityChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCity(event.target.value);
  };

  const handleMonthlyBudgetChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setMonthlyBudget(Number(event.target.value));
  };

  const handleNumberOfLoopsToGenerateChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setNumberOfLoopsToGenerate(Number(event.target.value));
  };

  // Curry to consume the category and return a handler
  const handleCategoryClick =
    (category: PlaceCategory) =>
    (event: MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      toggleCategory(category);
    };

  const toggleCategory = (category: PlaceCategory): void => {
    setSelectedCategories((oldSet) => {
      const newSet = new Set(oldSet);
      newSet.has(category) ? newSet.delete(category) : newSet.add(category);
      return newSet;
    });
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();

    createLoopsRequest({
      city,
      monthlyBudget,
      selectedCategories: Array.from(selectedCategories),
      numberOfLoopsToGenerate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96 space-y-4">
      <div>
        <label className="block text-sm font-medium">City</label>
        <input
          value={city}
          onChange={handleCityChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Monthly Budget</label>
        <input
          type="number"
          min={0}
          value={monthlyBudget}
          onChange={handleMonthlyBudgetChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Categories</label>
        <div className="flex gap-2 flex-wrap">
          {Object.values(PlaceCategory).map((category) => (
            <button
              type="button"
              key={category}
              onClick={handleCategoryClick(category)}
              className={`px-2 py-1 border rounded ${
                selectedCategories.has(category) ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {category}
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
          value={numberOfLoopsToGenerate}
          onChange={handleNumberOfLoopsToGenerateChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};
