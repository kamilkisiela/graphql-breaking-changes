import { gql } from "./testkit";

test("safe: value removed and field returning the enum is not selected", () => {
  expect({
    before: gql`
      type Query {
        status: Status
        otherField: Boolean
      }

      enum Status {
        DEFAULT
        DEPRECATED
      }
    `,
    after: gql`
      type Query {
        status: Status
        otherField: Boolean
      }

      enum Status {
        DEFAULT
      }
    `,
    query: gql`
      {
        otherField
      }
    `,
  }).toBeSafe();
});

// Removing an enum value is safe based on selection
test("safe: value removed and field returning the enum is selected", () => {
  expect({
    before: gql`
      type Query {
        status: Status
      }

      enum Status {
        DEFAULT
        DEPRECATED
      }
    `,
    after: gql`
      type Query {
        status: Status
      }

      enum Status {
        DEFAULT
      }
    `,
    query: gql`
      {
        status
      }
    `,
    mocks: {
      Status: () => "DEFAULT",
    },
  }).toBeSafe();
});

test("breaking: value removed and enum value is used as argument", () => {
  expect({
    before: gql`
      type Query {
        userNames(status: Status): [String]
      }

      enum Status {
        DEFAULT
        DEPRECATED
      }
    `,
    after: gql`
      type Query {
        userNames(status: Status): [String]
      }

      enum Status {
        DEFAULT
      }
    `,
    query: gql`
      {
        userNames(status: DEPRECATED)
      }
    `,
  }).not.toBeSafe();
});

test("breaking: value removed and enum value is used as input", () => {
  expect({
    before: gql`
      input UserNamesInput {
        status: Status
      }

      type Query {
        userNames(input: UserNamesInput): [String]
      }

      enum Status {
        DEFAULT
        DEPRECATED
      }
    `,
    after: gql`
      type Query {
        userNames(input: UserNamesInput): [String]
      }

      input UserNamesInput {
        status: Status
      }

      enum Status {
        DEFAULT
      }
    `,
    query: gql`
      {
        userNames(input: { status: DEPRECATED })
      }
    `,
  }).not.toBeSafe();
});

test("breaking: value removed and enum value is used as operation variable", () => {
  expect({
    before: gql`
      type Query {
        userNames(status: Status): [String]
      }

      enum Status {
        DEFAULT
        DEPRECATED
      }
    `,
    after: gql`
      type Query {
        userNames(status: Status): [String]
      }

      enum Status {
        DEFAULT
      }
    `,
    query: gql`
      query GetUserNames($status: Status) {
        userNames(status: $status)
      }
    `,
    variables: {
      status: "DEPRECATED",
    },
  }).not.toBeSafe();
});
