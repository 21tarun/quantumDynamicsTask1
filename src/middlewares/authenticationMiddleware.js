const jwt= require('jsonwebtoken')

const authenticateUser = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, 'task1',function(err,decoded){
        if(err){
          return res.json({Error: err.message});
        }
        else{
            req.userId = decoded.userId;
            req.userName=decoded.userName
            // console.log(req.userId)
            next();
        }
      });

    } catch (error) {
      res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports.authenticateUser=authenticateUser