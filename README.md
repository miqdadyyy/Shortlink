# Shortenlink API
A simple shortener URL application using NodeJS 💚

This application Using MEN Stack (Mongo, ExpressJS, NodeJS) 😁

You need mongodb instance to run this application, to create free mongodb click [here](https://www.mongodb.com/cloud/atlas)

## Instalation ⚙️

### Docker
> Prerequisites :  
> - Docker
> - Docker Compose


You can install this application to your host with simple docker command. 
Use `docker-compose` to make this easier.
- Edit `docker-compose.yml` file and fill the environment
- Run `docker-compose up -d`
- Done, your application running on port 3000 😁

### Manual
> Prerequisites :  
> - Node (Version 14 or above)
> - NPM
> - [PM2](https://pm2.keymetrics.io/)

To install this application manually just run :
- Run `npm install --production`
- Edit `ecosystem.config.js` file and fill the environment
- Run `pm2 start ecosystem.config.js --env production`
- Done, your application running on port 3000 😁
