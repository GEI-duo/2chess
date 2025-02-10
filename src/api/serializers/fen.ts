import { Chess } from '../chess';
import Serializer from '../interfaces/serializers';

class FenSerializer implements Serializer<Chess> {
  serialize(data: Chess): string {
    throw new Error('Method not implemented.');
  }
  deserialize(fen: string): Chess {
    throw new Error('Method not implemented.');
  }
}
