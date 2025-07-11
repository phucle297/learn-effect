import { Console, Effect, pipe } from "effect";

const fetchRequest = Effect.tryPromise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
);

const jsonResponse = (response: Response) =>
  Effect.tryPromise(() => response.json());

const main = pipe(
  Effect.flatMap(fetchRequest, jsonResponse),
  Effect.tap(Console.log),
);

const main2 = fetchRequest.pipe((fetchRequestEffect) =>
  Effect.flatMap(fetchRequest, jsonResponse),
);
Effect.runPromise(main2);
