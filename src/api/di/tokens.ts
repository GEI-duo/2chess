import { token } from 'brandi';

import Serializer from '@/api//interfaces/serializers';
import { Chess } from '@/api/chess';
import Calculator from '@/api/interfaces/calculator';

export const TOKENS = {
  MovesCalculator: token<Calculator<Moves>>('MovesCalculator'),
  ScoresCalculator: token<Calculator<number>>('ScoresCalculator'),
  ChessSerializer: token<Serializer<Chess>>('ChessSerializer'),
};
