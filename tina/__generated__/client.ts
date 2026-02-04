import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '5b0181250d6fb31db28f8ed856aca0747a284915', queries,  });
export default client;
  