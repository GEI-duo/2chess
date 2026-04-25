import { Chess } from '@/api/chess';
import Calculator from '@/api/interfaces/calculator';

class MovesCalculator implements Calculator<Moves> {
  calculate(chess: Chess): Moves {
    console.log(chess);
    throw new Error('Method not implemented.');
  }
}

export default MovesCalculator;
