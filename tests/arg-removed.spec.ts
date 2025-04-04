import { gql } from "./testkit";

test("safe: argument is nullable and was never requested", () => {
  expect({
    before: gql`
      type Query {
        foo(bar: Boolean): String
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

test("safe: argument is non-nullable with a default, and was never requested with the argument", () => {
  expect({
    before: gql`
      type Query {
        foo(bar: Boolean! = true): String
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

test("safe: argument is nullable and was passed a null variable", () => {
  expect({
    before: gql`
      type Query {
        foo(bar: Boolean): String
      }
    `,
    after: gql`
      type Query {
        foo: String
      }
    `,
    query: gql`
      query FooBar($bar: Boolean) {
        foo(bar: $bar)
      }
    `,
    variables: {
      bar: null,
    },
  }).toBeSafe();
});

test("safe: argument is nullable and was passed a variable", () => {
  expect({
    before: gql`
      type Query {
        foo(bar: Boolean): String
      }
    `,
    after: gql`
      type Query {
        foo: String
      }
    `,
    query: gql`
      query FooBar($bar: Boolean) {
        foo(bar: $bar)
      }
    `,
    variables: {
      bar: true,
    },
  }).toBeSafe();
});

// @note this used to be breaking I thought...
test("safe: argument is non-nullable and was passed a variable", () => {
  expect({
    before: gql`
      type Query {
        foo(bar: Boolean!): String
      }
    `,
    after: gql`
      type Query {
        foo: String
      }
    `,
    query: gql`
      query FooBar($bar: Boolean!) {
        foo(bar: $bar)
      }
    `,
    variables: {
      bar: true,
    },
  }).toBeSafe();
});
