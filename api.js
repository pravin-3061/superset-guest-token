// import jwt from "jsonwebtoken";
// import express from "express";

// const router = express.Router();

// const SUPERSET_EMBED_SECRET = "oPBkuKjupuHD7e/aJh46E2UyyUcEDCjuk66z7ho4WRiMMKSOJl3hnJ0B";
// const DASHBOARD_ID = "be85acde-e374-4378-9901-1c52ee602e68"; // change this to your actual dashboard ID

// router.get("/dashboard-url", (req, res) => {
//   const { username, role } = req.query;

//   let rlsFilters = [];

//   // Admin sees all data
//   if (role !== "admin") {
//     rlsFilters.push({ clause: `username = '${username}'` });
//   }

//   const payload = {
//     user: {
//       username,
//       first_name: username,
//       roles: [role],
//     },
//     resource: {
//       type: "dashboard",
//       id: DASHBOARD_ID,
//     },
//     rls: rlsFilters,
//   };

//   const token = jwt.sign(payload, SUPERSET_EMBED_SECRET, {
//     algorithm: "HS256",
//     expiresIn: "15m",
//   });

//   const embedUrl = `http://nificluster-demo-53192132.ap-south-1.elb.amazonaws.com:8088/embedded/dashboard/${token}`;
//   res.json({ url: embedUrl });
// });

// export default router;

// api.js
// const express = require("express");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// const SUPERSET_EMBED_SECRET = "jK8d@29vmQ!xP7LzW3eTnR#5GdHuFsLb";
// const DASHBOARD_ID = "99989815-1d94-445d-85ab-982e75e07488"; // change this to your actual dashboard ID

// app.get("/api/dashboard-url", (req, res) => {
//   const { username, role } = req.query;

//   const token = jwt.sign(
//     {
//       user: {
//         username: username,
//         first_name: username,
//         roles: [role], // Example: 'Gamma' or 'Admin'
//       },
//       resource: {
//         type: "dashboard",
//         id: DASHBOARD_ID,
//       },
//       rls: role !== "admin" ? [{ clause: `username = '${username}'` }] : [],
//     },
//     SUPERSET_EMBED_SECRET,
//     {
//       algorithm: "HS256",
//       expiresIn: "10m",
//     }
//   );

//   const embedUrl = `http://localhost:8088//embedded/dashboard/${token}`;
//   res.json({ url: embedUrl });
// });

// app.listen(3001, () => {
//   console.log("Dashboard JWT server running on http://localhost:3001");
// });
// api.js
//jK8d@29vmQ!xP7LzW3eTnR#5GdHuFsLb

//http://localhost:8088/superset/dashboard/p/VyJA2XeOZqw/


// // server.js
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// //require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // API to get only Guest Token
// app.get("/api/get-guest-token", async (req, res) => {
//   try {
//     // Step 1: Login to get access token
//     const loginResponse = await axios.post(
//       `http://localhost:8088/api/v1/security/login`,
//       {
//         username: "admin",
//         password: "Achal@3061",
//         provider: "db",
//         refresh: true,
//       },
//       { headers: { "Content-Type": "application/json" } }
//     );

//     const accessToken = loginResponse.data.access_token;

//     // Step 2: Use access token to get guest token
//     const guestTokenResponse = await axios.post(
//       `http://localhost:8088/api/v1/security/guest_token/`,
//       {
//         resources: [{ type: "dashboard", id: "99989815-1d94-445d-85ab-982e75e07488" }],
//         rls: [],
//         user: {
//           username: "report-viewer",
//           first_name: "Report",
//           last_name: "Viewer",
//         },
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     const guestToken = guestTokenResponse.data.token;
//     res.json({ guestToken });
//   } catch (error) {
//     console.error("Error generating guest token", error);
//     res.status(500).json({ error: "Failed to generate guest token" });
//   }
// });

// const PORT =4000;
// app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

//---------------------------------------------------------------------------------------------------------------
// server.js
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post("/api/get-guest-token", async (req, res) => {
//   const { username, level } = req.body;

//   // decide dashboard id based on level
//   let dashboardId = "";
//   if (level === "admin") {
//     dashboardId = process.env.ADMIN_DASHBOARD_ID;
//   } else if (level === "user") {
//     dashboardId = process.env.USER_DASHBOARD_ID;
//   } else {
//     return res.status(400).json({ error: "Invalid level" });
//   }

//   try {
//     // login to superset
//     const loginResponse = await axios.post(
//       `${process.env.SUPERSET_DOMAIN}/api/v1/security/login`,
//       {
//         username: process.env.SUPERSET_USER,
//         password: process.env.SUPERSET_PASSWORD,
//         provider: "db",
//         refresh: true,
//       },
//       { headers: { "Content-Type": "application/json" } }
//     );

//     const accessToken = loginResponse.data.access_token;

//     // generate guest token
//     const guestTokenResponse = await axios.post(
//       `${process.env.SUPERSET_DOMAIN}/api/v1/security/guest_token/`,
//       {
//         resources: [{ type: "dashboard", id: dashboardId }],
//         rls: [],
//         user: {
//           username: username,
//           first_name: username,
//           last_name: level,
//         },
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     const guestToken = guestTokenResponse.data.token;
//     res.json({ guestToken, dashboardId });
//   } catch (error) {
//     console.error("Error generating guest token", error);
//     res.status(500).json({ error: "Failed to generate guest token" });
//   }
// });

// const PORT =4000;
// app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));


// //api key 
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Middleware to check API Key
// const authenticateApiKey = (req, res, next) => {
//   const clientApiKey = req.headers['x-api-key']; // API key sent in headers

//   if (!clientApiKey) {
//     return res.status(401).json({ error: "API key missing" });
//   }

//   if (clientApiKey !== process.env.MY_SECRET_API_KEY) {
//     return res.status(403).json({ error: "Invalid API key" });
//   }

//   next();
// };

// app.post("/api/get-guest-token", authenticateApiKey, async (req, res) => {
//   const { level, userid } = req.body;
//   console.log(userid,  level + "---------------------------------");

//   let dashboardId = "";
//   if (level === "admin") {
//     dashboardId = process.env.ADMIN_DASHBOARD_ID;
//   } else if (level === "user") {
//     dashboardId = process.env.USER_DASHBOARD_ID;
//   } else {
//     return res.status(400).json({ error: "Invalid level" });
//   }

//   try {
//     const loginResponse = await axios.post(
//       `${process.env.SUPERSET_DOMAIN}/api/v1/security/login`,
//       {
//         username: process.env.SUPERSET_USER,
//         password: process.env.SUPERSET_PASSWORD,
//         provider: "db",
//         refresh: true,
//       },
//       { headers: { "Content-Type": "application/json" } }
//     );

//     const accessToken = loginResponse.data.access_token;

//     // 👉 FIX: Declare this BEFORE
//     let guestTokenResponse;

//     if (level === "user") {
//       guestTokenResponse = await axios.post(
//         `${process.env.SUPERSET_DOMAIN}/api/v1/security/guest_token/`,
//         {
//           "resources": [{ "type": "dashboard", "id": dashboardId }],
//           "rls": [
//             { "clause": `userid = ${userid}` }
//           ],
//           "user": {
//             "username": "user6816",
//             "first_name": "pravin",
//             "last_name": "chaudhari",
//             "userid": userid
//           }
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//     } else {
//       guestTokenResponse = await axios.post(  // 👈 ADD guestTokenResponse here also
//         `${process.env.SUPERSET_DOMAIN}/api/v1/security/guest_token/`,
//         {
//           "resources": [{ "type": "dashboard", "id": dashboardId }],
//           "rls": [],
//           "user": {
//             "username": "user6816",
//             "first_name": "pravin",
//             "last_name": "chaudhari",
//             // No userid needed here
//           }
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//     }

//     // Now this will always work ✅
//     const guestToken = guestTokenResponse.data.token;
//     res.json({ guestToken, dashboardId });

//   } catch (error) {
//     console.error("Error generating guest token", error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to generate guest token" });
//   }
// });


// const PORT = 4000;
// app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
// //-------------------------------------
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

// Swagger UI and Swagger JSDoc dependencies
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for the backend',
    },
    servers: [
      {
        url: 'http://localhost:4000', // Adjust if your server URL differs
      },
    ],
  },
  apis: ['./api.js'], // Path to the API routes (current file)
};

// Initialize Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware to check API Key
const authenticateApiKey = (req, res, next) => {
  const clientApiKey = req.headers['x-api-key']; // API key sent in headers

  if (!clientApiKey) {
    return res.status(401).json({ error: "API key missing" });
  }

  if (clientApiKey !== process.env.MY_SECRET_API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
};
/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: My API
 *   version: 1.0.0
 *   description: API documentation for the backend
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-api-key
 * security:
 *   - ApiKeyAuth: []  # Apply API key security globally to all endpoints
 * /api/get-guest-token:
 *   post:
 *     summary: Generate guest token for a dashboard
 *     description: Generates a guest token with role-based access for the specified dashboard. 
 *                  You must include the API key in the request headers.
 *                  For **users**, you need to pass both `level` and `userid`. 
 *                  For **admins**, you only need to pass `level`.
 *     tags:
 *       - Auth
 *     security:
 *       - ApiKeyAuth: []  # Security defined for this specific endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               level:
 *                 type: string
 *                 description: User's access level (admin or user)
 *                 example: user
 *               userid:
 *                 type: string
 *                 description: User ID to be used in the guest token (required only for users)
 *                 example: "6816"
 *             required:
 *               - level
 *             oneOf:
 *               - required:
 *                   - level
 *                   - userid
 *               - required:
 *                   - level
 *     responses:
 *       200:
 *         description: Guest token and dashboard ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 guestToken:
 *                   type: string
 *                   description: The generated guest token
 *                   example: "abcdef123456"
 *                 dashboardId:
 *                   type: string
 *                   description: The dashboard ID
 *                   example: "abcd1234"
 *       400:
 *         description: Invalid level or missing parameters
 *       401:
 *         description: Unauthorized - Invalid or missing API key. You must provide a valid API key in the request header (`x-api-key`).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "API key missing or invalid"
 *       403:
 *         description: Forbidden - Invalid API Key
 *       500:
 *         description: Internal server error
 */

app.post("/api/get-guest-token", authenticateApiKey, async (req, res) => {
  const { level, userid } = req.body;
  console.log(userid,  level + "---------------------------------");

  let dashboardId = "";
  if (level === "admin") {
    dashboardId = process.env.ADMIN_DASHBOARD_ID;
  } else if (level === "user") {
    dashboardId = process.env.USER_DASHBOARD_ID;
  } else {
    return res.status(400).json({ error: "Invalid level" });
  }

  try {
    const loginResponse = await axios.post(
      `${process.env.SUPERSET_DOMAIN}/api/v1/security/login`,
      {
        username: process.env.SUPERSET_USER,
        password: process.env.SUPERSET_PASSWORD,
        provider: "db",
        refresh: true,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const accessToken = loginResponse.data.access_token;

    // 👉 FIX: Declare this BEFORE
    let guestTokenResponse;

    if (level === "user") {
      guestTokenResponse = await axios.post(
        `${process.env.SUPERSET_DOMAIN}/api/v1/security/guest_token/`,
        {
          "resources": [{ "type": "dashboard", "id": dashboardId }],
          "rls": [
            { "clause": `userid = ${userid}` }
          ],
          "user": {
            "username": "user6816",
            "first_name": "pravin",
            "last_name": "chaudhari",
            "userid": userid
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } else {
      guestTokenResponse = await axios.post(  // 👈 ADD guestTokenResponse here also
        `${process.env.SUPERSET_DOMAIN}/api/v1/security/guest_token/`,
        {
          "resources": [{ "type": "dashboard", "id": dashboardId }],
          "rls": [],
          "user": {
            "username": "user6816",
            "first_name": "pravin",
            "last_name": "chaudhari",
            // No userid needed here
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }

    // Now this will always work ✅
    const guestToken = guestTokenResponse.data.token;
    res.json({ guestToken, dashboardId });

  } catch (error) {
    console.error("Error generating guest token", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate guest token" });
  }
});


const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
