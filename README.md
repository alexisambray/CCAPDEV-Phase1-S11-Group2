# CCAPDEV-MP-S11-Group2
This is a collaborative group project for CCAPDEV MP made by S11 Group 2 (Alvarez, Ambray, Ang, Umali).

## About VisiTOUR

**VisiTOUR** is a web application that focuses on photo sharing, wherein users can freely upload and share photos of their travels. Its name came from the words *Visitor* and *Tour*. It serves as a photo gallery for multiple users and can allow them to bond over their past or recent travels. Since it is common for travelers to take photographs of the different places they went to, the website can serve as a place to indulge in various pictures taken by users while they traveled.

The website is deployed at https://apdev-visitour.cyclic.sh.

### Environment:
- The application is built following the MVC architecture.
    - *Models:* **MySQL**
    - *Views:* **EJS**
    - *Controllers:* **Node.js**
- For deployment, the application is hosted on the following:
    - **Cyclic.sh**, for the controllers and views
    - **DigitalOcean**, for the MySQL database
    - **Google Cloud Storage**, for the image upload function

## Running App Locally

Below are simple instructions on how to set-up and to run the application locally through a Node.js server:

### Prerequisites:
- Download NodeJS (recommended for most users) from http://nodejs.org.
- Check if installed successfully by typing `node --version` in CMD.
- For developers:
    - Install Nodemon to your machine globally by typing `npm install -g nodemon` in CMD.
    - Check if installed successfully by typing `nodemon --version` in CMD.
- Make sure to have MySQL Workbench installed and functional.
- Make sure to have a dotenv (.env) file with the necessary database, cloud, and session variables.
- Make sure to have a key (in .json file format) associated to the Google Cloud Storage project where the bucket is found.

### Setting up DotEnv:

If you **do not** yet have a dotenv file, follow these steps:
- The following variables are contained in the dotenv (.env) file:
    - `DB_HOST`, `DB_USER`, `DB_PORT`, `DB_PASS`
    - `SESH_SECRET`
- All variables that begin with **“DB”** are associated to the database.
    - `DB_HOST`: The hostname.
        - For local deployment, the default for MySQL is port `localhost`.
    - `DB_USER`: The username.
        - For local deployment, the default for MySQL is port `root`.
    - `DB_PORT`: The port where the database connection is running.
        - For local deployment, the default for MySQL is port `3306`.
    - `DB_PASS`: The password associated to the user.
- All variables that begin with **“SESH”** are associated to the session.
    - `SESH_SECRET`: The session secret. Assign any random string for local deployment.

If you received this application with an **existing dotenv file**:
- Modify the variables to match your local settings.

### Instructions:
- Open “db for cloud.sql” from model folder in MySQL Workbench
- Execute the script (use the lightning button) to create the database
- Open command prompt (CMD)
- CD to the application location
- Type `npm install` in CMD to build the application
    - If you received this application with an existing node_modules folder, skip this step
- Type `npm start` in CMD to run the application
    - Alternative scripts:
        - `node server.js`
        - For developers:
            - `npm run dev`
            - `nodemon server.js`
- Type `localhost:3000` in your preferred browser

### Debugging:
- If you experience `ER_NOT_SUPPORTED_AUTH_MODE` error, modify and run “for_workbench_debug.sql” (found in model folder) in MySQL Workbench
    - Replace the values (i.e. `root`, `localhost`, and the set password) to match your database settings