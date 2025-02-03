# Allapi

This repository is based on https://github.com/hmake98/fastify-typescript, but adjusted to our custom needs.

## How to Use

### 1. Clone this Repo & Install Dependencies

First, clone the repository and install the Node.js dependencies:

```bash
yarn
```

### 2. Set Up the Database

This project uses a Postgres database. To set up your database, run the following migration command:

For development:

```bash
yarn migrate
```

For production:

```bash
yarn migrate:prod
```

### 3. Generate Prisma Client (Type-Safe Database Client)

Run the following command to generate the Prisma Client:

```bash
yarn db:gen
```

### 4. Start the Fastify Server

Launch your Fastify server with the following command:

```bash
yarn dev
```

### Build Generation

To build the server, use the command:

```bash
yarn build
```

## API Documentation

The API documentation is available through Swagger UI at:

```
http://localhost:5001/documentation
```

This provides an interactive API documentation where you can:

- View all available endpoints
- See request/response schemas
- Test endpoints directly from the browser
- Download OpenAPI specification

### Authentication Endpoints

For detailed API documentation, please visit the Swagger UI documentation page. However, here are some quick curl examples:

## Documentation

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
