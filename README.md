A comprehensive NestJS-based REST API for managing users and loan requests with complete CRUD operations, and user validation.

1.Features

- User Management: Complete CRUD operations for user accounts
- Loan Request Management: Complete CRUD operations for loan requests
- User Validation: Ensures users exist before processing loan requests
- Comprehensive Responses: Loan requests return complete user data
- Data Validation: Robust input validation using class-validator
- TypeORM Integration: Database relationships
- RESTful API: Standard HTTP methods and status codes

  2.Tech Stack

- Framework: NestJS 10.x
- Database: MySQL with TypeORM
- Validation: Class-validator & Class-transformer
- Language: TypeScript
- Node.js: 18.x or higher

=> Before you begin, ensure you have the following installed:

- Node.js (18.x or higher)
- MySQL (8.0 or higher)
- npm or yarn

  3.Installation

a). Clone the repository
git clone <repository-url>
cd user-loan-management-system

b). Install dependencies
npm install

c). Database Setup
CREATE DATABASE loan_request_db;

4. Configure Database Connection

   =>Update the database configuration in `src/app.module.ts`:

   TypeOrmModule.forRoot({
   type: 'mysql',
   host: 'localhost',
   port: 3306,
   username: 'your_username',
   password: 'your_password',
   database: 'loan_request_db',
   entities: [User, LoanRequest],//omit this if you have set
   synchronize: true, // Set to false in production
   })

5. Run the application

   # Development mode

   npm run start:dev

   # Production mode

   npm run build
   npm run start:prod

The API will be available at `http://localhost:3000`

6. API Documentation

   -User Endpoints

| Method | Endpoint            | Description       | Body           |
| ------ | ------------------- | ----------------- | -------------- |
| POST   | `/users/create`     | Create a new user | userRequestDTO |
| GET    | `/users/all`        | Get all users     |                |
| GET    | `/users/:id`        | Get user by ID    | -              |
| DELETE | `/users/delete/:id` | Delete user       | -              |

-Loan Request Endpoints

| Method | Endpoint                     | Description Body                      |
| ------ | ---------------------------- | ------------------------------------- | -------------- |
| POST   | `/loan/request`              | Create loan request                   | LoanRequestDto |
| POST   | `/loan/webhook/credit-score` | Receives updated from mock-credit-api |                |
| GET    | `/loan/all`                  | Get all loan requests                 | -              |
| GET    | `/loan/:id`                  | Get loan request by ID                | -              |
| GET    | `/loan/pending/:userId`      | Get user's pending loan status        | -              |
| GET    | `/loan/user/:userId`         | Get loans by user ID                  | -              |
| DELETE | `/loan/:id`                  | Delete loan                           |                |

7.  Data Models

User Entity
{
id: number;
email: string;
name: string;
phone_umber: string;
created_at: Date;
updated_at: Date;
}

Loan Request Entity
{
id: number;
amount: number;
status: 'PENDING' | 'APPROVED' | 'REJECTED' | ;
reeson: string;
userId: number;
user: User;
created_at: Date;
updated_at: Date;
}

8. API Usage Examples

-Create User
POST /users/create
Content-Type: application/json

{
"email": "john.doe@example.com",
"name": "John Doe",
"phone_number": "+2544567890",
"password": 1234
}

-Create Loan Request

POST /loan/request
Content-Type: application/json

{
"amount": 50000,
"userId": 1
}

=> Response includes both loan request and user data:

{
"amount": 20000,
"created_at": "2025-08-22T07:35:59.061Z",
"status": "pending",
"user": {
"name": "john",
"email": "john.doe@example.com",
"phone_number": "1234567890"
}
}

9.  Validation Rules

User Validation

- Email must be valid and unique
- Name is required
- Phone number is required

  Loan Request Validation

- Amount must be between $1,000 - $1,000,000
- User ID must reference an existing user
- Loan status must be valid enum value

10. Testing

Using Postman/ insomnia

1. Set environment variable: `baseUrl = http://localhost:3000`
2. Create users first, then loan requests
3. Test all CRUD operations

Test Data

Test ummy data:

- sample user data

  {
  "name": "John Garcia",
  "email": "john.doe@example.com",
  "phone_number": "+25412345678",
  "password": "john1234"
  }

- Loan requests data
  {
  "amount": "40000",
  "userId" 1 (must be an existing user)
  }

11. Project Structure

src/
|** enums
| |** loan-status.enum.ts
├── user/
│ ├── dto/
│ │ ├── user-request.dto.ts
│ │ └── user-response.dto.ts
| | |** mapper.ts
│ ├── entities/
│ │** user.entity.ts
│ ├── user.controller.ts
│ ├── user.service.ts
│ └── user.module.ts
├── loan-request/
│ ├── dto/
│ │ ├──loan-request.dto.ts
│ │ └── loan-response.dto.ts
│ |\*\* loan-request.entity.ts
│ ├── loan-request.controller.ts
│ ├── loan-request.service.ts
│ └── loan-request.module.ts
|** mock-credit-api
| |**mock-credit-api.controller.ts
| |**mock-credit-api.module.ts
├── app.controller.ts
|** app.modules.ts
|\_\_ app.service.ts
└── main.ts

12. Error Handling

The API provides comprehensive error handling:

- 400 Bad Request: Invalid input data or validation errors
- 404 Not Found: Resource doesn't exist
- 500 Internal Server Error: Server-side errors
  -409 Conflict

Example error response:
{
"message": "duplicate pending loan status",
"error": "Conflict",
"statusCode": 409
}

13. Security features

-Input validation on all endpoints
-SQL injection prevention through TypeORM
-Type safety with TypeScript
-Request validation with class-validator
