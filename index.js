//index.js
require('dotenv').config();
const express = require('express');
const app = express();
const superAdminRoutes = require('./routes/superAdminRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swaggerConfig');
const generalUserRoutes = require('./routes/generalUserRoutes');
const wordRoutes = require('./routes/wordRoutes'); // Assuming wordRoutes is a separate file
const userRequestRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const analyticRoutes = require('./routes/analyticRoutes');const authRouter = require('./routes/oauth');
const adminRoutes = require('./routes/adminRoutes');

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users', generalUserRoutes);
app.use('/words', wordRoutes);
app.use('/api/user-requests', userRequestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticRoutes);
app.use('/superadmin', superAdminRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
