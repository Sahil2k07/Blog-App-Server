# Blog App with Auth - server

## Description

This is the backend of the Blog App. In this app, the user can create, update, read and delete
his/her created Blog posts. The user can also see the posts of different users.

The Blog App has Authentication features

- `Signup` signup is done through an OTP verification, which is done by sending an email to the user
- `Login` login by the same email and password.

## Technologies Used

- Typescript
- Express
- Mongoose
- Nodemailer
- Zod

## Set-Up this project locally

1. First clone this project locally.

   ```bash
   git clone https://github.com/Sahil2k07/Blog-App-Server.git
   ```

2. Move to the project directory.

   ```bash
   cd Blog-App-Server
   ```

3. Make sure you have Typescript installed globally

   ```bash
   npm i -g typescript
   ```

4. Install all the dependencies.

   ```bash
   npm i
   ```

5. Set up all the required env variable by making a `.env` file. An example file for it is given.

   ```dotenv
   MONGO_URL=

   PORT=

   JWT_SECRET=

   # Nodemailer Details
   MAIL_HOST=
   MAIL_USER=
   MAIL_PASS=
   ```

6. Build the working dist file.

   ```bash
   tsc -b
   ```

7. Run the final command to ignite the Project.
   ```bash
   npm run start
   ```
