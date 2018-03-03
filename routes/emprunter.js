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
    conn.query('INSERT INTO EMPRUNT SET ?', data, function(err, result) {
      res.render('emprunt/emprunt.ejs', { result });
    });
  });
});

// router.post('/save', function(req, res, next) {

//     conn.query( 'Select ISBN from EMPRUNT WHERE datedEmprunt = ?', [emprunt], function (err, result) {
//         if (err) throw(err);
//     });
// res.render ('emprunt/emprunt.ejs')
// //envoyer requête pour correction a achref

// //console.log(req.body.isbn);
//   /*
// //var data = {

//     NumEmprunt: req.body.NumEmprunt;
//     DatedEmprunt: req.body.DatedEmprunt;
//     DateRetour: req.body.DateRetour;
//     ISBN: req.body.ISBN;
//     ID: req.body.ID;
// };*/

//   req.getConnection(function(error, conn) {
//     /*conn.query('SELECT * FROM EMPRUNTEUR,EMPRUNT WHERE EMPRUNTEUR.ID= EMPRUNT.ID'){
//     conn.query('SELECT COUNT(*)  FROM emprunter where ID= ? ', [req,ID], function(err, result) {
//         if ( rowsemprunteur.n <= rows.nbreemprunt){
//             VAR DATA =
//             DatedEmprunt: DATE();
//             ID: req.body.ID;
//             ISBN: req.body.ISBN;
//         }
//         else
//         conn.query('insert into Emprunt set ?', data, function(err,result) {
//         if (err) console.error(err);
//         res.redirect('/emprunter');

//         con.query('update set etat = ? where etat= ?,[emprunts,req.body.isbn], function (err, rows) {
//         }
//         })
// else
// alert("nombre d'emprunt maximum atteint") ;

//         if (err) throw(err);

//       })};
//       }

//         conn.query('SELECT ID FROM emprunt WHERE dateretour = UNDEFINED;'),data, function (err,result)
//       ) {

//       }
//     });
//   });*/
//   });
// });

module.exports = router;
