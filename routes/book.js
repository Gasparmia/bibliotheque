var express = require('express');
var router = express.Router();

router.post('/add', function(req, res, next) {
  var data = {
    ISBN: req.body.ISBN,
    Titre: req.body.Titre,
    Auteur: req.body.Auteur,
    DateParution: new Date(),
    Etat: req.body.Etat,
  };
  req.getConnection(function(error, conn) {
    conn.query('INSERT INTO Document SET ?', data, function(err, result) {
      if (err) console.error(err);
      res.send('insertion reussie');
    });
  });
});

router.post('/update', function(req, res, next) {
  var data = {
    ISBN: req.body.ISBN,
    Titre: req.body.Titre,
    Auteur: req.body.Auteur,
    DateParution: new Date(),
    Etat: req.body.Etat,
  };

  var dataToUpdate = {};
  if (data.Titre) {
    dataToUpdate.Titre = data.Titre;
  }
  if (data.Auteur) {
    dataToUpdate.Auteur = data.Auteur;
  }
  if (data.DateParution) {
    dataToUpdate.DateParution = data.DateParution;
  }
  if (data.Etat) {
    dataToUpdate.Etat = data.Etat;
  }
  req.getConnection(function(error, conn) {
    conn.query(
      'update DOCUMENT SET ? WHERE ISBN = ?',
      [dataToUpdate, data.ISBN],
      function(err, rows) {
        if (err) throw pwderr;
        console.log(rows);
        if (rows.affectedRows != 0) {
          res.send(rows.changedRows + 'tuples modifies');
        } else res.send('problème de modification');
      },
    );
  });
});

router.get('/search', function(req, res, next) {
  req.getConnection(function(error, conn) {
    conn.query('Select * from Document', function(err, rows) {
      if (err) throw err;
      res.render('books/searchb.ejs', { rows: rows });
    });
  });
});

router.post('/search', function(req, res, next) {
  var data = {
    ISBN: req.body.ISBN,
    Titre: req.body.Titre,
    Auteur: req.body.Auteur,
  };

  var query = 'Select * from Document ';
  if (data.ISBN || data.Titre || data.Auteur) {
    query += 'where ISBN like ? OR Titre like ? OR Auteur like ?';
  }

  req.getConnection(function(error, conn) {
    conn.query(query, [data.ISBN, data.Titre, data.Auteur], function(
      err,
      rows,
    ) {
      if (err) throw err;
      res.render('books/searchb.ejs', { rows: rows });
    });
  });
});

router.get('/add', function(req, res, next) {
  res.render('books/createb.ejs');
});

router.get('/update', function(req, res, next) {
  res.render('books/updateb.ejs');
});
router.post('/update', function(req, res, next) {
  res.send('update');
});

router.get('/delete', function(req, res, next) {
  res.render('books/deleteb.ejs');
});
router.post('/delete', function(req, res, next) {
  req.getConnection(function(error, conn) {
    conn.query('delete from Document where ISBN = ?', [req.body.ISBN], function(
      err,
      results,
    ) {
      if (results.affectedRows > 0) {
        res.render('books/deleteb.ejs', { deleted: req.body.ISBN });
      } else {
        res.render('books/deleteb.ejs', { deleted: 'err' });
      }
    });
  });
});

module.exports = router;
