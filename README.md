# RockeTube

#### Description
A movie watching mobile app with web admin panel

#### Some Client (Admin) Images

![image](https://user-images.githubusercontent.com/68450622/219399831-609b22ae-d9bd-4666-9584-031093260344.png)
![image](https://user-images.githubusercontent.com/68450622/219400014-2c602526-11e4-4aac-9223-9ccff9cacdde.png)
![image](https://user-images.githubusercontent.com/68450622/219400485-752249dd-271f-4f9c-9403-5fa784f7c84a.png)

#### Some Client (User) Images
![image](https://user-images.githubusercontent.com/68450622/219408841-61551a98-c4cd-468c-b371-7bfed5fd933c.png)



#### Used Technologies

* For Backend
  * Node.js
  * TypeScript
  * Express
  * Redis (MemCache)
  * JWT
  * ...3th Party Libraries
* For Database
  * MongoDB
  * Mongo Atlas
  * ORM
    * Mongoose
* For Storage
  * Google Cloud
    * Firebase Storage
* For CI/CD
  * Docker
  * Docker Compose
* For Client (Admin)
  * JavaScript
  * React
  * Scss
  * HTML
  * Redux
  * ...3th Party Libraries
* For Client (User)
  * JavaScript
  * React Native
  * Redux
  * ...3th Party Libraries
* For Test
  * Chai
  * Mocha
  * Chai Http
  
## Installation

#### Backend
###### Redis must be installed your device. If you are windows user, you can up redis on docker (redis bridge network name should be "dockerredis").

```
cd ./server

npm install

npm run build

npm start
```

#### Client (Admin)

```
cd ./client

npm install

npm start
```

#### Client (User)

```
cd ./rncli/Project

yarn
```
For Android
```
npx react-native run-android
```
For iOS
```
npx react-native run-ios --simulator='iPhone 14 Pro (16.0)'
```




















  
