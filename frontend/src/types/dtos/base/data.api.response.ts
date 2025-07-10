import { BaseApiResponseDto } from '@src/types/dtos/base/base.api.response';

/**
 * Data API response DTO.
 * Extends BaseApiResponseDto to include a generic `data` payload.
 */
export interface DataApiResponseDto<T> extends BaseApiResponseDto {
  data?: T | null;
}
