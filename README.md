# Breaking changes in GraphQL Schema

Currently, tools like GraphQL Hive, GraphQL Inspector and Apollo Studio visit fields, variables, arguments, and object fields in `DocumentNode`, collect their return types and parent types, turn them into schema coordinates and persist in a database.
When a GraphQL Schema is modified, a list of changes represented by schema coordinates is created.
This list is checked against the database to see if a schema coordinate was used in the past, and if so, to mark the change as breaking.

This is too safe. It prevents breaking changes but also prevents pushing changes that are safe 🙂

The goal of this repository is to define and tests set of scenarios and changes in schema and to ensure that they are safe or breaking.

## How to contribute?

Just create a test case in the `tests` directory :)