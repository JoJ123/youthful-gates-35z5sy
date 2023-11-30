import { createServer } from "node:http";
import { createSchema, createYoga, maskError } from "graphql-yoga";
import { GraphQLError } from "graphql";

const formatError = (
  error: GraphQLError | unknown,
  message: string,
  isDev: boolean | undefined,
) => {
  let safeError = { ...(error as GraphQLError) };
  if ((safeError as any).message === "Olalalala") {
    console.warn("Warning: This is just a warning!!!");
  }
  return maskError(safeError, message, isDev);
};

// 1. Please add the schema that causes your issue here
const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      hello: String
    }
  `,
  resolvers: {
    Query: {
      hello: async (_, args) => {
        throw new Error("Olalalala");
      },
    },
  },
});

// 2. Please add the operations that causes your issue here
const defaultQuery = /* GraphQL */ `
  query Hello {
    hello
  }
`;

// 3. Please adjust the createYoga setup for the issue you are experiencing
const yoga = createYoga({
  graphiql: {
    defaultQuery,
  },
  maskedErrors: {
    isDev: true,
    maskError: formatError,
  },
  schema,
});

const server = createServer(yoga);
server.listen(4000, () => {
  console.info(
    `Server is running on http://localhost:4000${yoga.graphqlEndpoint}`,
  );
});
