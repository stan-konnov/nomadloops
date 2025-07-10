/**
 * Base API response DTO.
 * Serves as a base for all API response DTOs.
 * Extendable to include additional fields as needed.
 */
export interface BaseApiResponseDto {
  success: boolean;
  message: string;
}
