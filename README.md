# MyClassroomApp
Realtime Collaborative Whiteboard for making online classes interactive.

## Requirements
- npm
- maven

## Running the app:
**Note**: All commands written below are relative to base directory of app.

1. Enter your postgres configurations in **./api/src/main/resources/application.properties**
```
spring.datasource.url= jdbc:postgresql://localhost:5432/myclassroomdb
spring.datasource.username= myclassroom
spring.datasource.password= 123

spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation= true
spring.jpa.properties.hibernate.dialect= org.hibernate.dialect.PostgreSQLDialect

spring.jpa.hibernate.ddl-auto= update

myclassroom.app.jwtSecret= someSecretKey
myclassroom.app.jwtExpirationMs= 86400000
```

2. Run the api server
```
$ cd api
$ mvn spring-boot:run
```
3. Install the node modules
```
$ cd my-classroom
$ npm install
```
4. Run the Express.js server
```
$ node my-classroom/server/index.js
```

5. Open **http://localhost:4010/**

6. Have fun!
