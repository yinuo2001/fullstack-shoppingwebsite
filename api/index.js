import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Deals with Product table
// Only Auth0 users can search for products
app.get("/products/:name", requireAuth, async (req, res) => {
  const { name } = req.params;
  const products = await prisma.product.findMany({
    where: {
      title: {
        contains: name,
      },
    },
  });
  res.json(products);
});

// A list of all products are displayed to all users
app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// Deals with Comment table
// All users can see all comments in this website
app.get("/comments", async (req, res) => {
  const comments = await prisma.comment.findMany();
  res.json(comments);
});

// Auth0 users can add a comment
app.post("/comments", requireAuth, async (req, res) => {
  const { text } = req.body;
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const comment = await prisma.comment.create({
    data: {
      userId: user.id,
      text,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  res.json(comment);
});

// Auth0 users can delete their own comments
app.delete("/comments/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const auth0Id = req.auth.payload.sub;

  const comment = await prisma.comment.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      user: true,
    },
  });

  if (comment.user.auth0Id !== auth0Id) {
    return res.status(403).json({ error: "You can't delete this comment" });
  }

  await prisma.comment.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.json({ message: "Comment deleted" });
});

// Deals with User table
// Auth0 users can get their own user information
app.get("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  res.json(user);
});

// Auth0 users can update their user information
app.put("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { email, name } = req.body;
  const user = await prisma.user.update({
    where: {
      auth0Id,
    },
    data: {
      email,
      name,
    },
  });
  res.json(user);
});

// Auth0 users can delete their account
app.delete("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.delete({
    where: { auth0Id },
  });
  res.json(user);
});

// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  // we are using the audience to get the email and name from the token
  // if your audience is different you should change the key to match your audience
  // the value should match your audience according to this document: https://docs.google.com/document/d/1lYmaGZAS51aeCxfPzCwZHIk6C5mmOJJ7yHBNPJuGimU/edit#heading=h.fr3s9fjui5yn
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});