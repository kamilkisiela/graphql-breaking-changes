import { gql } from "./testkit";

/** @note: This would risk breaking consumers if a new value is returned though... E.g. an int in this case */
test("safe: field changed to inclusive kind and is selected", () => {
  expect({
    before: gql`
      type Query {
        foo: String
      }
    `,
    after: gql`
      type Query {
        foo: ID
      }
    `,
    query: gql`
      {
        foo
      }
    `,
    mocks: {
      ID: () => "Hello World",
    },
  }).toBeSafe();
});

test("safe: field changed to partially inclusive kind, is selected, and based on usage is returning a compatible kind", () => {
  expect({
    before: gql`
      type Query {
        foo: ID
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
    mocks: {
      ID: () => "Hello World",
    },
  }).toBeSafe();
});

test("safe: field changed to compatible kind and the typename is not selected", () => {
  expect({
    before: gql`
      type Foo {
        id: ID!
      }

      type Query {
        foo: Foo
      }
    `,
    after: gql`
      type Bar {
        id: ID!
      }

      type Query {
        foo: Bar
      }
    `,
    query: gql`
      {
        foo {
          id
        }
      }
    `,
  }).toBeSafe();
});

test("breaking: field changed to compatible kind and the typename is selected", () => {
  expect({
    before: gql`
      type Foo {
        id: ID!
      }

      type Query {
        foo: Foo
      }
    `,
    after: gql`
      type Bar {
        id: ID!
      }

      type Query {
        foo: Bar
      }
    `,
    query: gql`
      {
        foo {
          __typename
          id
        }
      }
    `,
  }).not.toBeSafe();
});

test("breaking: field changed to compatible kind and the type is used in a the selected fragment", () => {
  expect({
    before: gql`
      type Foo {
        id: ID!
      }

      type Query {
        foo: Foo
      }
    `,
    after: gql`
      type Bar {
        id: ID!
      }

      type Query {
        foo: Bar
      }
    `,
    query: gql`
      fragment FooFrag on Foo {
        id
      }
      {
        foo {
          ...FooFrag
        }
      }
    `,
  }).not.toBeSafe();
});
