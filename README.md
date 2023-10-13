<h1 style="text-align:center;">Waktaverse Reactions Bot</h1>

## 소스 출처
[discordjs-v14-template-ts](<https://github.com/MericcaN41/discordjs-v14-template-ts>) 사용

## Installation, Build and Run
1) Clone the repository then create a file named `.env` and fill it out accordingly
```js
TOKEN=YOURTOKENHERE
CLIENT_ID=BOTS CLIENT ID
PREFIX=!
MONGO_URI=YOUR MONGO CONNECTION STRING
MONGO_DATABASE_NAME=YOUR DATABASE NAME
```
2) Install typescript, To install TypeScript, you can run the following command in your terminal, This will install the latest version of TypeScript globally on your computer. (You can skip this if you already have typescript installed)
  ```ts
  npm install -g typescript
  ```
3) Compile your TypeScript code to JavaScript by running the following command:
```js
tsc
```
4) Once the build is complete it will generated a folder named `build` that contains compiled version of your ts code to js. You can run the following command in your terminal to run the project:
```js
npm start
```
