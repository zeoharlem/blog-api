# My Express API

This is a Node.js and Express API with protected routes, JWT authentication, and MongoDB.

## Features

- JWT-based authentication
- Protected route grouping
- User & blog management
- Mongoose with timestamps
- Pagination, filtering & sorting

## 🔧 Tech Stack

- **Node.js**
- **Express**
- **MongoDB** + **Mongoose**
- **JWT Authentication**
- **Passport.js**
- **Supertest + Jest** (for testing)

## Api Endpoints { BASE_URL - https://blog-api-hswd.onrender.com/ }

- {BASE_URL}/v1/login - POST
- {BASE_URL}/v1/register - POST
- {BASE_URL}/v1/posts - GET post?page=1 | ?author=Kenny | ?title=Systemic | ?tags=reflection |
  ?order_by=read_count&order=asc
- {BASE_URL}/v1/posts/:id - GET
- {BASE_URL}/v1/posts/create - POST
- {BASE_URL}/v1/posts/me - GET
- {BASE_URL}/v1/posts/me - PUT
- {BASE_URL}/v1/posts/me/:id - PATCH
- {BASE_URL}/v1/posts/:id - DELETE
