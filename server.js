const pg = require("pg");
const { ApolloServer } = require("apollo-server");
const { makeSchemaAndPlugin } = require("postgraphile-apollo-server");
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
const PostGraphileNestedMutations = require('postgraphile-plugin-nested-mutations');
const  PostgisPlugin = require("@graphile/postgis").default;
const simplifyInflectorPlugin = require('@graphile-contrib/pg-simplify-inflector');

const dbSchema = process.env.SCHEMA_NAMES
  ? process.env.SCHEMA_NAMES.split(",")
  : ["master_schema"]; // was "public"

const pgPool = new pg.Pool({
  // connectionString: (process.env.DATABASE_URL || 'postgres://agrium_data_lake_reconciliation_gis:69qTRCkpReNAGxziBMak@data-lake-aurora-postgres-gis.cluster-cflm0f1qhus9.us-east-2.rds.amazonaws.com/agrium_data_lake_reconciliation_gis'),   
  connectionString: (process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/reconciliation'),   
});

const postGraphileOptions = {
  appendPlugins: [ConnectionFilterPlugin, PostgisPlugin, PostGraphileNestedMutations],
  graphql: true,
  graphiql: true,
  dynamicJson: true,
  watchPg: true,
  //nestedMutationsSimpleFieldNames: true,
  // classicIds: false,
  simpleCollections: 'only',
  legacyRelations: 'omit'
  //jwtSecret: process.env.JWT_SECRET || String(Math.random())
  // appendPlugins: [ConnectionFilterPlugin, PostgisPlugin, PostGraphileNestedMutations, simplifyInflectorPlugin],
  // graphql: true,
  // graphiql: true,
  // dynamicJson: true,
  // watchPg: true,
  // graphileBuildOptions: {
  //   nestedMutationsSimpleFieldNames: true,
  //   pgSimplifyAllRows: true,
  //   pgOmitListSuffix: false
  // },
  // classicIds: true,
  // simpleCollections: 'only',
  // legacyRelations: 'omit',
  // legacyRelations: 'omit'
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
    plugins: [plugin],
    tracing: true
  });

  const { url } = await server.listen(5002);
  console.log(`🚀 Server ready at ${url}/graphql, Graphiql at ${url}/graphiql`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});



// CREATE OR REPLACE FUNCTION master_schema.verify_user_org_data(crop_consultant_id bigint, user_org_id uuid, farm_ids uuid[], field_ids uuid[])
//  RETURNS text
//  LANGUAGE sql
// AS $function$
// select('TODO 2 modify the user_org, farms, and fields data'::text)
// $function$
// ;


/*
CREATE OR REPLACE FUNCTION master_schema.verify_user_org_data(crop_consultant_id bigint, user_org_id uuid, farm_ids uuid[], field_ids uuid[])
 RETURNS text
 LANGUAGE sql
AS $function$
select('TODO 2 modify the user_org, farms, and fields data'::text)
$function$
;

*/