import MovesCalculator from '@/api/calculators/moves/offline/moves-calculator';
import ScoresCalculator from '@/api/calculators/scores/offline/scores-calculator';
import Calculator from '@/api/interfaces/calculator';

class Factory {
  public readonly _moves_calculator: Calculator<Moves>;
  public readonly _scores_calculator: Calculator<Number>;

  constructor() {
    this._moves_calculator = new MovesCalculator();
    this._scores_calculator = new ScoresCalculator();
  }

  public moves_calculator(): () => Calculator<Moves> {
    return () => this._moves_calculator;
  }

  public scores_calculator(): () => Calculator<Number> {
    return () => this._scores_calculator;
  }
}

export default Factory;
