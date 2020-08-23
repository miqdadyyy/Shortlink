'use strict';

const express = require('express');
const router = express.Router();

// long_url = 'https://google.com/asdas';
// forbiddenLong = ['google.com', 'yahoo.com'];

router.get('/', (req, res) => {
   window.prompt('asd');
  const pass = prompt('Password');
  // console.log(long);
  console.log('google.com'.match(new RegExp('.*' + 'google.com' + '.*/i')));
  forbiddenLong.forEach(long => {
    if(long_url.match(new RegExp('.*' + long + '.*/i'))){
      res.send({
        msg: 'Match'
      });
    }
  });
  
  const regex = new RegExp('.*' + 'google.com' + '.*', 'i');
  res.send({
    regex,
    msg: long_url.match(regex)
  });
});

module.exports = router;
