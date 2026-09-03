const custom = require('@/controllers/pdfController');
const prisma = require('@/db/prisma');

const modelMap = {
  invoice: prisma.invoice,
  payment: prisma.payment,
  appointment: prisma.appointment,
  client: prisma.client,
  withholding: prisma.withholding,
  ecf: prisma.eCF,
  doctor: prisma.doctor,
  service: prisma.service,
  branch: prisma.branch,
  opportunity: prisma.opportunity,
  setting: prisma.setting,
  notification: prisma.notification,
};

module.exports = downloadPdf = async (req, res, { directory, id }) => {
  try {
    const modelName = directory.toLowerCase();
    const prismaModel = modelMap[modelName];

    if (!prismaModel) {
      return res.status(404).json({
        success: false,
        result: null,
        message: `Model '${modelName}' does not exist`,
      });
    }

    const result = await prismaModel.findFirst({ where: { id } });

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
      });
    }

    const fileId = modelName + '-' + result.id + '.pdf';
    const folderPath = modelName;
    const targetLocation = `src/public/download/${folderPath}/${fileId}`;

    await custom.generatePdf(
      modelName.charAt(0).toUpperCase() + modelName.slice(1),
      { filename: folderPath, format: 'A4', targetLocation },
      result,
      async () => {
        return res.download(targetLocation, (error) => {
          if (error)
            return res.status(500).json({
              success: false,
              result: null,
              message: "Couldn't find file",
              error: error.message,
            });
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      error: error.message,
      message: error.message,
      controller: 'downloadPDF.js',
    });
  }
};
