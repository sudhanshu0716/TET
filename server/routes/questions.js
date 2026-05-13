const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Questions API');
});

module.exports = router;
