# ChatXo

This is a chatXo application built with Nest.js that allows two users to communicate with each other. The application supports authentication using social media accounts and provides functionality to add friends.

## Demo

Check out the [live demo](https://app-chat-psi.vercel.app/) of the application.

## Frontend Repository

You can find the frontend source code in the [App-chat-frontend](https://github.com/mahmodghnaj/App-chat-frontend) repository.

## Features

- User Registration and Authentication: Users can register and log in to the application using their social media accounts.
- Real-time Chat: Users can engage in real-time chat with each other, sending and receiving messages instantly.
- Friend Management: Users can add friends to their contact list and initiate chats with them.
- Social Media Authentication: Users can authenticate using popular social media platforms such as Facebook, Google, or Twitter.
- Secure Communication: The application ensures secure communication between users by using encryption and following best practices for data privacy and security.

## Technologies Used

- [Nest.js](https://nestjs.com/): A powerful Node.js framework for building scalable and efficient server-side applications.
- [Socket.IO](https://socket.io/): A library that enables real-time, bidirectional, and event-based communication between the browser and the server.
- [Passport](http://www.passportjs.org/): A flexible authentication middleware for Node.js that supports social media authentication strategies.
- [TypeScript](https://www.typescriptlang.org/): A strongly-typed superset of JavaScript that compiles to plain JavaScript.

## Environment Variables

The application uses environment variables to configure various settings. Before running the application, make sure to create a `.env.development` file in the project root directory and add the following variables:

DATA_BASE=mongodb:<your-mongodb-url>

SECRET=<your-jwt-secret>

REFRESH_TOKEN_SECRET=<your-refresh-token-secret>

PORT=<port-number>

EXPIRES_TOKEN=<access-token-expiration-time>

EXPIRES_RF_TOKEN=<refresh-token-expiration-time>

CLIENT_ID_GITHUB=<your-github-client-id>
CLIENT_SECRET_GITHUB=<your-github-client-secret>
CLIENT_CALL_BACK_GITHUB=<your-github-callback-url>

CLIENT_ID_GOOGLE=<your-google-client-id>
CLIENT_SECRET_GOOGLE=<your-google-client-secret>
CLIENT_CALL_BACK_GOOGLE=<your-google-callback-url>

CLIENT_URL=<your-frontend-url>

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
