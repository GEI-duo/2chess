import { token } from 'brandi';
import Calculator from '../interfaces/calculator';

const TOKENS = {
  MovesCalculator: token<Calculator<Moves>>('MovesCalculator'),
  ScoresCalculator: token<Calculator<Number>>('ScoresCalculator'),
};

export default TOKENS;
