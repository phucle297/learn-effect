import { Context, Effect } from "effect";
import { PokeApiUrl } from "./poke-api-url.context";

export class BuildPokeApiUrl extends Context.Tag("BuildPokeApiUrl")<
  BuildPokeApiUrl,
  ({ name }: { name: string }) => string
>() {
  static readonly Live = Effect.gen(function* () {
    const pokeApiUrl = yield* PokeApiUrl; // 👈 Create dependency
    return BuildPokeApiUrl.of(({ name }) => `${pokeApiUrl}/${name}`);
  });
}
