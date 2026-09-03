const prisma = require('@/db/prisma');

const listFAQ = async (req, res) => {
  try {
    const {
      categoria, subcategoria, audiencia, tags, search,
      enabled, removed, page = 1, limit = 50,
      sortBy = 'prioridad', sortOrder = 'asc',
    } = req.query;

    const parseBool = (v, def) => (v === undefined || v === null || v === '') ? def : v === 'true' || v === true;
    const where = {
      enabled: parseBool(enabled, true),
      removed: parseBool(removed, false),
    };

    if (categoria) where.categoria = categoria;
    if (subcategoria) where.subcategoria = subcategoria;
    if (audiencia) where.audiencia = { hasSome: Array.isArray(audiencia) ? audiencia : [audiencia] };
    if (tags) where.tags = { hasSome: Array.isArray(tags) ? tags : [tags] };
    if (search) {
      where.OR = [
        { pregunta: { contains: search, mode: 'insensitive' } },
        { respuesta: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orderBy = { [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc' };

    const [faqs, total] = await Promise.all([
      prisma.institutionalFAQ.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
        select: {
          id: true, categoria: true, subcategoria: true, pregunta: true,
          respuesta: true, audiencia: true, tags: true,
          validadoEnConversaciones: true, prioridad: true, created: true, updated: true,
        },
      }),
      prisma.institutionalFAQ.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      result: faqs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
      message: 'FAQs obtenidos correctamente',
    });
  } catch (error) {
    console.error('Error listFAQ:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error al obtener FAQs',
      error: error.message,
    });
  }
};

const getFAQById = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await prisma.institutionalFAQ.findUnique({ where: { id } });

    if (!faq) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'FAQ no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      result: faq,
      message: 'FAQ obtenido correctamente',
    });
  } catch (error) {
    console.error('Error getFAQById:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error al obtener FAQ',
      error: error.message,
    });
  }
};

const searchFAQ = async (req, res) => {
  try {
    const { q, audiencia, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Parámetro q (query) requerido',
      });
    }

    const where = {
      enabled: true,
      removed: false,
      OR: [
        { pregunta: { contains: q, mode: 'insensitive' } },
        { respuesta: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
      ],
    };

    if (audiencia) {
      where.audiencia = { hasSome: Array.isArray(audiencia) ? audiencia : [audiencia] };
    }

    const faqs = await prisma.institutionalFAQ.findMany({
      where,
      take: parseInt(limit),
      orderBy: { prioridad: 'asc' },
      select: {
        id: true, categoria: true, subcategoria: true, pregunta: true,
        respuesta: true, audiencia: true, tags: true,
        validadoEnConversaciones: true,
      },
    });

    return res.status(200).json({
      success: true,
      result: faqs,
      message: 'Búsqueda completada',
    });
  } catch (error) {
    console.error('Error searchFAQ:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error en búsqueda',
      error: error.message,
    });
  }
};

const getCategorias = async (req, res) => {
  try {
    const categorias = await prisma.institutionalFAQ.groupBy({
      by: ['categoria'],
      where: { enabled: true, removed: false },
      _count: { id: true },
      orderBy: { categoria: 'asc' },
    });

    const result = categorias.map((c) => ({
      _id: c.categoria,
      count: c._count.id,
    }));

    return res.status(200).json({
      success: true,
      result,
      message: 'Categorías obtenidas',
    });
  } catch (error) {
    console.error('Error getCategorias:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error al obtener categorías',
      error: error.message,
    });
  }
};

module.exports = {
  listFAQ,
  getFAQById,
  searchFAQ,
  getCategorias,
};
