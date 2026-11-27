# Backend API

## Register a user

Creates a user account and returns an authentication token.

- **Endpoint:** `POST /users/register`
- **Content-Type:** `application/json`
- **Authentication:** Not required

### Request body

Send a JSON object with the following shape:

```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Doe"
  },
  "email": "jane@example.com",
  "password": "secret123"
}
```

| Field | Required | Requirements |
| --- | --- | --- |
| `fullname.firstname` | Yes | At least 3 characters |
| `fullname.lastname` | No | If provided, at least 3 characters |
| `email` | Yes | Must be a valid email address |
| `password` | Yes | At least 6 characters |

The password is hashed before it is stored.

### Responses

#### `201 Created`

The account was created. The response includes a message, the created user, and an authentication token.

```json
{
  "message": "User registered successfully",
  "user": {},
  "token": "<authentication-token>"
}
```

#### `400 Bad Request`

One or more request fields failed validation. The response contains an `errors` array with validation details.

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Firstname must be at least 3 characters long",
      "path": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

Unexpected database or server errors are not converted into a registration-specific response by this endpoint and are handled by the application's Express error handling.
