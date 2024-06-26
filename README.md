### Service Status
![Website](https://img.shields.io/website?url=https%3A%2F%2Fplatzkiecker.de&logo=react&logoColor=blue&label=frontend)
![Website](https://img.shields.io/website?url=http%3A%2F%2Fapi.platzkiecker.de%2Fregister%2F&logo=django&logoColor=white&label=backend)

### Testing Status
[![Code Checks](https://github.com/PlatzKiecker/platzkiecker/actions/workflows/github-code-scanning/codeql/badge.svg?branch=prod)](https://github.com/PlatzKiecker/platzkiecker/actions/workflows/github-code-scanning/codeql)
[![Version Checks](https://github.com/PlatzKiecker/platzkiecker/actions/workflows/dependabot/dependabot-updates/badge.svg?branch=prod)](https://github.com/PlatzKiecker/platzkiecker/actions/workflows/dependabot/dependabot-updates)
[![Integration Test](https://github.com/PlatzKiecker/platzkiecker/actions/workflows/test_integration.yml/badge.svg)](https://github.com/PlatzKiecker/platzkiecker/actions/workflows/test_integration.yml)
### CI/CD Status
[![Build](https://github.com/PlatzKiecker/platzkiecker/actions/workflows/build.yml/badge.svg)](https://github.com/PlatzKiecker/platzkiecker/actions/workflows/build.yml)
[![Deploy](https://github.com/PlatzKiecker/platzkiecker/actions/workflows/prod.yml/badge.svg)](https://github.com/PlatzKiecker/platzkiecker/actions/workflows/prod.yml)

# PlatzKiecker

PlatzKiecker is a project that aims to implement a table management system for restaurants.

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Installation](#installation)
    - [Development Setup](#development-environment-setup)
    - [Production Setup](#production-environment-setup)
- [Configuration](#configuration)
- [Components](#components)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Provide an overview of the project, its purpose, and any relevant background information.

## Project Structure

Each component has its own directory in the root directory. By that we ensure Modularity and independance between used components.

## Installation

Before getting started, make sure you have the following installed:

- [Docker](https://www.docker.com)

- If you use Windows for development, consider to switch the "end of line sequence" for all of the entrypoint.sh scripts in VS-Code to "LF".

## Development Environment Setup

To set up the development environment, follow these steps:

1. Clone the repository: `git clone https://github.com/PlatzKiecker/platzkiecker.git`
2. Navigate to the project directory: `cd platzkiecker`
3. Create a `.env.dev` file in the project root directory and add the necessary environment variables for development.
    ```bash
    DEBUG=True
    SECRET_KEY=change_me
    DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
    CORS_ALLOW_ALL_ORIGINS=True
    SQL_ENGINE=django.db.backends.postgresql
    SQL_DATABASE=backend_dev
    SQL_USER=backend
    SQL_PASSWORD=backend
    SQL_HOST=db-dev
    SQL_PORT=5432
    DATABASE=postgres
    DJANGO_SUPERUSER_EMAIL=admin@example.com
    DJANGO_SUPERUSER_PASSWORD=verysecret
    ```
4. Build and run the Docker containers using the production configuration:
    ```bash
    docker compose up -d --build
    ```

### Usage

To use the application, follow these steps:

1. Open your web browser and navigate to `http://localhost:8000` for the backend
2. Open your web browser and navigate to `http://localhost:5051` for the database admin page
3. Open your web browser and navigate to `http://localhost:3000` for the frontend

## Production Environment Setup

To set up the production environment, follow these steps:
1. Clone the repository: `git clone https://github.com/PlatzKiecker/platzkiecker.git`
2. Navigate to the project directory: `cd platzkiecker`
3. Create a `.env.prod` file in the project root directory and add the necessary environment variables for production.
    ```bash
    DEBUG=False
    SECRET_KEY=change_me
    DJANGO_ALLOWED_HOSTS=api.platzkiecker.de,platzkiecker.de,127.0.0.1,localhost
    DJANGO_CORS_ALLOWED_ORIGINS=https://platzkiecker.de,https://platzkiecker.com,https://www.platzkiecker.online
    DJANGO_CORS_ALLOW_ALL_ORIGINS=False
    SQL_ENGINE=django.db.backends.postgresql
    SQL_DATABASE=backend_prod
    SQL_USER=backend
    SQL_PASSWORD=backend
    SQL_HOST=db
    SQL_PORT=5432
    DATABASE=postgres
    DJANGO_SUPERUSER_EMAIL=admin@example.com
    DJANGO_SUPERUSER_PASSWORD=verysecret
    ```
4. Create a `.env.prod.db` file in the project root directory and add the necessary environment variables for the production database.
    ```bash
    POSTGRES_USER=backend
    POSTGRES_PASSWORD=backend
    POSTGRES_DB=backend_prod
    ```
5. Build and run the Docker containers using the production configuration:
    ```bash
    docker compose -f docker-compose.prod.yml up -d --build
    ```
6. Apply database migrations:
    ```bash
    docker compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput
    ```
7. Collect static files:
    ```bash
    docker compose -f docker-compose.prod.yml exec web python manage.py collectstatic --no-input --clear
    ```

### Usage

To use the application, follow these steps:

1. Open your web browser and navigate to `http://localhost:80` or `http://localhost:443`
2. If you use the "docker-compose.full.yml" the frontend is reachable at `http://localhost:3000`
    - We do deploy our frontend as a static site in a DCN.

## Configuration

Configuring the application is mainly achieved by manipulationg the ENV variables.

## Components

Components and functions are documented in our "Docs" repository.

## Contributing

If you plan on contributing to this project, feel free to contact us.

## License

This repository is licensed under the [MIT License](LICENSE).
