# SurveyPro

SurveyPro is a google forms replica made using Node, Express, Angular and MySQL. It allows user to create surveys and add questions with fields like textbox, radiobutton, checkbox and numbers. The user can share the survey and it can be filled by anyone.

**For a walkthrough of the complete application, watch the Walkthrough video present in this repository.**

### Prerequisites
  - [NodeJS]
  - [Angular CLI]
  - [MySQL] (You can follow [this] tutorial to download and install MySQL)

### Setup
----
#### Database
- Import the sql file present in the **Database** folder of this repository to your local MySQL server.
- For using nodejs, the root user of MySQL will not work as the way node handles SQL authentication has been changed in the latest version. So you will have to create a new user to access nodejs.
- Execute the following commands in the SQL shell to create new user.
```sh
create user nodeuser@localhost identified by 'password';
grant all privileges on surveypro.* to nodeuser@localhost;
ALTER USER 'nodeuser'@localhost IDENTIFIED WITH mysql_native_password BY 'password';
```
- Here, in the commands above, 'nodeuser' is the username and 'password' will be the password of nodeuser. 'surveypro' is the name of our database.
 
#### Google Authentication
We can create a client ID and client secret using its [Google API Console]. You need to follow below steps once you open Google API Console.
- From the project drop-down, select an existing project, or create a new one by selecting Create a new project.
- In the sidebar under "APIs & Services", select Credentials.
- In the Credentials tab, select the Create credentials drop-down list, and choose OAuth client ID.
- Under Application type, select Web application.
- In Authorized JavaScript origins add http://localhost:8989 and http://localhost:4200 (Generally http://localhost:8989 is not required, but I have kept it just to be sure.)
- In Authorized redirect URIs add http://localhost:8989/login/google/callback
- Press the Create button and copy the generated client ID and client secret. You will have to use this client id and client secret in the .env file in Backend folder.

#### NodeJS
```sh
$ cd Backend
$ npm install
```

Setting up the .env file in Backend folder...
- Replace the variables there with appropriate variables according to your environment.
- Note: The port number 8989 is hardly coupled with frontend, so it's recommended that you don't change the port number. In future, we can remove the frontend dependency on 8989 port number.
 
Running the server:
```sh
$ npm start
```
The app will start on port http://localhost:8989.
You can hit the http://localhost:8989/healthcheck API to verify if the app is working or not. If the response is 'OK', then the app is working.
#### Angular
```sh
$ cd Frontend
$ npm install
$ ng serve
```

The Angular application will start on http://localhost:4200.
If the backend server is running, the frontend will work fine.

[//]: # (These are reference links used in the body)
   [NodeJS]: <https://nodejs.org/en/download/>
   [Angular CLI]: <https://cli.angular.io/>
   [MySQL]: <https://dev.mysql.com/downloads/windows/installer/8.0.html>
   [this]: <https://www.onlinetutorialspoint.com/mysql/install-mysql-on-windows-10-step-by-step.html>
   [Google API Console]: <https://console.developers.google.com/>