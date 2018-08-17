
const mongoose = require('mongoose');
const moment = require('moment');
const User = mongoose.model('User');
const Exercise = mongoose.model('Exercise');

module.exports = app => {
  
  // Create a New User
  app.post("/api/exercise/new-user", async (req, res) => {
    // get username
    const username = req.body.username;
    
    // check for empty username
    if(username === '') return res.send("Path `username` is required.");
    
    // check for existing username
    await new User({ username }).save((error, user) => {
      if(error)  return res.send(error);
      return res.json({ 
        username: user.username, 
        _id: user.userId 
      });
    });
  });
  
  // Add exercises
  app.post("/api/exercise/add", async (req, res) => {
    // get form data
    const userId = req.body.userId;
    const description = req.body.description;
    const duration = req.body.duration;
    const date_string = req.body.date;
    
    // search user with input userId
    const existingUser = await User.findOne({ userId });
    if(!existingUser) return res.send("unknown _id");
    
    // validate rest of form data
    if(description === '')  return res.send("Path `description` is required.");
    else if(duration === '')  return res.send("Path `duration` is required.");
    else if(isNaN(duration))  return res.send(`Cast to Number failed for value "${duration}" at path "duration"`);
    
    // validate date if available
    let timestamp = (date_string === "") ? moment() : moment(date_string);
    //console.log(timestamp);
    // moment("2018-09-21T00:00:00.000")
    // moment.invalid(/* 2018-19-21 */)
    if(!timestamp.isValid())
      return res.send(`"Cast to Date failed for value "${date_string}" at path "date"`);
          
    // create exercise and use id to link to user
    await new Exercise({
      _userId: existingUser.id,
      description,
      duration,
      date: timestamp.format("YYYY-MM-DD")
    }).save((error, exercise) => {
      if(error) return res.send(error);
      return res.json({
        username: existingUser.username,
        description: exercise.description,
        duration: exercise.duration,
        _id: existingUser.userId,
        date: moment(exercise.date).format('ddd MMM DD YYYY')
      });
    });
  });
   
  // GET users's exercise log
  app.get("/api/exercise/log", async (req, res) => {
    // ?{userId}[&from][&to][&limit]
    // get query parameters
    const userId = req.query.userId;
    const from = req.query.from;
    const to = req.query.to;
    const limit = req.query.limit;
    
    // search user with input userId
    const existingUser = await User.findOne({ userId });
    if(!existingUser) return res.send("unknown _id");
    
    // construct query object
    const query = {
      _userId: existingUser.id
    };
    
    // date options available?
    if(from || to) {
      query.date = {};
      if(from)  query.date.$gte = moment(from).format('YYYY-MM-DD');
      if(to)    query.date.$lte = moment(to).format('YYYY-MM-DD');
    }
    //console.log(query);
    
    // find all exercises with given userId 
    const exercises = await Exercise.find(query).sort({ 'date': -1 }).limit(parseInt(limit));  
        
    const log = exercises.map(({ description, duration, date }) => ({ 
      description, 
      duration, 
      date: moment(date).format('ddd MMM DD YYYY') }));

    return res.json({
      _id: userId,
      from: from ? moment(from).format('ddd MMM DD YYYY') : undefined,
      to: to ? moment(to).format('ddd MMM DD YYYY') : undefined,
      username: existingUser.username,
      count: exercises.length,
      log : log
    });
  });
};