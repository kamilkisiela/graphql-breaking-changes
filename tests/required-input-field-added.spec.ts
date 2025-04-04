import { gql } from "./testkit";

test("safe: field using input is not selected", () => {
  expect({
    before: gql`
      type Query {
        document: String
        foo: String
      }
    `,
    after: gql`
      type Query {
        document(id: ID!): String
        foo: String
      }
    `,
    query: gql`
      {
        foo
      }
    `,
  }).toBeSafe();
});

test("breaking: field using input is selected", () => {
  expect({
    before: gql`
      type Query {
        document: String
      }
    `,
    after: gql`
      type Query {
        document(id: ID!): String
      }
    `,
    query: gql`
      {
        document
      }
    `,
  }).not.toBeSafe();
});
