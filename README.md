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

## API Endpoints

|No |Method |Name             |Path              |Note                                               |
|---|-------|-----------------|------------------|---------------------------------------------------|
|1  |GET    |Get all Links    |`/api/v1/link`    | You can get all link with params (Filter)         |
|2  |POST   |Store / Add Link |`/api/v1/link`    |                                                   |
|3  |DELETE |Delete a link    |`/api/v1/link/:id`| Put id of the link (MongoDB id)                   |
|4  |GET    |Access link      | `/:short_url`    |

### Parameters for Endpoint
1. Get all Links :
    - `sort`
        - `created_at`
        - `visited_count`
    - `descending` (default : false)
        - `true`
        - `false`
    - `search`
        - `long_url`
        - `short_url`
    - `per_page` (default: 10)
    - `page_number` (default: 1)
    
2. Store / Add Link :
    - `long_url`: URL to shorten **required**
    - `is_custom`: You can custom your short_url by defined this `true` or `false` **required**
    - `short_url`: If you set `is_custom` to true, fill your custom url **optional**
    
### Example
1. Getting all endpoint with params / filters :
> GET https://example.com/api/v1/link?sort=visited_count&descending=true&search=google

Getting all endpoint sort by `visited_count` and descending with `long_url` or `short_url` like `google`

2. Getting endpoint with pagination
> GET https://example.com/api/v1/link?perPage=5&page=2  

Getting all link with each page show 5 link at page 2

3. Store Link randomly generate short_url (8 characters)
> POST https://example.com/api/v1/link  
> {
>  "long_url": "https://www.github.com/miqdadyyy",
> }

4. Store Link with custom short_url
> POST https://example.com/api/v1/link  
> ```
> {
>  "long_url": "https://www.github.com/miqdadyyy",
>  "is_custom": true,
>  "short_url": "miqdadyyy"
> }
> ```
