var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  req.getConnection(function(error, conn) {
    conn.query('Select * from EMPRUNTEUR where Statut != "bloqué"', function(
      err,
      rows,
    ) {
      if (err) throw err;
      res.render('emprunteur/index.ejs', { rows: rows });
    });
  });
});

router.get('/add', (req, res) => {
  res.render('emprunteur/create.ejs');
});

router.post('/add', (req, res) => {
  var data = {
    Nom: req.body.Nom,
    Prenom: req.body.Prenom,
    Statut: 'disponible',
  };

  req.getConnection(function(error, conn) {
    conn.query('INSERT INTO Emprunteur SET ?', data, function(err, result) {
      if (err) console.error(err);
      res.redirect('/emprunteur');
    });
  });
});

module.exports = router;
