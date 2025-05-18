import { token } from 'brandi';
import Calculator from '@/api/interfaces/calculator';
import Serializer from '@/api//interfaces/serializers';
import { Chess } from '@/api/chess';

export const TOKENS = {
  MovesCalculator: token<Calculator<Moves>>('MovesCalculator'),
  ScoresCalculator: token<Calculator<number>>('ScoresCalculator'),
  ChessSerializer: token<Serializer<Chess>>('ChessSerializer'),
};
