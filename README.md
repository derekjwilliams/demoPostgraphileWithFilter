This little application runs a simple graphql server running at localhost:5000/graphql.  Modify the database connection in server.js to connect to a products database.  Set the USERNAME, PASSWORD, and DB

```connectionString: (process.env.DATABASE_URL || 'postgres://USERNAME:PASSWORD@localhost:5432/DB')```


Code for a demo client is at https://github.com/derekjwilliams/demoGraphqlProducts. 

## Available Scripts

Running the server:

### `node server.js`

