# EventHorizon Event Management API
A secure RESTful backend API for EventHorizon.
The API provides user registration, email verification, secure login, JWT-based authentication, and protected user profile access.

## DEPLOYED LINK FOR TESTING GLOBALLY
https://event-management-api-8pv0.onrender.com

## ROOT ROUTER: 
/api/auth

## Running the Project locally
Start the server with: npm run dev

The server will run on: http://localhost:4555

When the application starts successfully, it connects to MongoDB and listens on the configured port.


## API Endpoints
| Method | Endpoint | Description |

| POST | `/api/auth/register` | Register a new user |
| GET | `/api/auth/verify-email` | Verify a user's email address |
| POST | `/api/auth/login` | Login a verified user and receive a JWT |
| GET | `/api/auth/profile` | Access the authenticated user's profile |


## API Testing
The API can be tested using Postman.
The following endpoints can be tested:

- User registration
- Email verification
- User login
- Protected user profile

For protected endpoints, include the JWT returned from the login endpoint in the `Authorization` header using the Bearer Token format.