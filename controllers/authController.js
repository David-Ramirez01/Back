const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

exports.login = (req, res) => {
  const { correo, contrasena } = req.body;

  db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, resultados) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });

    if (resultados.length === 0) {
      return res.status(401).json({ mensaje: 'Correo no registrado' });
    }

    const usuario = resultados[0];

    bcrypt.compare(contrasena, usuario.contrasena, (err, esValida) => {
      if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });

      if (!esValida) {
        return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
      }

      const token = jwt.sign(
        { id: usuario.id, alias: usuario.alias, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        usuario: { alias: usuario.alias, rol: usuario.rol },
        token
      });
    });
  });
};

exports.register = (req, res) => {
  const { alias, correo, contrasena } = req.body;
  const rol = 'cliente'; // Los administradores los insertas manualmente en la BD

  bcrypt.hash(contrasena, 10, (err, hash) => {
    if (err) return res.status(500).json({ mensaje: 'Error al encriptar la contraseña' });

    db.query(
      'INSERT INTO usuarios (alias, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
      [alias, correo, hash, rol],
      (err, result) => {
        if (err) return res.status(500).json({ mensaje: 'Error al registrar usuario' });

        const token = jwt.sign(
          { id: result.insertId, alias, rol },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        res.json({
          usuario: { alias, rol },
          token
        });
      }
    );
  });
};
