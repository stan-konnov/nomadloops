import { api } from '@src/api/axios';
import { ApiRoutes } from '@src/api/routes';
import { BaseApiResponseDto } from '@src/types/dtos/base/base.api.response';
import { DataApiResponseDto } from '@src/types/dtos/base/data.api.response';
import { CreateLoopsRequestDto } from '@src/types/dtos/create.loops.request';
import { LoopsGenerationStatus } from '@src/utils/enums';

export const createLoopsRequest = async (
  payload: CreateLoopsRequestDto,
): Promise<BaseApiResponseDto> => {
  return (await api.post(ApiRoutes.LOOPS, payload)) as BaseApiResponseDto;
};

export const getLoopsStatusRequest = async (): Promise<
  DataApiResponseDto<LoopsGenerationStatus>
> => {
  return (await api.get(ApiRoutes.LOOPS_STATUS)) as DataApiResponseDto<LoopsGenerationStatus>;
};
