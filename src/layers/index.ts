import { Effect } from "effect";
import { BuildPokeApiUrl } from "./build-poke.context";
import { PokeApiUrl } from "./poke-api-url.context";
import { PokemonCollection } from "./poke-collection.context";
import { PokeApi } from "./poke.context";

export const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  return yield* pokeApi.getPokemon;
});

const runnable = program.pipe(
  Effect.provideService(PokeApi, PokeApi.Live),
  Effect.provideService(PokemonCollection, PokemonCollection.Live),
  Effect.provideServiceEffect(BuildPokeApiUrl, BuildPokeApiUrl.Live),
  Effect.provideServiceEffect(PokeApiUrl, PokeApiUrl.Live),
);

Effect.runPromise(runnable).then(console.log);
