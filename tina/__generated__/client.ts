import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '17130ba255ca53fd13a54d085638127cde4a4bf2', queries,  });
export default client;
  