import { executeQuery, gql } from "./testkit";

test("safe: adding a default value to existing non-nullable argument", async () => {
  const query = gql`
    {
      words(len: 3)
    }
  `;

  const before = await executeQuery({
    query,
    schema: gql`
      type Query {
        words(len: Int!): [String]
      }
    `,
  });
  const after = await executeQuery({
    query,
    schema: gql`
      type Query {
        words(len: Int! = 2): [String]
      }
    `,
  });

  expect(before.errors).not.toBeDefined();
  expect(after.errors).not.toBeDefined();
});


test("safe: adding a new non-nullable argument with default value", async () => {
  const query = gql`
    {
      words
    }
  `;

  const before = await executeQuery({
    query,
    schema: gql`
      type Query {
        words: [String]
      }
    `,
  });
  const after = await executeQuery({
    query,
    schema: gql`
      type Query {
        words(len: Int! = 2): [String]
      }
    `,
  });

  expect(before.errors).not.toBeDefined();
  expect(after.errors).not.toBeDefined();
});

test("breaking: removing a default value from an non-nullable argument", async () => {
  const query = gql`
    {
      words
    }
  `;

  const before = await executeQuery({
    query,
    schema: gql`
      type Query {
        words(len: Int! = 2): [String]
      }
    `,
  });
  const after = await executeQuery({
    query,
    schema: gql`
      type Query {
        words(len: Int!): [String]
      }
    `,
  });

  expect(before.errors).not.toBeDefined();
  expect(after.errors).toBeDefined();
});



//

test("safe: adding a default value to existing nullable argument", async () => {
  const query = gql`
    {
      words
    }
  `;

  const before = await executeQuery({
    query,
    schema: gql`
      type Query {
        words(len: Int): [String]
      }
    `,
  });
  const after = await executeQuery({
    query,
    schema: gql`
      type Query {
        words(len: Int = 2): [String]
      }
    `,
  });

  expect(before.errors).not.toBeDefined();
  expect(after.errors).not.toBeDefined();
});


test("safe: adding a new nullable argument with default value", async () => {
  const query = gql`
    {
      words
    }
  `;

  const before = await executeQuery({
    query,
    schema: gql`
      type Query {
        words: [String]
      }
    `,
  });
  const after = await executeQuery({
    query,
    schema: gql`
      type Query {
        words(len: Int = 2): [String]
      }
    `,
  });

  expect(before.errors).not.toBeDefined();
  expect(after.errors).not.toBeDefined();
});

test("safe: removing a default value from an nullable argument", async () => {
  const query = gql`
    {
      words
    }
  `;

  const before = await executeQuery({
    query,
    schema: gql`
      type Query {
        words(len: Int = 2): [String]
      }
    `,
  });
  const after = await executeQuery({
    query,
    schema: gql`
      type Query {
        words(len: Int): [String]
      }
    `,
  });

  expect(before.errors).not.toBeDefined();
  expect(after.errors).not.toBeDefined();
});