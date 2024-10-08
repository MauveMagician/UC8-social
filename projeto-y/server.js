const express = require("express");
const next = require("next");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql2/promise");
const { verifyPassword, hashPassword } = require("./src/lib/auth");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // MySQL session store
    const sessionStore = new MySQLStore({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Set up session middleware
    server.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: { secure: !dev },
      })
    );

    // Set up body parser middleware
    server.use(express.json());

    // Sign up route
    server.post("/api/auth/signup", async (req, res) => {
      console.log(req.body);
      const { email, senha, nome } = req.body;

      if (!email || !senha) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      try {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });

        const [existingUser] = await connection.execute(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );

        if (existingUser.length > 0) {
          connection.end();
          return res.status(422).json({ message: "User already exists" });
        }

        const hashedPassword = await hashPassword(senha);

        await connection.execute(
          "INSERT INTO users (email, password, nome) VALUES (?, ?, ?)",
          [email, hashedPassword, nome]
        );

        connection.end();
        res.status(201).json({ message: "User created successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Handle all other routes with Next.js
    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
