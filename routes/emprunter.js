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
        if (err) throw err;
        if (result && result.length > 0) {
          res.render('emprunt/emprunt.ejs', { err: 'NA' });
        } else {
          conn.query(
            'select count(*) AS COUNT FROM EMPRUNT WHERE EmprunteurId = ? AND DateRetour IS NULL',
            [data.EmprunteurId],
            function(err, result) {
              if (err) throw err;
              if (result && result.length > 0 && result[0].COUNT >= 3) {
                res.render('emprunt/emprunt.ejs', { err: 'e=3' }); // emprunt déjà à trois
              } else {
                conn.query(
                  "select * from EMPRUNTEUR WHERE ID= ? AND (`DateFinSanction`>= NOW() OR STATUT = 'bloqué')",
                  [data.EmprunteurId],
                  function(err, result) {
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
        }
      },
    );
  });
});

//retour d'emprunt avec le get qui renvoie à la vue retour.ejs
router.get('/return', function(req, res, next) {
  res.render('emprunt/retour.ejs');
});

router.post('/savereturn', function(req, res, next) {
  req.getConnection(function(error, conn) {
    conn.query(
      'UPDATE EMPRUNT set DateRetour= NOW() WHERE NumEmprunt = ? ',
      [req.body.NumEmprunt],
      function(err, result) {
        if (err) throw err;
        res.render('emprunt/index.ejs', { err: 'NA' });
      },
    );
  });
});

module.exports = router;
