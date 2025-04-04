import { gql } from "./testkit";

test("safe: implemented interface removed, but implementing type keeps the selected fields", () => {
  expect({
    before: gql`
      interface User {
        id: ID!
        name: String
      }

      type Admin implements User {
        id: ID!
        name: String
        role: String
      }

      type Query {
        admin: Admin
      }
    `,
    after: gql`
      type Admin {
        id: ID!
        name: String
        role: String
      }

      type Query {
        admin: Admin
      }
    `,
    query: gql`
      {
        admin {
          id
        }
      }
    `,
  }).toBeSafe();
});

test("safe: implemented interface removed and only implemented type is used is in selection", () => {
  expect({
    before: gql`
      interface User {
        id: ID!
        name: String
      }

      type Admin implements User {
        id: ID!
        name: String
        role: String
      }

      type Query {
        user: User
      }
    `,
    after: gql`
      type Admin {
        id: ID!
        name: String
        role: String
      }

      type Query {
        user: Admin
      }
    `,
    query: gql`
      {
        user {
          ... on Admin {
            id
          }
        }
      }
    `,
  }).toBeSafe();
});

test("breaking: implemented interface removed and is used is in selection", () => {
  expect({
    before: gql`
      interface User {
        id: ID!
        name: String
      }

      type Admin implements User {
        id: ID!
        name: String
        role: String
      }

      type Query {
        user: User
      }
    `,
    after: gql`
      type Admin {
        id: ID!
        name: String
        role: String
      }

      type Query {
        user: Admin
      }
    `,
    query: gql`
      {
        user {
          ... on User {
            id
          }
        }
      }
    `,
  }).not.toBeSafe();
});
