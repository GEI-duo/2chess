import { Container } from 'brandi';
import { TOKENS } from './tokens';

import Factory from './factories/offline';

const factory = new Factory();
const container = new Container();

container
  .bind(TOKENS.MovesCalculator)
  .toInstance(factory.moves_calculator())
  .inSingletonScope();

container
  .bind(TOKENS.ScoresCalculator)
  .toInstance(factory.scores_calculator())
  .inSingletonScope();

container
  .bind(TOKENS.ChessSerializer)
  .toInstance(factory.chess_serializer())
  .inSingletonScope();

function inject(key: any) {
  return container.get(key);
}

export { inject };
