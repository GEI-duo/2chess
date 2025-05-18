import { Chess } from '@/api/chess';
import Calculator from '@/api/interfaces/calculator';

class MovesCalculator implements Calculator<Moves> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculate(chess: Chess): Moves {
    console.log(chess)
    throw new Error('Method not implemented.');
  }
}

export default MovesCalculator;
