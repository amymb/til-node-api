# curl docs

### Welcome
* `curl http://localhost:3001/`

### Sign up
* `curl -X POST -H "Content-Type: application/json" -d '{"email":"elowyn@example.com", "password": "password", "firstName": "Elowyn", "lastName": "Platzer Bartel", "admin": "true"}' http://localhost:3001/users`

### login
* `curl -X POST -H "Content-Type: application/json" -d '{"email":"elowyn@example.com", "password": "password"}' http://localhost:3001/login`

### Users
##### index
* `curl -H "jwt: <YOUR JWT TOKEN>" http://localhost:3001/users`

##### show
* `curl -H "jwt: <YOUR JWT TOKEN>" http://localhost:3001/users/<ANY VALID USER ID>`

##### update
This is a patch type update, so just send the stuff that is different!

* `curl -X PUT -H "jwt: <YOUR JWT TOKEN>" -H "Content-Type: application/json" -d '{"email":"freyja@example.com", "password": "password", "firstName": "Freyja", "lastName": "Platzer Bartel", "admin": "false"}' http://localhost:3001/users/<YOUR USER ID>`

##### me
* `curl -H "jwt: <YOUR JWT TOKEN>" http://localhost:3001/users/me`
