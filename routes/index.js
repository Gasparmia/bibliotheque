var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('index.ejs', { title: 'GESTIONNAIRE DE BIBLIOTHEQUE' });
});

module.exports = router;
