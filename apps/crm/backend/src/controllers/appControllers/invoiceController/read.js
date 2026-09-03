const prisma = require('@/db/prisma');

const read = async (req, res) => {
  const result = await prisma.invoice.findFirst({
    where: { id: req.params.id, removed: false },
    include: { createdBy: { select: { name: true, id: true } } },
  });

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  }
  return res.status(200).json({
    success: true,
    result,
    message: 'we found this document ',
  });
};

module.exports = read;
