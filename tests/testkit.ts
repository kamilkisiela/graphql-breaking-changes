import { buildASTSchema, parse, executeSync, DocumentNode } from "graphql";
import { addMocksToSchema } from "@graphql-tools/mock";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSafe(): R;
    }
  }
}

export function gql(literals: string | readonly string[]) {
  if (typeof literals === "string") {
    return parse(literals);
  }

  return parse(literals[0]);
}

expect.extend({
  toBeSafe(received: {
    before: DocumentNode;
    after: DocumentNode;
    query: DocumentNode;
    variables?: { [key: string]: any };
  }) {
    const before = executeQuery({
      schema: received.before,
      query: received.query,
      variables: received.variables,
    });
    const after = executeQuery({
      schema: received.after,
      query: received.query,
      variables: received.variables,
    });

    const pass = !Array.isArray(before.errors) && this.equals(before, after);

    if (pass) {
      return {
        message: () => `expected to be breaking, but it was safe`,
        pass: true,
      };
    }

    return {
      message: () => `expected to be safe, but it was breaking`,
      pass: false,
    };
  },
});

function buildMockSchema(schema: DocumentNode) {
  return addMocksToSchema({ schema: buildASTSchema(schema) });
}

function executeQuery({
  query,
  schema,
  variables,
}: {
  schema: DocumentNode;
  query: DocumentNode;
  variables?: { [key: string]: any };
}) {
  return executeSync({
    schema: buildMockSchema(schema),
    document: query,
    variableValues: variables,
  });
}
