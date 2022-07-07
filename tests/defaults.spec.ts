import { executeQuery, gql } from "./testkit";

test("safe: adding a default value to existing non-nullable argument", () => {
  expect({
    before: gql`
      type Query {
        words(len: Int!): [String]
      }
    `,
    after: gql`
      type Query {
        words(len: Int! = 2): [String]
      }
    `,
    query: gql`
      {
        words(len: 3)
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

test("breaking: removing a default value from an non-nullable argument", () => {
  expect({
    before: gql`
      type Query {
        words(len: Int! = 2): [String]
      }
    `,
    after: gql`
      type Query {
        words(len: Int!): [String]
      }
    `,
    query: gql`
      {
        words
      }
    `,
  }).not.toBeSafe();
});

test("safe: adding a default value to existing nullable argument", () => {
  expect({
    before: gql`
      type Query {
        words(len: Int): [String]
      }
    `,
    after: gql`
      type Query {
        words(len: Int = 2): [String]
      }
    `,
    query: gql`
      {
        words
      }
    `,
  }).toBeSafe();
});

test("safe: adding a new nullable argument with default value", () => {
  expect({
    before: gql`
      type Query {
        words: [String]
      }
    `,
    after: gql`
      type Query {
        words(len: Int = 2): [String]
      }
    `,
    query: gql`
      {
        words
      }
    `,
  }).toBeSafe();
});

test("safe: removing a default value from an nullable argument", () => {
  expect({
    before: gql`
      type Query {
        words(len: Int = 2): [String]
      }
    `,
    after: gql`
      type Query {
        words(len: Int): [String]
      }
    `,
    query: gql`
      {
        words
      }
    `,
  }).toBeSafe();
});
