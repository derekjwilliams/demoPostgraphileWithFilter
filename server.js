const pg = require("pg");
const { ApolloServer } = require("apollo-server");

const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
const  PostgisPlugin = require("@graphile/postgis").default;

console.log(ConnectionFilterPlugin)

// console.log(PostgisPlugin)

const dbSchema = process.env.SCHEMA_NAMES
  ? process.env.SCHEMA_NAMES.split(",")
  : "reconciler_merged"; // was "public"

const pgPool = new pg.Pool({
   connectionString: (process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/reconciliation'),   
});

const postGraphileOptions = {
  //jwtSecret: process.env.JWT_SECRET || String(Math.random())
  appendPlugins: [ConnectionFilterPlugin, PostgisPlugin],
  graphql: true,
  graphiql: true,
  dynamicJson: true,
  classicIds: true,
  simpleCollections: 'only',
  // legacyRelations: 'omit',
};

console.log(JSON.stringify(pgPool))

async function main() {
  // See https://www.graphile.org/postgraphile/usage-schema/ for schema-only usage guidance
  const { schema, plugin } = await makeSchemaAndPlugin(
    pgPool,
    dbSchema,
    postGraphileOptions
  );

  // See https://www.apollographql.com/docs/apollo-server/api/apollo-server.html#ApolloServer
  const server = new ApolloServer({
    schema,
    plugins: [plugin]
  });

  const { url } = await server.listen(5000);
  console.log(`🚀 Server ready at ${url}/graphql, Graphiql at ${url}/graphiql`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
