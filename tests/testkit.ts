import { buildASTSchema, parse, executeSync, DocumentNode } from "graphql";
import { addMocksToSchema, IMocks } from "@graphql-tools/mock";
import { expect } from "@jest/globals";

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
  toBeSafe: function (received: {
    before: DocumentNode;
    after: DocumentNode;
    query: DocumentNode;
    variables?: { [key: string]: any };
    mocks?: IMocks;
  }) {
    const before = executeQuery({
      schema: received.before,
      query: received.query,
      variables: received.variables,
      mocks: received.mocks,
    });
    const after = executeQuery({
      schema: received.after,
      query: received.query,
      variables: received.variables,
      mocks: received.mocks,
    });

    const pass = !Array.isArray(before.errors) && this.equals(before, after);

    if (pass) {
      return {
        message: () =>
          `expected to be breaking, but it was safe.\n\n${this.utils.printDiffOrStringify(
            before,
            after,
            "Before",
            "After",
            true
          )}`,
        pass: true,
      };
    }

    return {
      message: () =>
        `expected to be safe, but it was breaking\n\n${this.utils.printDiffOrStringify(
          before,
          after,
          "Before",
          "After",
          true
        )}`,
      pass: false,
    };
  },
});

function buildMockSchema(schema: DocumentNode, mocks?: IMocks) {
  return addMocksToSchema({
    schema: buildASTSchema(schema),
    mocks: {
      Boolean: () => true,
      ID: () => "3ba6c565-9c41-4e57-8afe-26e11ffa312d",
      ...(mocks ?? {}),
    },
  });
}

function executeQuery({
  query,
  schema,
  variables,
  mocks,
}: {
  schema: DocumentNode;
  query: DocumentNode;
  variables?: { [key: string]: any };
  /**
   * Used if you need to return a specific value for the test cases to match consistently. e.g. for unions or enums
   * See https://the-guild.dev/graphql/tools/docs/mocking#customizing-mocks
   */
  mocks?: IMocks;
}) {
  return executeSync({
    schema: buildMockSchema(schema, mocks),
    document: query,
    variableValues: variables,
  });
}
