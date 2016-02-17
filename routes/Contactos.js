var express = require("express");
var router = express.Router();
var conexion = require("../utils/conexion");


// select * from contactos filtrado
router.get("/", function (req, res, next) {
    var search = req.query.buscar;
    var sql = 'SELECT * FROM contactos';

    if(search.length != undefined){
        //TODO:  ESCAPEAR ESTO SLQ INJECTION con conexion
        sql = ('SELECT * FROM contactos WHERE nombre LIKE "%'+search+'%" OR idcont LIKE "%'+search+'%" OR empresa LIKE "%'+search+'%"');
    }
        conexion.query(sql, function (err, resultado) {
            if (err) {
                res.status(500).json({"error": err, "message": "Ha ocurrido un error "});
                next();
            } else {
                res.json({"result": resultado}).status(200);
            }
        });

});

    // seleccionar un solo contacto mediante id
router.get("/:idContacto", function (req, res, next) {
    var idContacto = req.params.idContacto;
    if (idContacto != undefined || idContacto > 0) {
        conexion.query('SELECT * FROM contactos where idcont = ?', [idContacto], function (err, resultado) {
            if (err) {
                res.status(500).json({"error": err, "message": "Ha ocurrido un error, favor de verificar "});
                next();
            } else {
                var cantidad = resultado.length;
                if (cantidad > 0) {
                    res.json({"result": resultado, "cantidad": cantidad}).status(200);
                } else {
                    res.status(204);
                    next();
                }
            }
        });
    } else {
        res.status(401);
    }
});

// insert into contactos
router.post("/", function (req, res, next) {
    var nuevocontacto = req.body;
    console.log("nuevo Contacto: ",nuevocontacto)
    if (nuevocontacto.nombre != undefined && nuevocontacto.empresa != undefined && nuevocontacto.email != undefined && nuevocontacto.telefono != undefined ) {
        conexion.query('INSERT INTO contactos (nombre, empresa, email, telefono) VALUES (?,?,?,?)', [nuevocontacto.nombre, nuevocontacto.empresa, nuevocontacto.email, nuevocontacto.telefono], function (err, resultado) {
            console.log(resultado);
            if (err > 1) {
                res.status(500).json({"error": err, "message": "Error "});
                next();
            } else {
                var cantidad = resultado.affectedRows;
                if (cantidad > 0) {
                    res.status(200).json();

                } else {
                    res.status(400).json();

                }
            }
        });
    } else {
        res.status(500).json();

    }
});

//actualizar por medio de id
router.post("/:idContacto", function (req, res, next) {
    var idcontacto = req.params.idContacto;
    var nombre = req.body.nombre;
    var empresa = req.body.empresa;
    var email = req.body.email;
    var tel = req.body.telefono;
    if (idcontacto != undefined || idcontacto > 0) {
        conexion.query('UPDATE contactos SET  nombre = ?, empresa = ?, email =?, telefono = ?  where idcont = ?', [ nombre, empresa, email, tel, idcontacto], function (err, resultado) {
            console.log(resultado);
            if (err > 1) {
                res.status(500).json({"error": err, "message": "Error "});
                next();
            } else {
                var cantidad = resultado.affectedRows;
                if (cantidad > 0) {
                    res.status(200).json();

                } else {
                    res.status(400).json();

                }
            }
        });
    } else {
        res.status(500).json();

    }
});
//delete
router.delete("/:idContacto", function (req, res, next) {
    var idContacto = req.params.idContacto;
    if (idContacto != undefined || idContacto > 0) {
        conexion.query('DELETE FROM contactos where idcont = ?', [idContacto], function (err, resultado) {
            console.log(resultado);
            if (err > 1) {
                res.status(500).json({"error": err, "message": "Error "});
                next();
            } else {
                var cantidad = resultado.affectedRows;
                if (cantidad > 0) {
                    res.status(200).json();

                } else {
                    res.status(400).json();

                }
            }
        });
    } else {
        res.status(500).json();

    }
});

//CONSULTAS DOBLES
// seleccionar ordenes de contactos
router.get("/:idcontacto/ordenes", function (req, res, next) {
    var idContacto = req.params.idcontacto;
    //var idOrden = req.params.idOrden;y
    if (idContacto != undefined || idContacto > 0) {
        conexion.query('SELECT * FROM contactos inner join ordenes on ordenes.idcont = contactos.idcont where contactos.idcont = ?', [idContacto], function (err, resultado) {
                    if (err) {
                res.status(500).json({"error": err, "message": "Ha ocurrido un error, favor de verificar "});
                next();
            } else {
                var cantidad = resultado.length;
                if (cantidad > 0) {
                    res.json({"result": resultado, "cantidad": cantidad}).status(200);
                } else {
                    res.status(204);

                }
            }
        });
    } else {
        res.status(401);
    }
});


router.get('/:idcontacto/ordenes/:idorden', function (req, res, next) {

    var idcontacto = req.params['idcontacto'];
    var idorden = req.params['idorden'];

    if (idcontacto != undefined || idcontacto > 0) {

        conexion.query('SELECT *  FROM contactos INNER JOIN ordenes ON ordenes.idcont = contactos.idcont WHERE contactos.idcont = ? AND ordenes.idord = ? ',
            [idcontacto, idorden],
            function (error, result) {

                if (error) {
                    // throw error;
                    res.status(500).json({'error': error});
                    next();

                } else {

                    if (result.length > 0) {

                        res.status(200).json({'result': result});
                    } else {

                        res.status(204).json();
                    }
                }
            });


    } else {
        res.status(500).json();
    }


});






module.exports = router;