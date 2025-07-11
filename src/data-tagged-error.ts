import { Console, Data, Effect } from "effect";

class FetchError extends Data.TaggedError("FetchError")<{
  customMessage?: string;
}> {}
class JsonError extends Data.TaggedError("JsonError")<{}> {}

const fetchRequest = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co22/api/v2/pokemon/garchomp/"),
  catch: (): FetchError =>
    new FetchError({ customMessage: "Failed to fetch data" }),
});

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json() as Promise<Record<string, unknown>>,
    catch: (): JsonError => new JsonError(),
  });

// const main = fetchRequest.pipe(
//   Effect.flatMap(jsonResponse),
//   Effect.catchTag("FetchError", () => Effect.succeed("Fetch error")),
//   Effect.catchTag("JsonError", () => Effect.succeed("Json error")),
// );

const main = fetchRequest.pipe(
  Effect.filterOrFail(
    (response) => response.ok,
    (): FetchError => new FetchError({ customMessage: "Response not ok" }),
  ),
  Effect.flatMap(jsonResponse),
  Effect.catchTags({
    FetchError: (err) => Effect.succeed(err.customMessage),
    JsonError: () => Effect.succeed("Json error"),
  }),
  Effect.tap(Console.log),
);

Effect.runPromise(main);
