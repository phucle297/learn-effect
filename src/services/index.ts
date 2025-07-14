import { Effect } from "effect";
import { PokeApi } from "./poke.api";

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  return yield* pokeApi.getPokemon;
});

const runnable = program.pipe(Effect.provideService(PokeApi, PokeApi.Live));

const main = runnable.pipe(
  Effect.catchTags({
    FetchError: () => Effect.fail("Fetch error"),
    JsonError: () => Effect.fail("Json error"),
    ParseError: () => Effect.fail("Parse error"),
  }),
);

Effect.runPromise(main).then(console.log).catch(console.error);
