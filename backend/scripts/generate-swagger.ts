import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import path from "path";

const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Kurawal API",
            version: "1.0.0",
            description: "Kurawal Backend API Documentation",
        },
        servers: [
            {
                url: "/",
                description: "API Server",
            },
        ],
    },
    apis: ["src/routes/*.ts"],
});

const distDir = path.join(__dirname, "../../frontend/public");
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(path.join(distDir, "swagger.json"), JSON.stringify(swaggerSpec, null, 4));

console.log("✅ Swagger spec generated at dist/swagger.json");
