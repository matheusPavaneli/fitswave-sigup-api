# Fitswave Signup API

> A robust API designed to be comprehensive and usable in a variety of scenarios, featuring security systems that make it a highly reliable solution.

## Table of Contents

1. [Introduction](#introduction)
2. [Resources](#resources)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Usage](#usage)
7. [Endpoints](#endpoints)
8. [Authentication](#authentication)
9. [Error Handling](#error-handling)
10. [Contribution](#contribution)

## Introduction

This API was developed to be a complete solution, usable in a wide range of cases, with integrated security systems that make it an excellent and versatile choice.

## Resources

The main features of this API include:

- User CRUD operations;
- Authentication using JSON Web Token (JWT);
- Request and reset password functionality;
- Two-Factor Authentication (2FA) on essential routes.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (LTS or Latest Version);
- MySQL Database.

## Installation

To install the API locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/matheusPavaneli/fitswave-sigup-api.git

# Navigate into the project directory
cd fitswave-sigup-api

# Install the required dependencies
npm install
```

## Configuration

Set up environment variables by creating a `.env` file in the project root with the following structure:

```bash
PORT=your_port
DATABASE_HOST=your_host_database
DATABASE_PORT=your_port_database
DATABASE_USER=your_user_database
DATABASE_PASSWORD=your_password_database
DATABASE=your_database_name
SECRET=your_secret_for_hashing
SECRET_2FA=your_2fa_secret
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
OAUTH_CLIENTID=your_oauth_clientid
OAUTH_CLIENTSECRET=your_oauth_clientsecret
```

## Two-Factor Authentication (2FA)
For routes protected by ```2FA```, include the verifyCode parameter in the request body.

## Usage

Run the API using the following commands:

For development environment:

```bash
npm run dev
```

For production environment:

```bash
npm start
```

## Endpoints

### **POST** `/user/signup`

- **Description**: Register a new user.
- **Request Body**:
  - `username` (required)
  - `email` (required)
  - `password` (required)
  - `repeatPassword` (required)
- **Response Example**:

```json
{
  "status": "success",
  "data": {
    "statusCode": 201,
    "message": "You have successfully registered!",
    "user": {
      "id": 10,
      "username": "test",
      "email": "test@test.com",
      "password": "$2a$10$OUHukQpByUXmzQa91KJvleAgDJCvpp/Cke5/LVPjsrS61IALosave",
      "updated_at": "2024-09-05T00:36:27.559Z",
      "created_at": "2024-09-05T00:36:27.559Z"
    }
  }
}
```

### **POST** `/user/update`

- **Description**: Update a user.
- **Request Body**:
  - `username` (optional)
  - `email` (optional)
  - `password` (optional)
- **Response Example**:

```json
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "message": "Your information has been updated successfully!",
    "user": {
      "id": 10,
      "username": "newupdatetest123",
      "email": "test@test.com",
      "password": "$2a$10$OUHukQpByUXmzQa91KJvleAgDJCvpp/Cke5/LVPjsrS61IALosave",
      "created_at": "2024-09-05",
      "updated_at": "2024-09-05T00:53:47.323Z"
    }
  }
}
```

### **POST** `/auth/signin`

- **Description**: Authenticate with user.
- **Request Body**:
  - `identifier` (required)
  - `password` (required)
- **Response Example**:

```json
{
      "status": "success",
      "data": {
        "statusCode": 200,
        "message": "You have successfully authenticated!",
        "user": user,
      },
    };
```

### **POST** `/auth/logout`

- **Description**: Logout user.
- **Request Body**:
- **Response Example**:

```json
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "message": "You have successfully logged out!"
  }
}
```

### **POST** `/auth/forgot-password`

- **Description**: Submit a request for password reset.
- **Request Body**:

  - `email` (required)

- **Response Example**:

```json
{
      "status": "success",
      "data": {
        "statusCode": 200,
        "message": "If this email exists, we will send a recovery email!",
      },
};
```

### **POST** `/auth/reset-password`

- **Description**: Reset user's password
- **Request Body**:

  - `oldPassword` (required)
  - `newPassword` (required)

- **Response Example**:

```json
{
      "status": "success",
      "data": {
        "statusCode": 200,
        "message": "Your password has been changed successfully!",
      },
    };
```

### **POST** `/2fa/setup`

- **Description**: Create 2FA status for user
- **Request Body**:
- **Response Example**:

```json
{
      "status": "success",
      "data": {
        "statusCode": 200,
        "data": qrCodeUrl,
      },
};
```

### **POST** `/2fa/activate`

- **Description**: Active user's 2FA
- **Request Body**:
- **Response Example**:

```json
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "message": "You have successfully activated your two-step verification"
  }
}
```

### **POST** `/2fa/deactivate`

- **Description**: Deactivate user's 2FA
- **Request Body**:
- **Response Example**:

```json
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "message": "You have successfully deactivated your two-step verification"
  }
}
```

### **POST** `/2fa/verify`

- **Description**: Verify user's 2FA code
- **Request Body**:
- **Response Example**:

```json
{
      "status": "success",
      "data": {
        "statusCode": 200,
        "message": "You have been successfully verified!",
      },
};
```

### **POST** `/auth/google`

- **Description**: Start google authentication
- **Request Body**:
- **Response Example**:

### **POST** `/auth/google/callback`

- **Description**: Callback for complete authentication
- **Request Body**:

- **Response Example**:

```json
{
      "status": "success",
      "data": {
        "statusCode": 200,
        "message": "You have successfully authenticated!",
      },
};
```

## Authentication

This API uses JWT for authentication. Include the JWT token in the request headers as follows:

```bash
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API follows standard HTTP error codes to indicate the result of a request. Here are the common errors:

- **BadRequestError (400)**: Invalid input or request parameters.
- **UnauthorizedError (401)**: Authentication required or invalid credentials.
- **ForbiddenError (403)**: Access to the requested resource is denied.
- **NotFoundError (404)**: The requested resource could not be found.
- **ConflictError (409)**: Conflict in the request, such as duplicate data.
- **UnprocessableEntityError (422)**: The server understands the request but cannot process it due to invalid data.
- **InternalServerError (500)**: An unexpected condition was encountered on the server.

## Contribution

Contributions are welcome! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b my-new-feature`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin my-new-feature`.
5. Open a Pull Request.