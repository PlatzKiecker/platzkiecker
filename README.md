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
- [High-Level Architecture](#high-level-architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Development Environment Setup](#development-environment-setup)
  - [Production Environment Setup](#production-environment-setup)
- [Configuration](#configuration)
- [Components](#components)
- [Security Considerations](#security-considerations)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup and Restore Procedures](#backup-and-restore-procedures)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Provide an overview of the project, its purpose, and any relevant background information.

## High-Level Architecture

![Architecture Diagram](path/to/diagram.png)

The diagram above shows the overall structure of the PlatzKiecker project, including the Backend (Django), Frontend (React), Proxy (nginx), Database (Postgres), and pgAdmin.

## Project Structure

The project is organized into the following directories:

```
platzkiecker/
├── backend/
│   ├── manage.py
│   ├── platzkiecker/
│   ├── requirements.txt
│   └── ... (other Django files)
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ... (other React files)
├── proxy/
│   ├── nginx.conf
│   └── Dockerfile
├── db/
│   ├── init.sql
│   └── ... (other database files)
├── docker-compose.yml
└── ... (other root-level files)
```

### Backend (Django)
Contains the Django application code, including settings, models, views, and URLs.

### Frontend (React)
Contains the React application code, including components, state management, and assets.

### Proxy (nginx)
Contains the nginx configuration file and Dockerfile for setting up the reverse proxy.

### Database (Postgres)
Contains initialization scripts and configuration for the PostgreSQL database.

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

## Docker Configuration

### Dockerfile
#### Backend (Django)
```dockerfile
# Example Dockerfile for Django
FROM python:3.9
ENV PYTHONUNBUFFERED 1
WORKDIR /app
COPY requirements.txt /app/
RUN pip install -r requirements.txt
COPY . /app/
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "platzkiecker.wsgi:application"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: ./backend
    command: gunicorn platzkiecker.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:800

0"
    env_file:
      - .env.prod
    depends_on:
      - db

  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data
    env_file:
      - .env.prod.db

  nginx:
    build: ./proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./proxy/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - web

volumes:
  postgres_data:
```

## Security Considerations

### Data Handling
Sensitive data is stored in the PostgreSQL database with appropriate encryption measures. Environment variables are used to manage secrets securely.

### Network Security
Nginx handles SSL termination and forwards requests to internal services. Firewall rules ensure that only necessary ports are open to the public.

### Authentication and Authorization
Django's built-in authentication system is used for user management. Additional security measures like JWT or OAuth can be implemented for API security.


## API Documentation

Our API is documented using Swagger. You can access the Swagger documentation at the following endpoint:

[DEV: Swagger API Documentation](http://localhost:8000/api/docs/)

[PROD: Swagger API Documentation](http://api.platzkiecker.de/api/docs/)

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