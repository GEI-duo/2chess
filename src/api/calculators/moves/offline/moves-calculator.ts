import { Chess } from '@/api/chess';
import Calculator from '@/api/interfaces/calculator';

class MovesCalculator implements Calculator<Moves> {
  calculate(chess: Chess): Moves {
    throw new Error('Method not implemented.');
  }
}

export default MovesCalculator;
