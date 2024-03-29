import { CreateRound, Round } from '../interfaces/iRound';
import { api } from '../providers/api';

const createRound = (input: CreateRound) => api.post<Round>('/round', input);

export const RoundService = {
    createRound,
};
