import { buildASTSchema, parse, execute, DocumentNode } from "graphql";
import { addMocksToSchema } from "@graphql-tools/mock";

export function gql(literals: string | readonly string[]) {
  if (typeof literals === "string") {
    return parse(literals);
  }

  return parse(literals[0]);
}

function buildMockSchema(schema: DocumentNode) {
  return addMocksToSchema({ schema: buildASTSchema(schema) });
}

export async function executeQuery({
  query,
  schema,
  variables,
}: {
  schema: DocumentNode;
  query: DocumentNode;
  variables?: { [key: string]: any };
}) {
  return execute({
    schema: buildMockSchema(schema),
    document: query,
    variableValues: variables,
  });
}
