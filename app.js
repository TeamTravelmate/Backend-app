const express = require('express');
const app = express();
const port = 3000; // Set your desired port number

const db = require('./src/models/index');

db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
    
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});

