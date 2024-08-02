# Easy Pay Backend

The backend for Easy Pay handles user authentication, transaction processing, KYC verification, and admin functionalities. It ensures secure and efficient management of user data and transactions.

## Table of Contents
- [Project Description](#project-description)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)

## Project Description
The backend of Easy Pay is designed to provide secure and reliable services for users and admins. It manages user authentication, transaction processing, KYC verification, and admin functionalities such as user management and KYC verification.

## Features

### User-Specific
- User Registration and Login
- Load Balance from Mock Bank Account
- Transfer Balance
- Fetch Transaction History
- Update Profile
- Apply for KYC

### Admin-Specific
- Admin Login
- Verify KYC
- Delete Users

## Technologies
- Node.js
- Express
- Knex.js (for database migrations and queries)

## Installation

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/ajay9803/EasyPay-Backend
    ```
2. Navigate to the project directory:
    ```bash
    cd EasyPay-Backend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up the database:
    ```bash
    knex migrate:latest
    ```
5. Start the server:
    ```bash
    npm start
    ```
