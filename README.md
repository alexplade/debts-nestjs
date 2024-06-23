# Debts REST API

1. Clone the repository

2. Install dependencies
```
yarn install
```

3. Clone the __.env.example__ file and rename the copy to __.env__

4. Fill the environment variables defined in the __.env__

5. Run the MongoDB database with the credentials defined in the __.env__ file.
```
docker-compose up -d
```

6. Run application.
```
yarn start
```

7. You can test the service by importing the file __debts-nestjs.postman_collection.json__ into Postman.

## Stack used
* NestJS
* MongoDB
