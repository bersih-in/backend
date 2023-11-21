# Project Name

Bersih.in Backend using Node JS.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Utility](#utility)


## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/bersih-in/backend.git
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration.

4. Set up Prisma Client:

   ```bash
   npx prisma generate
   ```

5. Start the application:

   ```bash
   npm run dev
   ```

## Usage

The endpoint list can be found at `/api-docs`.

## Utility
### Lint
This function performs linting on the code to check for any potential errors or style violations.

`npm run lint`

### Update Swagger UI
This function generates code-based API documentation.

`npm run swagger`