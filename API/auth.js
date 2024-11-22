const prisma = require ("../prisma");

const express = require(`express`);
const router = express.Router();

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// jwt.sign creates a token w/ id = payload and JWT_SECRET = key
const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {expiresIn: "1 d"});
};

router.use( async(req, res, next) => {
  try{
    const { id } =  jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUniqueOrThrow({ where: { id }, });
    req.user = user;
    next();
  }catch(e) {
    next(e);
  };
});

router.post("/signUp", async (req, res, next) => {
  const { username, password } = req.body;
  
  try{
    const user = await prisma.user.signUp(username, password);
    const token = createToken(user.id);
    res.status(201).json({ token })
  }catch(e) {
    next(e);
  };
  
});


router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  
  try {
    const user = await prisma.user.login(username,password);
    const token = createToken(user.id);
    res.json({ token });
  } catch(e) {
    next(e);
  };
  
});

const authenticate = (req, res, next) => {
  if (req.user) {
    next ();
  } else {
    next({ status: 401, message: `You must be logged in.`});
  }
}
module.exports = { router, authenticate };