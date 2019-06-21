# csc667-teamproject-team02
# Asylum Connect

## Software Stack
* [React.js](https://reactjs.org/) - used for client side rendering
* [Node.js](https://nodejs.org/en/) - evented I/O for the backend
* [Express](https://expressjs.com/) - fast node.js network app framework
* [MongoDB](https://www.mongodb.com/) - flexible NoSQL database 
* [Mongoose](https://mongoosejs.com/) - MongoDB object modelling for node.js

## Instructions

### Dependencies

1. Clone this repository

2. Install server dependencies
    ```bash
    $ cd csc667-sp19-Team02
    $ npm install
    ```
3. Install client dependencies
    ```bash
    $ cd client
    $ npm install
    ```

## Run the app

1. Start mongodb locally
    ```bash
    $ mongod
    ```
2. Start the client
    ```bash
    $ cd csc667-sp19-Team02
    $ npm run dev
    ```
4. Browse to `http://localhost:3000/`

## Testing
* [Mocha](https://mochajs.org/) - JavaScript test framework running on Node.js and in the browser
* [Chai](https://www.chaijs.com/) - BDD / TDD assertion library for Node.js and the browser

### Server
Make sure mongodb is running before testing the server.
```bash
$ cd server
$ npm run test
```
