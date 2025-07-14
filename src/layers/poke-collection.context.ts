import { Context, Array } from "effect";

export class PokemonCollection extends Context.Tag("PokemonCollection")<
  PokemonCollection,
  Array.NonEmptyArray<string>
>() {
  static Live = PokemonCollection.of(["staryu", "perrserker", "flaaffy"]);
}
