### Service Status
![Website](https://img.shields.io/website?url=https%3A%2F%2Fplatzkiecker.de&logo=react&logoColor=blue&label=frontend)
![Website](https://img.shields.io/website?url=http%3A%2F%2Fapi.platzkiecker.de%2Fapi%2Fdocs&logo=django&logoColor=white&label=backend)


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
- [High-Level Architecture](#high-level-architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Development Environment Setup](#development-environment-setup)
  - [Production Environment Setup](#production-environment-setup)
- [Configuration](#configuration)
- [Docker Configuration](#docker-configuration)
  - [Overview](#overview)
  - [Dockerfiles](#dockerfiles)
  - [Docker Compose Files](#docker-compose-files)
  - [Key Commands](#key-commands)
- [Components](#components)
- [Security Considerations](#security-considerations)
- [API Documentation](#api-documentation)
- [User Documentation](#user-documentation)
- [Frontend Technical Documentation](#frontend-technical-documentation)
- [Configuration Management](#configuration-management)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Welcome to PlatzKiecker, an innovative table management system for restaurants. PlatzKiecker streamlines reservation handling, customer seating, and service efficiency, integrating seamlessly into restaurant operations.

Powered by Django on the backend for secure data handling and React on the frontend for a responsive user experience, PlatzKiecker uses Nginx as a reverse proxy for enhanced performance and scalability.

This documentation provides an overview of PlatzKiecker’s architecture, setup, and usage guidelines, supporting both development and production environments. Explore PlatzKiecker’s features to enhance your restaurant’s operations and customer satisfaction. Thank you for choosing PlatzKiecker.

## High-Level Architecture

![Architecture Diagram](/images/pk_service_architecture.png)

## Project Structure

The project is organized into the following directories:

```
platzkiecker/
├── .github/
│   └── workflows/
│       ├── build.yml
│       ├── codeql.yml
│       ├── prod.yml
│       └── test_integration.yml
├── backend/
│   ├── booking/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── config/
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── restaurant/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── user/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── entrypoint.prod.sh
│   ├── entrypoint.sh
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ... (other React files)
├── images/
│   ├── pk_service_architecture.drawio
│   └── pk_service_architecture.png
├── proxy/
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.full.yml
├── docker-compose.prod.yml
├── docker-compose.test.yml
├── docker-compose.yml
└── README.md

```

### Backend (Django)
Contains the Django application code, including settings, models, views, and URLs.

### Frontend (React)
Contains the React application code, including components, state management, and assets.

### Proxy (nginx)
Contains the nginx configuration file and Dockerfile for setting up the reverse proxy.

## Installation

Before getting started, make sure you have the following installed:

- [Docker](https://www.docker.com)

- If you use Windows for development, consider switching the "end of line sequence" for all the entrypoint.sh scripts in VS-Code to "LF".

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
4. Build and run the Docker containers using the development configuration:
    ```bash
    docker compose up -d --build
    ```

### Usage

To use the application, follow these steps:

1. Open your web browser and navigate to `http://localhost:8000` for the backend.
2. Open your web browser and navigate to `http://localhost:5051` for the database admin page.
3. Open your web browser and navigate to `http://localhost:3000` for the frontend.

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

1. Open your web browser and navigate to `http://localhost:80` or `http://localhost:443`.
2. If you use the "docker-compose.full.yml" the frontend is reachable at `http://localhost:3000`.

## Configuration

Configuring the application is mainly achieved by manipulating the ENV variables.

## Docker Configuration

### Overview
We use Docker and Docker Compose to containerize and manage the development, testing, and production environments of the PlatzKiecker project. Docker ensures consistency across different environments, while Docker Compose orchestrates the various services our application relies on.

### Dockerfiles

#### Backend

- **[Dockerfile](/backend/Dockerfile)**
  - **Purpose**: Sets up the development environment for the Django backend.
  - **Key Steps**: 
    - Uses `python:3.11.4-slim-buster` as the base image.
    - Installs necessary dependencies.
    - Copies project files and runs `entrypoint.sh` to start the Django development server.

- **[Dockerfile.prod](/backend/Dockerfile.prod)**
  - **Purpose**: Sets up the production environment for the Django backend.
  - **Key Steps**: 
    - Uses a multi-stage build to optimize the final image.
    - Installs dependencies and copies project files.
    - Runs `entrypoint.prod.sh` to start the Gunicorn server.

#### Frontend

- **[Dockerfile](/frontend/Dockerfile)**
  - **Purpose**: Builds the React frontend for both development and production environments.
  - **Key Steps**: 
    - In the `dev` stage, installs dependencies and

 builds the project.
    - In the `prod` stage, uses Nginx to serve the built files.

#### Proxy

- **[Dockerfile](/proxy/Dockerfile)**
  - **Purpose**: Configures Nginx to serve as a reverse proxy.
  - **Key Steps**: 
    - Removes default configuration.
    - Copies custom `nginx.conf` for routing traffic.

### Docker Compose Files

#### Development

- **[docker-compose.dev.yml](/docker-compose.yml)**
  - **Purpose**: Orchestrates services for the development environment.
  - **Services**:
    - `web-dev`: Django development server.
    - `db-dev`: PostgreSQL database.
    - `pgadmin-dev`: pgAdmin for database management.
    - `frontend-dev`: React development server.

#### Production

- **[docker-compose.prod.yml](/docker-compose.prod.yml)**
  - **Purpose**: Orchestrates services for the production environment.
  - **Services**:
    - `web`: Django backend with Gunicorn.
    - `db`: PostgreSQL database.
    - `proxy`: Nginx reverse proxy.
    - `frontend`: React frontend served by Nginx.

#### Full Production

- **[docker-compose.full.yml](/docker-compose.full.yml)**
  - **Purpose**: Similar to `docker-compose.prod.yml`, but includes the frontend service if you do not use a CDN.
  - **Services**:
    - `web`: Django backend with Gunicorn.
    - `db`: PostgreSQL database.
    - `proxy`: Nginx reverse proxy.
    - `frontend`: React frontend served by Nginx.

#### Testing

- **[docker-compose.test.yml](/docker-compose.test.yml)**
  - **Purpose**: Orchestrates services for testing the application.
  - **Services**:
    - `web`: Django backend with Gunicorn.
    - `frontend`: React frontend served by Nginx.

### Key Commands

- **Build and start the development environment:**
  ```bash
  docker-compose up -d --build
  ```

- **Stop the development environment:**
  ```bash
  docker-compose down
  ```

- **Build and start the production environment:**
  ```bash
  docker-compose -f docker-compose.prod.yml up -d --build
  ```

- **Stop the production environment:**
  ```bash
  docker-compose -f docker-compose.prod.yml down
  ```

- **View logs for a specific service:**
  ```bash
  docker-compose logs -f <docker-compose-file> <service-name>
  ```

### Links to Docker Configuration Files

- **[Backend Dockerfile](/backend/Dockerfile)**
- **[Backend Dockerfile.prod](backend/Dockerfile.prod)**
- **[Frontend Dockerfile](/frontend/Dockerfile)**
- **[Proxy Dockerfile](/proxy/Dockerfile)**
- **[docker-compose.dev.yml](/docker-compose.yml)**
- **[docker-compose.prod.yml](/docker-compose.prod.yml)**
- **[docker-compose.full.yml](/docker-compose.full.yml)**
- **[docker-compose.test.yml](/docker-compose.test.yml)**

## Components

### Backend (Django)
The backend is responsible for handling API requests, processing business logic, and interacting with the database. It includes authentication, authorization, and data management functionalities.

### Frontend (React)
The frontend is a single-page application built with React. It interacts with the backend via REST APIs and provides a dynamic user interface for managing restaurant tables.

### Proxy (nginx)
Nginx is used as a reverse proxy to route requests to the appropriate backend or frontend services. It handles SSL termination, load balancing, and caching.

### Database (Postgres)
The PostgreSQL database stores all persistent data, including user information, restaurant details, and table reservations. It is accessed by the Django backend.

### pgAdmin
pgAdmin is used for database management during development. It provides a web interface to interact with the PostgreSQL database.

## Security Considerations

### Data Handling
Sensitive data is stored in the PostgreSQL database with appropriate encryption measures. Environment variables are used to manage secrets securely.

### Network Security
Nginx handles SSL termination and forwards requests to internal services. Firewall rules ensure that only necessary ports are open to the public.

### Authentication and Authorization
Django's built-in authentication system is used for user management. Additional security measures like JWT or OAuth can be implemented for API security.

## API Documentation

Our API is documented using Swagger. You can access the Swagger documentation at the following endpoint:

[DEV: Swagger API Documentation (install it on your machine first)](http://localhost:8000/api/docs/)

[PROD: Swagger API Documentation](http://api.platzkiecker.de/api/docs/)

## User Documentation

For detailed user documentation, please refer to our [User Documentation Repository](https://github.com/PlatzKiecker/user-documentation).

## Frontend Technical Documentation

For detailed technical documentation of the frontend, please refer to the [Frontend README](frontend/README.md).

## Configuration Management

### Environment Variables
Configuration is managed using environment variables. These variables are defined in .env files and loaded by the application at runtime.

### Secrets Management
Sensitive information such as database passwords and API keys are stored securely using environment variables and secret management tools.

## Contributing

### Contribution Guidelines
We welcome contributions to the project. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push them to your fork.
4. Open a pull request against the main repository.

## License

This repository is licensed under the [MIT License](LICENSE).
