import { gql } from "./testkit";

test("safe: field removed and is not selected", () => {
  expect({
    before: gql`
      type User {
        id: ID!
        name: String
      }

      type Query {
        user: User
      }
    `,
    after: gql`
      type User {
        id: ID!
      }

      type Query {
        user: User
      }
    `,
    query: gql`
      {
        user {
          id
        }
      }
    `,
  }).toBeSafe();
});
