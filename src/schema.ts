import { Data, Effect, Schema } from "effect";

const Pokemon = Schema.Struct({
  id: Schema.Number,
  order: Schema.Number,
  name: Schema.String,
  height: Schema.Number,
  weight: Schema.Number,
  weightErr: Schema.String,
});

class PokemonClass extends Schema.Class<PokemonClass>("PokemonClass")({
  id: Schema.Number,
  order: Schema.Number,
  name: Schema.String,
  height: Schema.Number,
  weight: Schema.Number,
}) {}

const decodePokemon = Schema.decodeUnknown(PokemonClass);

class FetchError extends Data.TaggedError("FetchError")<{
  customMessage?: string;
}> {}
class JsonError extends Data.TaggedError("JsonError")<{}> {}

const fetchRequest = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
  catch: () => new FetchError({ customMessage: "Failed to fetch data" }),
});

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json() as Promise<Record<string, unknown>>,
    catch: () => new JsonError(),
  });

const program = Effect.gen(function* () {
  const response = yield* fetchRequest;
  if (!response.ok) {
    yield* new FetchError({
      customMessage: `HTTP error! status: ${response.status}`,
    });
  }
  const data = yield* jsonResponse(response);
  return yield* decodePokemon(data);
});

const main = program.pipe(
  Effect.catchTags({
    FetchError: (err) => Effect.succeed(err.customMessage),
    JsonError: () => Effect.succeed("Json error"),
    ParseError: (err) => Effect.succeed(err.message),
  }),
);
Effect.runPromise(main).then(console.log);
