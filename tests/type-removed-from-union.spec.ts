import { gql } from "./testkit";

test("safe: removed type from union and type is not used in inline fragment", () => {
  expect({
    before: gql`
      type Query {
        user: User
      }

      union User = Customer | Admin

      type Customer {
        name: String
      }

      type Admin {
        id: ID!
      }
    `,
    after: gql`
      type Query {
        user: User
      }

      union User = Customer

      type Customer {
        name: String
      }
    `,
    query: gql`
      {
        user {
          ... on Customer {
            name
          }
        }
      }
    `,
    mocks: {
      User: () => ({ __typename: "Customer", name: "Jeff" }),
    },
  }).toBeSafe();
});

// This used to be breaking...
test("safe: removed type from union and type is used in inline fragment", () => {
  expect({
    before: gql`
      type Query {
        user: User
      }

      union User = Customer | Admin

      type Customer {
        name: String
      }

      type Admin {
        id: ID!
      }
    `,
    after: gql`
      type Query {
        user: User
      }

      union User = Customer

      type Customer {
        name: String
      }
    `,
    query: gql`
      {
        user {
          ... on Customer {
            name
          }
          ... on Admin {
            id
          }
        }
      }
    `,
    mocks: {
      User: () => ({ __typename: "Customer", name: "Jeff" }),
    },
  }).toBeSafe();
});
