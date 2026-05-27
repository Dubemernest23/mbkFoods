const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MBK Foods API Documentation",
            version: "1.0.0",
            description: "API endpoints for the MBK Foods food ordering system, including admin panel, user profiles, authentication, food menu, orders, and Paystack payments.",
            contact: {
                name: "MBK Foods Support",
                email: "support@mbkfoods.com"
            }
        },
        servers: [
            {
                url: "http://localhost:3060",
                description: "Local development server"
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT token in the format: Bearer <token>"
                }
            }
        }
    },
    apis: [
        "./server/module/**/*.routes.js",
        "./server/module/**/*.js",
        "./server/route/*.js"
    ]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec
};
