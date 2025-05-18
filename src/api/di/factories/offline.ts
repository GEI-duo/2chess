import MovesCalculator from '@/api/calculators/moves/offline/moves-calculator';
import ScoresCalculator from '@/api/calculators/scores/offline/scores-calculator';
import { Chess } from '@/api/chess';
import Calculator from '@/api/interfaces/calculator';
import Serializer from '@/api/interfaces/serializers';
import FenSerializer from '@/api/serializers/fen';

class Factory {
  public readonly _moves_calculator: Calculator<Moves>;
  public readonly _scores_calculator: Calculator<number>;
  public readonly _chess_serializer: Serializer<Chess>;

  constructor() {
    this._moves_calculator = new MovesCalculator();
    this._scores_calculator = new ScoresCalculator();
    this._chess_serializer = new FenSerializer();
  }

  public moves_calculator(): () => Calculator<Moves> {
    return () => this._moves_calculator;
  }

  public scores_calculator(): () => Calculator<number> {
    return () => this._scores_calculator;
  }

  public chess_serializer(): () => Serializer<Chess> {
    return () => this._chess_serializer
  }
}

export default Factory;
