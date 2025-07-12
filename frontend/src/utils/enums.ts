/* eslint-disable no-unused-vars */

export enum PlaceCategory {
  // Apartments, hostels, Airbnbs
  LIVING = 'living',

  // Coworking spaces and cafes with Wi-Fi
  WORKING = 'working',

  // Laundromats
  LAUNDRY = 'laundry',

  // Gyms
  TRAINING = 'training',

  // Metro, bus stations, scooter rentals
  TRANSPORT = 'transport',

  // ATMs, bank branches, currency exchange
  BANKING_FINANCE = 'banking_finance',

  // Grocery stores and supermarkets
  GROCERY_SHOPPING = 'grocery_shopping',

  // Clinics, pharmacies, spas
  HEALTHCARE_WELLNESS = 'healthcare_wellness',

  // Police, fire stations, consulates
  EMERGENCY_ESSENTIALS = 'emergency_essentials',
}

export enum LoopsGenerationStatus {
  // Loops are ready
  READY = 'ready',

  // Loops generation failed
  ERROR = 'error',

  // Loops generation is in progress
  GENERATING = 'generating',
}
