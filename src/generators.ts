import { Data, Effect } from "effect";

class FetchError extends Data.TaggedError("FetchError")<{
  customMessage?: string;
}> {}
class JsonError extends Data.TaggedError("JsonError")<{}> {}

const fetchRequest = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co22/api/v2/pokemon/garchomp/"),
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
  return data;
});

const main = program.pipe(
  Effect.catchTags({
    FetchError: (err) => Effect.succeed(err.customMessage),
    JsonError: () => Effect.succeed("Json error"),
  }),
);
Effect.runPromise(main).then(console.log);
