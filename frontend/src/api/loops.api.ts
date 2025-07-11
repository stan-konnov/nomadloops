import { api } from '@src/api/axios';
import { ApiRoutes } from '@src/api/routes';
import { BaseApiResponseDto } from '@src/types/dtos/base/base.api.response';
import { CreateLoopsRequestDto } from '@src/types/dtos/create.loops.request';

export const createLoopsRequest = async (
  payload: CreateLoopsRequestDto,
): Promise<BaseApiResponseDto> => {
  return (await api.post(ApiRoutes.LOOPS, payload)) as BaseApiResponseDto;
};
