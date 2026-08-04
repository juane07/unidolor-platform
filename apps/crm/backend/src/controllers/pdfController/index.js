const pug = require('pug');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

const { listAllSettings, loadSettings } = require('@/middlewares/settings');
const { getData } = require('@/middlewares/serverData');
const useLanguage = require('@/locale/useLanguage');
const { useMoney, useDate } = require('@/settings');

const pugFiles = ['invoice', 'offer', 'quote', 'payment', 'appointment'];

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

let browserInstance = null;

async function getBrowser() {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }

  const executablePath = await chromium.executablePath();
  
  browserInstance = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  return browserInstance;
}

exports.generatePdf = async (
  modelName,
  info = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
  result,
  callback
) => {
  try {
    const { targetLocation } = info;

    if (fs.existsSync(targetLocation)) {
      fs.unlinkSync(targetLocation);
    }

    if (pugFiles.includes(modelName.toLowerCase())) {
      const settings = await loadSettings();
      const selectedLang = settings['idurar_app_language'];
      const translate = useLanguage({ selectedLang });

      const {
        currency_symbol,
        currency_position,
        decimal_sep,
        thousand_sep,
        cent_precision,
        zero_format,
      } = settings;

      const { moneyFormatter } = useMoney({
        settings: {
          currency_symbol,
          currency_position,
          decimal_sep,
          thousand_sep,
          cent_precision,
          zero_format,
        },
      });
      const { dateFormat } = useDate({ settings });

      settings.public_server_file = process.env.PUBLIC_SERVER_FILE;

      let logoDataUri = '';
      try {
        const logoPath = String(settings.company_logo || '').replace(/^\/+/, '');
        if (logoPath && fs.existsSync(logoPath)) {
          logoDataUri = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');
        }
      } catch (e) {
        logoDataUri = '';
      }

      const htmlContent = pug.renderFile('src/pdf/' + modelName + '.pug', {
        model: result,
        settings,
        translate,
        dateFormat,
        moneyFormatter,
        moment: moment,
        logoDataUri,
      });

      const browser = await getBrowser();
      const page = await browser.newPage();

      const formatMap = {
        'A3': 'a3', 'A4': 'a4', 'A5': 'a5', 'A6': 'a6',
        'Legal': 'legal', 'Letter': 'letter', 'Tabloid': 'tabloid'
      };
      const pdfFormat = formatMap[info.format] || 'a5';

      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      await page.pdf({
        path: targetLocation,
        format: pdfFormat,
        printBackground: true,
        margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      });

      await page.close();

      if (callback) callback();
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(error);
  }
};

exports.closeBrowser = async () => {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
};