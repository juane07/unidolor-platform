const mongoose = require('mongoose');

const listFAQ = async (req, res) => {
  try {
    const InstitutionalFAQ = mongoose.model('InstitutionalFAQ');
    
    const { 
      categoria, 
      subcategoria, 
      audiencia, 
      tags, 
      search, 
      enabled,
      removed,
      page = 1,
      limit = 50,
      sortBy = 'prioridad',
      sortOrder = 'asc'
    } = req.query;

    const parseBool = (v, def) => (v === undefined || v === null || v === '') ? def : v === 'true' || v === true;
    const query = {
      enabled: parseBool(enabled, true),
      removed: parseBool(removed, false),
    };
    
    if (categoria) query.categoria = categoria;
    if (subcategoria) query.subcategoria = subcategoria;
    if (audiencia) query.audiencia = { $in: Array.isArray(audiencia) ? audiencia : [audiencia] };
    if (tags) query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    if (search) query.$text = { $search: search };
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const [faqs, total] = await Promise.all([
      InstitutionalFAQ.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('categoria subcategoria pregunta respuesta audiencia tags validadoEnConversaciones prioridad created updated'),
      InstitutionalFAQ.countDocuments(query)
    ]);
    
    return res.status(200).json({
      success: true,
      result: faqs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      message: 'FAQs obtenidos correctamente'
    });
  } catch (error) {
    console.error('Error listFAQ:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error al obtener FAQs',
      error: error.message
    });
  }
};

const getFAQById = async (req, res) => {
  try {
    const InstitutionalFAQ = mongoose.model('InstitutionalFAQ');
    const { id } = req.params;
    
    const faq = await InstitutionalFAQ.findById(id).select('-__v');
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'FAQ no encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      result: faq,
      message: 'FAQ obtenido correctamente'
    });
  } catch (error) {
    console.error('Error getFAQById:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error al obtener FAQ',
      error: error.message
    });
  }
};

const searchFAQ = async (req, res) => {
  try {
    const InstitutionalFAQ = mongoose.model('InstitutionalFAQ');
    const { q, audiencia, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Parámetro q (query) requerido'
      });
    }
    
    const query = { 
      enabled: true, 
      removed: false,
      $text: { $search: q }
    };
    
    if (audiencia) {
      query.audiencia = { $in: Array.isArray(audiencia) ? audiencia : [audiencia] };
    }
    
    const faqs = await InstitutionalFAQ.find(query, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' }, prioridad: 1 })
      .limit(parseInt(limit))
      .select('categoria subcategoria pregunta respuesta audiencia tags validadoEnConversaciones');
    
    return res.status(200).json({
      success: true,
      result: faqs,
      message: 'Búsqueda completada'
    });
  } catch (error) {
    console.error('Error searchFAQ:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error en búsqueda',
      error: error.message
    });
  }
};

const getCategorias = async (req, res) => {
  try {
    const InstitutionalFAQ = mongoose.model('InstitutionalFAQ');
    
    const categorias = await InstitutionalFAQ.aggregate([
      { $match: { enabled: true, removed: false } },
      { $group: { _id: '$categoria', count: { $sum: 1 }, subcategorias: { $addToSet: '$subcategoria' } } },
      { $sort: { _id: 1 } }
    ]);
    
    return res.status(200).json({
      success: true,
      result: categorias,
      message: 'Categorías obtenidas'
    });
  } catch (error) {
    console.error('Error getCategorias:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
};

module.exports = {
  listFAQ,
  getFAQById,
  searchFAQ,
  getCategorias,
};