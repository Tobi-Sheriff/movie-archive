const { sequelize } = require('./models/index');

sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
    });