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

function sanction(EmprunteurId, NbSanction, conn) {
  // Sanction
  var DateFinSanction = new Date();
  DateFinSanction.setDate(DateFinSanction.getDate() + NbSanction);
  var updates = {
    Statut: 'bloqué',
    DateDebSanction: new Date(),
    DateFinSanction: DateFinSanction,
  };
  conn.query(
    'UPDATE EMPRUNTEUR set ? WHERE ID = ?',
    [updates, EmprunteurId],
    function(err) {
      if (err) throw err;
      console.log('user : ' + EmprunteurId + ' bloqué');
    },
  );
}

router.post('/return', function(req, res, next) {
  req.getConnection(function(error, conn) {
    conn.query(
      'SELECT * FROM EMPRUNT WHERE NumEmprunt = ? ',
      [req.body.NumEmprunt],
      function(err, result) {
        if (err) throw err;
        if (result && result.length) {
          var NbSanction = Number(req.body.NbSanction);
          if (NbSanction > 0) {
            sanction(result[0].EmprunteurId, NbSanction, conn);
          } else {
            conn.query('Select * from Parametre', function(err, parametres) {
              if (err) throw err;
              var DureeMaxEmprunt = parametres[0].DureeMaxEmprunt;
              var dateEmprunt = new Date(result[0].DatedEmprunt);
              var dateEmpruntPlus15 = new Date(result[0].DatedEmprunt);
              dateEmpruntPlus15.setDate(
                dateEmprunt.getDate() + DureeMaxEmprunt,
              );
              if (Date.now() > dateEmpruntPlus15.getTime()) {
                sanction(
                  result[0].EmprunteurId,
                  parametres[0].DureeMaxSanction,
                  conn,
                );
              }
            });
          }
        }
      },
    );

    conn.query(
      'UPDATE EMPRUNT set DateRetour= NOW() WHERE NumEmprunt = ? ',
      [req.body.NumEmprunt],
      function(err, result) {
        if (err) throw err;
        res.render('emprunt/retour.ejs');
      },
    );
  });
});

module.exports = router;
