import { Effect, Console } from "effect";

const fetchRequest = Effect.tryPromise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
);

const jsonResponse = (response: Response) =>
  Effect.tryPromise(() => response.json());

const main = fetchRequest.pipe(
  Effect.catchTag("UnknownException", () =>
    Effect.succeed("An unknown error occurred while fetching the data."),
  ),
  Effect.tap(Console.log),
);

Effect.runPromise(main);
