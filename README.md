# IRCTC API Replica
This project is a replica of the IRCTC backend, providing APIs for managing train bookings, stations, routes, and users.

## Getting Started
### Prerequisites
Node.js: Ensure you have Node.js installed on your system.
PostgreSQL: The project uses a PostgreSQL database.
npm: Installed with Node.js, used for package management.
## Installation
### Clone the Repository
Clone this repository to your local machine:

```
git clone <repository-url>
```
Navigate to the Project Directory
Move into the project folder:

```
cd irctc-api-rep

```
### Install Dependencies
Install all required dependencies:

```
npm install
```
### Setup Environment Variables
Create a .env file in the root directory and add the following:

```
DATABASE_URL=<your-postgres-database-url>
```
Replace <your-postgres-database-url> with the database connection string provided in config.json.


Run the Application
Start the server:
```
npm start
```
## API Endpoints
### Authentication APIs
Register
POST /api/auth/register
Register a new user.

Login
POST /api/auth/login
Authenticate and receive a token.

### Admin APIs
#### Add Train
POST /api/admin/add-train
Add a new train and its route (Admin only).

#### Add Station
POST /api/admin/add-station
Add a new station (Admin only).

### Booking APIs
Book a Seat
#### POST /api/bookings/book-seat
Allows users (admin or logged in) to book seats on a train.

Seat Availability
#### POST /api/bookings/seat-availability
Check available seats for a specific source and destination.

User Bookings
#### GET /api/bookings/user/:user_id
Fetch all bookings made by a specific user.

Running the Project
Start the development server using npm start.
Use tools like Postman or cURL to test the APIs.

## Sample .env File
```
DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database>
JWT_SECRET=<your-secret-key>
PORT=3000
```
