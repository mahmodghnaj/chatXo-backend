# ChatXo

This is a chatXo application built with Nest.js that allows two users to communicate with each other. The application supports authentication using social media accounts and provides functionality to add friends.

![Alt Text](./example.jpeg)

## Demo

Check out the [live demo](https://chat-xo.vercel.app/) of the application.

## Frontend Repository

You can find the frontend source code in the [ChatXo-frontend](https://github.com/mahmodghnaj/App-chat-frontend) repository.

## Features

- User Registration and Authentication: Users can register and log in to the application using their social media accounts.
- Real-time Chat: Users can engage in real-time chat with each other, sending and receiving messages instantly.
- Friend Management: Users can add friends to their contact list and initiate chats with them.
- Last Seen Date: The application displays the last seen date of each user, indicating when they were last active.
- User Status: Users' online/offline status is shown, indicating whether they are currently active or not.
- Message Receipt: The application provides flags to indicate whether a message has been received or not.
- Social Media Authentication: Users can authenticate using popular social media platforms such as Facebook, Google, or Twitter.
- Secure Communication: The application ensures secure communication between users by using encryption and following best practices for data privacy and security.

## Technologies Used

- [Nest.js](https://nestjs.com/): A powerful Node.js framework for building scalable and efficient server-side applications.
- [Socket.IO](https://socket.io/): A library that enables real-time, bidirectional, and event-based communication between the browser and the server.
- [Passport](http://www.passportjs.org/): A flexible authentication middleware for Node.js that supports social media authentication strategies.
- [Mongoose](https://mongoosejs.com/): An elegant MongoDB object modeling library for Node.js.

## Environment Variables

The application uses environment variables to configure various settings. Before running the application

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
