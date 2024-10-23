const express = require("express");
const next = require("next");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql2/promise");
const { verifyPassword, hashPassword } = require("./src/lib/auth");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const fetchIdBySession = async (req) => {
  const sessionId = req.sessionID; // Get the session ID

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Fetch the session data from the sessions table
  const [rows] = await connection.execute(
    "SELECT data FROM sessions WHERE session_id = ?",
    [sessionId]
  );

  const sessionData = JSON.parse(rows[0].data);
  const email = sessionData.user ? sessionData.user.email : null;
  const [rows2] = await connection.execute(
    "SELECT user_id FROM users WHERE email = ?",
    [email]
  );
  connection.end();
  return rows2[0].user_id;
};

const fs = require("fs");
const path = require("path");

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

    server.post("/api/auth/login", async (req, res) => {
      const { email, senha } = req.body;

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

        const [user] = await connection.execute(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );

        if (user.length === 0) {
          connection.end();
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const isValid = await verifyPassword(senha, user[0].password);

        if (!isValid) {
          connection.end();
          return res.status(401).json({ message: "Invalid email or password" });
        }

        // Optionally, set up a session or token here
        req.session.user = { id: user[0].id, email: user[0].email };
        connection.end();
        res.status(200).json({ message: "Login successful" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    server.post("/api/data/post", async (req, res) => {
      const { content } = req.body;
      if (!req.session.user) {
        res.status(401).json({ message: "Not authenticated" });
      }
      const user_id = await fetchIdBySession(req);
      try {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });
        await connection.execute(
          "INSERT INTO posts (user_id, content) VALUES (?, ?)",
          [user_id, content]
        );
        connection.end();
        res.status(201).json({ message: "Post is successful" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
    // Add this route to handle requests for user data by handle
    server.get("/api/users/:handle", async (req, res) => {
      const { handle } = req.params;

      try {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });

        // Query the database for the user with the given handle
        const [user] = await connection.execute(
          "SELECT * FROM users WHERE nome = ?",
          [handle]
        );

        connection.end();

        if (user.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        // Return the user data as JSON
        res.status(200).json(user[0]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
    server.get("/api/data/pfp", async (req, res) => {
      try {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });

        const [pfp] = await connection.execute(
          "SELECT pfp.photo FROM pfp WHERE pfp.user_id =?",
          [req.query.user_id]
        );

        connection.end();

        if (pfp.length === 0) {
          return res.status(404).json({ message: "Photo not found" });
        }

        const photoPath = pfp[0].photo; // Assuming this is the path to the image file
        const absolutePath = path.resolve(photoPath);

        // Check if the file exists
        if (!fs.existsSync(absolutePath)) {
          return res.status(404).json({ message: "File not found" });
        }

        // Send the file
        res.sendFile(absolutePath);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
    server.get("/api/auth/session", (req, res) => {
      if (req.session.user) {
        res.status(200).json({ user: req.session.user });
      } else {
        res.status(401).json({ message: "Not authenticated" });
      }
    });
    //Rota que puxa todos os posts de determinado usuário no banco de dados
    server.get("/api/data/posts/", async (req, res) => {
      //Obtém o id do usuário pelo handle da requisição usando query
      const { user_id } = req.query;
      try {
        //Conectar com o banco de dados
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });
        //Realizar uma consulta para buscar todos os posts do usuário e colocar em um array
        //Enviar em um json os posts para o cliente, juntamente com o código 200
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
