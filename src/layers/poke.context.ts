import { Context, Effect, Schema } from "effect";
import { FetchError, JsonError } from "../services/poke.exception";
import { Pokemon } from "../services/poke.schema";
import { BuildPokeApiUrl } from "./build-poke.context";
import { PokemonCollection } from "./poke-collection.context";

const make = {
  getPokemon: Effect.gen(function* () {
    const pokemonCollection = yield* PokemonCollection;
    const buildPokeApiUrl = yield* BuildPokeApiUrl;

    const requestUrl = buildPokeApiUrl({ name: pokemonCollection[0] });

    const response = yield* Effect.tryPromise({
      try: () => fetch(requestUrl),
      catch: () => new FetchError(),
    });

    if (!response.ok) {
      return yield* new FetchError();
    }

    const json = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: () => new JsonError(),
    });

    return yield* Schema.decodeUnknown(Pokemon)(json);
  }),
};

export class PokeApi extends Context.Tag("PokeApi")<PokeApi, typeof make>() {
  static readonly Live = PokeApi.of(make);
}
