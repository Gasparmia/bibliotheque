var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('emprunt/emprunt.ejs');
});

router.post('/save', function(req, res, next) {
  var data = {
    DatedEmprunt: new Date(),
    DocumentISBN: req.body.ISBN,
    EmprunteurId: req.body.ID,
  };

  req.getConnection(function(error, conn) {
    conn.query(
      'select * FROM EMPRUNT WHERE DOCUMENTISBN = ? AND DateRetour IS NULL',
      [data.DocumentISBN],
      function(err, result) {
        console.log(result);
        if (err) throw err;
        if (result && result.length > 0) {
          res.render('emprunt/emprunt.ejs', { err: 'NA' });
        } else {
          conn.query(
            "select * from EMPRUNTEUR WHERE ID= ? AND (`DateFinSanction`>= NOW() OR STATUT = 'bloqué')",
            [data.EmprunteurId],
            function(err, result) {
              console.log(result);
              if (err) throw err;
              if (result && result.length > 0) {
                res.render('emprunt/emprunt.ejs', { err: 'UB' }); //user blocked
              } else {
                conn.query('INSERT INTO EMPRUNT SET ?', data, function(
                  err,
                  result,
                ) {
                  res.render('emprunt/emprunt.ejs', {
                    err: err,
                    result: result,
                  });
                });
              }
            },
          );
        }
      },
    );
  });
});

module.exports = router;
