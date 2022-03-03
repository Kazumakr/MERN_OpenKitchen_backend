# <Open Kitchen-Backend>

This project is a recipe blog for sharing cooking recipes.

![User visit public and Home page](http://i.imgur.com/ORCGHHY.png)

Project Link : [https://unruffled-jepsen-33fb63.netlify.app/]
Frontend : [https://github.com/Kazumakr/MERN_OpenKitchen_front]

## Table of Contents (Optional)

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [References](#references)

## Description

One of the reasons I built this project is because I wanted to share cooking recipes with my friends. I thought it is difficult to think and recreate home cooking by myself and needed a recipe, so I wanted a blog that we could easily share.

The other reason is that I wanted to make a note of my original recipe. Currently, I use the iphone note app to write down recipes, but as the number of notes increases, it becomes more difficult to search for recipes I made in the past. I thought it would be convenient if there were category search, keyword search, card display, etc.

It will also help people who need to think up a menu everyday for their family or themselves.

I learned how to configure a relation schema, how to create an authentication function, how to create a search function, and how to upload images to a database.
I gained the knowledge that it can be used for SNS applications in the future.

### Built With

- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)

## Features

- Add a recipe
- Delete a recipe
- Edit a recipe
- Get recipes(by userId, username, category, searchTerm)
- Authentification(SignUp/Login)
- Edit user information
- Delete a user
- Upload an image to MongoDB
- Delete an image

## Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Kazumakr/MERN_OpenKitchen_backend
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter your MONGO_URL in `.env`. You can get it from here(https://cloud.mongodb.com)
   ```shell
   MONGO_URL = "ENTER YOUR CONNECTION STRING";
   ```
4. start
   ```sh
   npm start
   ```

## Usage

## User

### Create a new user(sign up)

`POST /api/auth/register`

### Login

`POST /api/auth/login`

### Get all users

`GET /api/users/`

### Get single user by id

`GET /api/users/:id/`

### Update user infomation

`PUT /api/users/:id/`

### Delete user by id

`DELETE /api/users/:id/`

Recipe

### Create a new recipe

`POST /api/recipes/`

### Update a recipe information

`PUT /api/recipes/:id`

## Delete a recipe

`DELETE /api/recipes/:id`

### Get all recipes

`GET /api/recipes/`

### Get a single recipe by id

`GET /api/recipes/:id`

### Get recipes by userid

`GET /api/recipes/ByUserId/:id`

### Get recipes by username or category or searchTerm

`GET /api/recipes/?user=`
`GET /api/recipes/?category=`
`GET /api/recipes/?search=`

### Add a comment to a recipe

`PUT /api/recipes/:id/comments`

### like

`PUT /api/recipes/:id/likes`

### unlike

`PUT /api/recipes/:id/unlikes`

Categories

### Create a new category

`POST /api/categories/`

### Get all categories

`GET /api/categories/`

Image

## Upload an image to DB

### Request

`POST /api/upload/`

## Get an image from DB

### Request

`GET /api/image/:filename`

## Delete an image from DB

### Request

`DELETE /api/image/:filename`

## License

License under the [MIT License](LICENSE)

## References

- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- [Font Awesome](https://fontawesome.com)
- [React Icons](https://react-icons.github.io/react-icons/search)
- [Qiita](https://qiita.com)
- [stack overflow](https://stackoverflow.com)
- [BezKoder](https://www.bezkoder.com)
- [mailtrap](https://mailtrap.io)
- [YouTube](https://www.youtube.com)
