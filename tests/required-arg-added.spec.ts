import { gql } from "./testkit";

test("safe: arg added but field is not selected", () => {
  expect({
    before: gql`
      type Query {
        used: String
        foo: String
      }
    `,
    after: gql`
      type Query {
        used: String
        foo(required: Boolean!): ID
      }
    `,
    query: gql`
      {
        used
      }
    `,
  }).toBeSafe();
});

test("safe: adding a new non-nullable argument with default value", () => {
  expect({
    before: gql`
      type Query {
        words: [String]
      }
    `,
    after: gql`
      type Query {
        words(len: Int! = 2): [String]
      }
    `,
    query: gql`
      {
        words
      }
    `,
  }).toBeSafe();
});
