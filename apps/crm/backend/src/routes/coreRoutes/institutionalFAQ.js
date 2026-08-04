const express = require('express');
const { listFAQ, getFAQById, searchFAQ, getCategorias } = require('./institutionalFAQController');

const router = express.Router();

// Rutas públicas (para bot y frontend)
router.get('/categorias', getCategorias);
router.get('/search', searchFAQ);
router.get('/', listFAQ);
router.get('/:id', getFAQById);

module.exports = router;