import { gql } from "./testkit";

test("safe: type removed and is not selected", () => {
  expect({
    before: gql`
      type Query {
        foo: String
        user: User
      }

      type User {
        name: String
      }
    `,
    after: gql`
      type Query {
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

test("breaking: type removed and is selected", () => {
  expect({
    before: gql`
      type Query {
        foo: String
        user: User
      }

      type User {
        name: String
      }
    `,
    after: gql`
      type Query {
        foo: String
      }
    `,
    query: gql`
      {
        user {
          name
        }
      }
    `,
  }).not.toBeSafe();
});
