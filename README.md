# Web application allowing management of work schedule in a rehabilitation center

## About
Application was made for a Polish enterprise with some work organization problems. Previous system used Excel sheets to plan out visists with customers, which were then printed and distributed among employees (therapists) and customers.

Most issues associated with above solution appeared in cases where a customer or employee was absent and employees needed an update about their planned visists for the day. Also, in order to keep track of conducted visits, each employee had to personally create notes which would be collected at the end of the month.

Solution presented in this repository aims to replace that system and features:
- management of a dynamic list of visits, with the options to set visit status, add employee replacement in case of absence, add a comment about the visit,
- presentation of employee's weekly work schedule (regardless current week's alterations),
- importing work schedules using Excel sheets from the old system, -- *Note: it was a business requirement to use them instead of making it a feature to build schedules in app*
- management of employee and customer absences,
- dynamic generation of reports, based on selected data and date range, saved in a safe Amazon S3 bucket,
- registering users and  a JWT based authentiaction,
- role based access control.

### Screenshots
Screenshots and other images presenting the application can be found on [Google Drive](https://drive.google.com/drive/folders/1myQP-vcvpCBlzgXHLpCfWd89Qn9GGNqE?usp=sharing).

### Other information
Below are the technical details of the application along with reasoning behind them - a simple documentation for both the author and other parties interested.

## Structure
Source code consists of two independent parts: `client` and `server` directories. They correspond to Angular and Spring applications which can be run in Docker containers using `docker-compose up --build` command from the root directory.

*Note: in order to successfully run the application, all `.example` files such as `.env.example` need to be properly modified and the `.example` extension should be removed.*

### client
Root directory for the Angular application
```
|--client
|   |--src
|   |--Dockerfile
|   |--nginx.config
|   |--Procfile
|   |--server.js
|   |-- ...
```
#### Dockerfile, nginx.config, Procfile, server.js files
These are configuration files used during application deployment - they should be placed into a separate folder in the future. More about them in the [Docker](#docker), [Heroku](#heroku) sections.

#### `client/src` directory
```
|--src
|   |--app              ~ main frontend code; Angular modules, components, services etc.
|   |--assets           ~ website content; locale based texts, website logo
|   |--environments     ~ environment variables for production or development
|   |--styles           ~ general styles; theme definition and css classes shared between features
|   |-- ...
```

#### Angular modules
`app.module` is the top level module of the application. Other modules and their roles:
- Core module - contains singleton services and is imported only in the `app.module` 
- Shared module - contains common components, utility functions and other elements used throughout the app
- Feature modules - each feature should correspond to a bigger part of application, generally a view/route
- Routing modules - create application's routing and allow lazy loading feature modules as they're required
- Angular Material module - imports all Angular Material modules used in application

```
|--app
|   |--core
|   |   |--guards
|   |   |--interceptors
|   |   |--services
|   |   |--core.module.ts
|   |--features
|   |   |--feature  ~ example feature
|   |   |   |--components                   ~ feature subcomponents, structure should be as flat as possible
|   |   |   |--services                     ~ feature services
|   |   |   |--feature.component.html       ~ component html should be short and use subcomponents
|   |   |   |--feature.component.scss       ~ component styles should define feature position, margins
|   |   |   |--feature.component.ts         ~ component logic
|   |   |   |--feature.module.ts            ~ feature module should import at least shared module
|   |   |   |--feature-routing.module.ts    ~ each feature needs a routing module
|   |--shared
|   |   |--abstract-components  ~ abstract classes inherited by common components (eg. user form)
|   |   |--components           ~ dialogs, input fields, icons etc.
|   |   |--enums                ~ enums such as roles
|   |   |--models               ~ interfaces using DTO pattern
|   |   |--pipes                ~ commonly used pipes
|   |   |--utilities            ~ helpers with exported functions
|   |   |--shared.module.ts
|   |--angular-material.module.ts
|   |--app.module.ts
|   |--app-routing.module.ts 
|   |-- ...
```
*Note: a basic Angular component consists of `.html`, `.scss` and `.ts` files.*



### server
Root directory for the Spring application

```
|--server
|   |--src
|   |--Dockerfile
|   |--Procfile
|   |-- ...
```
#### Dockerfile, Procfile files
These are configuration files used during application deployment - they should be placed into a separate folder in the future. More about them in the [Docker](#docker), [Heroku](#heroku) sections.

#### `server/src/main/java/com/app/server` directory
```
|--server
|   |--config       ~ classes with @Configuration annotation, for example security settings
|   |--controller   ~ classes with @RestController annotation, all endpoints can be found here
|   |--dto          ~ classes for objects carrying data, eg. a public representation of DB records
|   |--entity       ~ classes representing DB tables, used by Hibernate ORM to generate DB schema
|   |--exception    ~ custom exceptions
|   |--mapper       ~ MapStruct classes used to map entities to DTO or vice versa
|   |--repository   ~ Spring Data repositories to make DB queries
|   |--security     ~ UserDetails and JWT implementation
|   |--service      ~ business logic
|   |--util         ~ classes whose role isn't tied directly to managing entities
|   |--CommandLineAppStartupRunner.java ~ saves admin user to database
|   |--ServerApplication.java
```

## Database
Database uses PostgreSQL to store information about users, employees, customers, visits and employee/customer absences.

## Docker
Docker Desktop is used to containerize the application and make sure it works as intended regardless of developer's OS.

`docker-compose.yml` file, located in the app root directory, contains configuration for client, server and database containers. Additionally, `Dockerfile` files were created in client and server folders to further specify their launching instructions.

## Heroku
Heroku platform, similarly to Docker, allows starting the application using containers but in the production environment. In order to successfully deploy it, a few configuration files were needed.
- `Procfile` is a file used by Heroku to run commands on container startup
- `server.js` uses Express.js to create a web server
- `nginx.config` creates a reverse proxy for the Express server

## Amazon Web Services
Amazon S3 bucket is used to store reports generated in the application and allow downloading on demand. It could also be used as means of backup in the future.
