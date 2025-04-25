/**
 * Renaming means changing the name but keeping the exact same shape.
 */

import { gql } from "./testkit";

test("breaking: changing to inclusive type, but selection is not compatible", () => {
  expect({
    before: gql`
      type Query {
        user: User
      }

      type User {
        name: String
      }
    `,
    after: gql`
      type Query {
        user: User
      }

      union User = NewUser

      type NewUser {
        name: String
      }
    `,
    query: gql`
      {
        user {
          __typename
          ... on User {
            name
          }
        }
      }
    `,
  }).not.toBeSafe();
});

test("breaking: changing type to union, query does not specify selection type, and all union members have the selection set.", () => {
  expect({
    before: gql`
      type Query {
        user: User
      }

      type User {
        name: String
      }
    `,
    after: gql`
      type Query {
        user: User
      }

      union User = NewUser

      type NewUser {
        name: String
      }
    `,
    query: gql`
      {
        user {
          name
        }
      }
    `,
    mocks: {
      User: () => ({
        __typename: "User",
        name: "Foo Bar",
      }),
      NewUser: () => ({
        __typename: "NewUser",
        name: "Foo Bar",
      }),
    },
    // because cannot query a union without a spread... Invalid operation.
  }).not.toBeSafe();
});

test("breaking: changing type to union but query does not specify selection type and field is not included in all union members", () => {
  expect({
    before: gql`
      type Query {
        user: User
      }

      type User {
        name: String
      }
    `,
    after: gql`
      type Query {
        user: User
      }

      union User = NewUser | RealUser

      type NewUser {
        name: String
      }

      type RealUser {
        foo: Boolean
      }
    `,
    query: gql`
      {
        user {
          name
        }
      }
    `,
    mocks: {
      User: () => ({
        __typename: "User",
        name: "Foo Bar",
      }),
      NewUser: () => ({
        __typename: "NewUser",
        name: "Foo Bar",
      }),
    },
  }).not.toBeSafe();
});

test("breaking: changing to incompatible type", () => {
  expect({
    before: gql`
      type Query {
        user: User
      }

      type User {
        name: String
      }
    `,
    after: gql`
      type Query {
        user: User
      }

      scalar User
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
