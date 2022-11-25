# CCAPDEV-MP-S11-Group2
This is a collaborative group project for CCAPDEV MP made by S11 Group 2 (Alvarez, Ambray, Ang, Umali)

Below are simple instructions on how to set-up and to run the application locally through a Node.js server:

Prerequisites:
- Download NodeJS (recommended for most users) from http://nodejs.org
- Check if installed successfully by typing “node --version” in CMD
- For developers:
    - Install Nodemon to your machine globally by typing “npm install -g nodemon” in CMD
    - Check if installed successfully by typing “nodemon --version” in CMD
- Make sure to have MySQL Workbench installed and functional
- Under Database in server.js, modify user and password to match your host server settings

Instructions:
- CD to the application location
- Type “npm start” in CMD 
    - Alternative scripts:
        - “node server.js”
        - “nodemon server.js” (for developers)
- Type “localhost:3000” in your preferred browser

Debugging:
- If you experience “ER_NOT_SUPPORTED_AUTH_MODE” error, run “for_workbench_debug.sql” (found in model folder) in MySQL Workbench
