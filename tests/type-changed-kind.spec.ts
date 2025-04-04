/**
 * Renaming means changing the name but keeping the exact same shape.
 */

import { gql } from "./testkit";

test("safe: renaming object type and __typename is not selected", () => {
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
        user: NewUser
      }

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
  }).toBeSafe();
});

test("breaking: renaming object type and __typename is selected", () => {
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
        user: NewUser
      }

      type NewUser {
        name: String
      }
    `,
    query: gql`
      {
        user {
          __typename
          name
        }
      }
    `,
  }).not.toBeSafe();
});

test("breaking: renaming object type and type is used in fragment", () => {
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
        user: NewUser
      }

      type NewUser {
        name: String
      }
    `,
    query: gql`
      fragment UserName on User {
        name
      }

      {
        user {
          ...UserName
        }
      }
    `,
  }).not.toBeSafe();
});
