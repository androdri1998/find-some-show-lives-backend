# Find some show lives  
  
This is a simple and initial back-end application to manager schedules live show times, where is possible create live show times and save live show times, follow users to accompany the live show times createds.  
  
**This backend application was created only to study Javascript language.**
  
This is only a simple application to practice development oriented to TDD and **is not recommend to use this application in production**. is only a demonstration of knowledgements about development oriented to TDD, Back-end Development, Node.js and JavaScript Language.

## executing application backend
execute yarn install:  
```$ yarn install --frozen-lockfile```  
  
create script to database config in directory ```./config/``` create file ```database.js```, there is a file with name of the ```database.example.js```, it's describe how it should be the file ```database.js```.
  
### run application in ```dev``` stage follow the steps:  
execute script migration in dev ```NODE_ENV=dev sequelize db:migrate```:  
```$ yarn run-dev-migration```  
  
execute script to run application in dev ```NODE_ENV=dev nodemon index.js --ignore __tests__```:  
```$ yarn dev``` 
  
### run application in ```prod``` stage follow the steps:  
execute script migration in prod ```NODE_ENV=prod sequelize db:migrate```:  
```$ yarn run-migration```  
  
execute script to run application in prod ```NODE_ENV=prod node index.js```:  
```$ yarn start```  
  
**is not recommend to use this application in production**
  
### run TDD tests application in ```test``` stage follow the steps:   
execute script to run tests of the application in ```test``` stage ```jest --runInBand```:  
```$ yarn test```  
  
the script will to run three scripts automatically:  
script 1 ```NODE_ENV=test sequelize db:migrate```:  
```yarn pretest```  
  
script 2 ```jest --runInBand```:  
```yarn test```  
  
script 3 ```NODE_ENV=test sequelize db:migrate:undo:all```:  
```yarn posttest```  
  
the file settings database in test to run TDD tests ```.env.test``` recommends to use ```sqlite```.
