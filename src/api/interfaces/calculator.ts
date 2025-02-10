import { Chess } from '../chess';

interface Calculator<T> {
  calculate(chess: Chess): T;
}

export default Calculator;
