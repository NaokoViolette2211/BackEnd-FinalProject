const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

const corsOptions = {
  origin: '*',
  credentials: true,
  'access-control-allow-credentials': true,
  optionSuccessStatus: 200,
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  try{
    req.db = await pool.getConnection();
    req.db.connection.config.namedPlaceholders = true;

    await req.db.query('SET SESSION sql_mode = "TRADITIONAL"');
    await req.db.query('SET time_zone = "-8:00"');

    await next();

    req.db.release();
  } catch(err) {
    console.error(`error: ${err}`);
    if(req.db) req.db.release();
    throw err;
  }
});


app.post('/register', async(req, res) => {
  try {
    const {username, email, password} = req.body;
    
    const [existingUser] = await req.db.query(`SELECT * FROM users WHERE email = :email`, {email});

    if(existingUser.length > 0) {
      return res.status(400).json({error: 'Email already registered'});
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const [users] = await req.db.query(
      `INSERT INTO users (username, email, password)
      VALUES (:username, :email, :hashedPassword);`,
      {
        username, 
        email,
        hashedPassword
      }
    );

    const jwtEncodedUser = jwt.sign(
      {
        userId: users.insertId,
        username
      },
      process.env.JWT_KEY
    );

    res.json({jwt: jwtEncodedUser, success: true});
    
  } catch (error) {
    console.error(`error: ${error}`);
    res.json({error, success: false});
  }
});


app.post('/login', async(req, res) => {
  try {
    const {email, password: userEnteredPassword} = req.body;
    console.log('email:', email, 'password:', userEnteredPassword)
    const [[user]] = await req.db.query(`SELECT * FROM users WHERE email = :email;`,
    {
      email
    });

    if(!user) res.json('Email not found');

    const hashedPassword = user.password;

    const passwordMatches = await bcrypt.compare(userEnteredPassword, hashedPassword);

    if(passwordMatches) {
      const payload = {
        userId: user.id,
        email: user.email,
      }

      const jwtEncodedUser = jwt.sign(payload, process.env.JWT_KEY);
      res.json({jwt: jwtEncodedUser, success: true});

    } else{
      res.json({error: 'Password is wrong', success: false});
    }

  } catch (error) {
    console.error('Error in /authenticate', error);
  }
});


app.use(async function verifyJwt(req, res, next) {
  const { authorization: authHeader } = req.headers;

  if(!authHeader) res.status(400).json('Invalid authorization, no authorization header');

  const authParts = authHeader.split(' ');
  
  if(authParts.length !== 2 || authParts[0] !== 'Bearer'){
    return res.status(400).json('Invalid authorization, invalid authorization format')
  } 

  const jwtToken = authParts[1];

  try {
    const decodedJwtObject = jwt.verify(jwtToken, process.env.JWT_KEY);
    req.user = decodedJwtObject;
  } catch (error) {
    console.error("error:", error);
    if(error.message && (error.message.toUpperCase() === 'INVALID TOKEN' || error.message.toUpperCase() === 'JWT EXPIRED')){
      res.status(error.status || 500).json(error.message);
      req.body = err.message;
      req.app.emit('jwt-error', error, req);
    }else{
      res.status(error.status || 500).json(error.message || 'Internal Server Error');
    }
    return;
  }
  await next();
});

//add new recipe to database
app.post('/create', async(req, res) => {
  const {
    title,
    img,
    date,
    ingredients, 
    directions,
    notes,
    user_id
  } = req.body;

  const { userId } = req.user;
  const [insert] = await req.db.query(`
  INSERT INTO recipes (title, img, date, ingredients, directions, notes, user_id)
  VALUES (:title, :img, NOW(), :ingredients, :directions, :notes, :user_id);`,
  {
    title, 
    img, 
    ingredients,
    directions,
    notes,
    user_id: userId
  });

  res.json({
    id: insert.insertId,
    title,
    img, 
    ingredients,
    directions,
    notes,
    userId
  });

});

app.put('/recipe/:id', async(req, res) => {
  const {id: recipeId} = req.params;
  const {id, title, img, ingredients, directions, notes} = req.body;

  const [recipeData] = await req.db.query(
    `UPDATE recipes SET title = :title, img = :img, ingredients = :ingredients, directions = :directions, notes = :notes WHERE id = :id`,
    {
      id: recipeId,
      title, 
      img, 
      ingredients,
      directions,
      notes, 
    }
  );
  res.json({id: recipeId, title, img, ingredients, directions, notes, success: true})
})

app.get('/recipes/:id', async(req, res) => {
  const {id: recipeId} = req.params;
  const [recipeData] = await req.db.query(`SELECT * FROM recipes WHERE id = :recipeId;`,{recipeId});
  res.json(recipeData)
});

app.get('/recipes', async(req, res) => {
  const userId = req.user.userId;
  try{
    const [recipeData] = await req.db.query(`SELECT * FROM recipes WHERE deleted_flag = 0 AND user_id = :userId`,{userId}
    );
    res.json(recipeData)
  }catch(error){
    console.error('Error fetching recipes:', error);
    res.status(500).json({error: 'An error occurred while fetching recipes.'});
  }
});

app.delete('/recipe/:id', async(req, res) => {
  const {id: recipeId} = req.params;

  await req.db.query(`UPDATE recipes SET deleted_flag = 1 WHERE id = :recipeId`, {recipeId})

  res.json({success: true});
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
})
