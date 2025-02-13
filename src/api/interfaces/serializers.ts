interface Serializer<T> {
  serialize(data: T): string;
  deserialize(data: string): T;
}

export default Serializer;
