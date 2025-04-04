import { gql } from "./testkit";

/** @note: This would risk breaking consumers if a new value is returned though... E.g. an int in this case */
test("safe: arg changed to inclusive kind and is used", () => {
  expect({
    before: gql`
      type Query {
        foo(bar: String): String
      }
    `,
    after: gql`
      type Query {
        foo(bar: ID): String
      }
    `,
    query: gql`
      {
        foo(bar: "string")
      }
    `,
  }).toBeSafe();
});

test("safe: arg changed to partially inclusive kind, is used, and based on usage is passing a compatible kind", () => {
  expect({
    before: gql`
      type Query {
        foo(bar: ID): String
      }
    `,
    after: gql`
      type Query {
        foo(bar: String): String
      }
    `,
    query: gql`
      {
        foo(bar: "string")
      }
    `,
  }).toBeSafe();
});

test("breaking: arg changed to partially inclusive kind, is used, and based on usage is not passing a compatible kind", () => {
  expect({
    before: gql`
      type Query {
        foo(bar: ID): String
      }
    `,
    after: gql`
      type Query {
        foo(bar: Int): String
      }
    `,
    query: gql`
      {
        foo(bar: "string")
      }
    `,
  }).not.toBeSafe();
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
