const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const methods = createCRUDController('ECF');

const Invoice = mongoose.model('Invoice');
const Client = mongoose.model('Client');
const ECF = mongoose.model('ECF');

function generateEncfString(tipo, secuencia, regimen, rnc, fecha) {
  const y = String(fecha.getFullYear());
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  const secStr = String(secuencia).padStart(8, '0');
  return `${regimen}|${rnc}|${tipo}${secStr}|${y}${m}${d}|${rnc.substr(0, 3)}`;
}

function generateXml(invoice, client, ncf, tipo, regimen) {
  const fecha = new Date();
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');

  const taxRate = invoice.taxRate || 0;
  let itemsXml = '';
  invoice.items.forEach((item, i) => {
    const itemTax = taxRate > 0 ? item.total * (taxRate / 100) : 0;
    itemsXml += `
      <Detalle>
        <NumeroLinea>${i + 1}</NumeroLinea>
        <IndicadorExterior>0</IndicadorExterior>
        <NombreItem>${item.itemName}</NombreItem>
        <CantidadReferencia>1.00</CantidadReferencia>
        <UnidadMedida>1</UnidadMedida>
        <Cantidad>${item.quantity}</Cantidad>
        <PrecioUnitario>${item.price.toFixed(2)}</PrecioUnitario>
        <MontoDescuento>0.00</MontoDescuento>
        <SubTotal>${item.total.toFixed(2)}</SubTotal>
        <TasaITBIS>${taxRate.toFixed(2)}</TasaITBIS>
        <MontoITBIS>${itemTax.toFixed(2)}</MontoITBIS>
        <Total>${item.total.toFixed(2)}</Total>
      </Detalle>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<eCF xmlns="http://www.dgii.gov.do/eCF">
  <Encabezado>
    <TipoComprobante>${tipo}</TipoComprobante>
    <TipoIngreso>1</TipoIngreso>
    <LugarDeEmision>1</LugarDeEmision>
    <RegimenSpecial>${regimen}</RegimenSpecial>
    <NumeroComprobanteFiscal>${ncf}</NumeroComprobanteFiscal>
    <RncCliente>${client.identity_number || client.rfc || ''}</RncCliente>
    <RazonSocialCliente>${client.name || ''}</RazonSocialCliente>
    <FechaEmision>${y}-${m}-${d}</FechaEmision>
    <Moneda>${invoice.currency || 'DOP'}</Moneda>
  </Encabezado>
  <DetallesItems>${itemsXml}
  </DetallesItems>
  <Resumen>
    <Subtotal>${invoice.subTotal.toFixed(2)}</Subtotal>
    <TotalITBIS>${invoice.taxTotal.toFixed(2)}</TotalITBIS>
    <MontoTotal>${invoice.total.toFixed(2)}</MontoTotal>
  </Resumen>
</eCF>`;
}

methods.submit = async (req, res) => {
  try {
    const { invoiceId } = req.body;
    if (!invoiceId) return res.status(400).json({ success: false, message: 'invoiceId is required' });

    const invoice = await Invoice.findOne({ _id: invoiceId, removed: false });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const client = await Client.findOne({ _id: invoice.client, removed: false });
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });

    const ncf = invoice.ncf;
    const tipo = invoice.ncfTipo || '01';
    const regimen = invoice.regimen || 'RST';

    if (!ncf) return res.status(400).json({ success: false, message: 'Invoice has no NCF assigned' });

    const existing = await ECF.findOne({ invoice: invoiceId, removed: false });
    if (existing && existing.dgiiStatus === 'approved') {
      return res.status(400).json({ success: false, message: 'Invoice already approved by DGII' });
    }
    if (existing && existing.dgiiStatus === 'submitted') {
      return res.status(400).json({ success: false, message: 'Invoice already submitted to DGII' });
    }

    const rnc = client.identity_number || client.rfc || '';
    const encf = generateEncfString(tipo, parseInt(ncf.slice(2), 10), regimen, rnc, new Date());
    const xmlContent = generateXml(invoice, client, ncf, tipo, regimen);
    const signedXml = `<!-- Firma digital pendiente de implementar -->\n${xmlContent}`;

    const ecfData = {
      invoice: invoiceId,
      ncf,
      ncfTipo: tipo,
      regimen,
      xmlContent,
      signedXml,
      dgiiStatus: 'submitted',
      attempts: (existing?.attempts || 0) + 1,
      submittedAt: new Date(),
      errorMessage: existing ? existing.errorMessage : undefined,
    };

    let result;
    if (existing) {
      result = await ECF.findByIdAndUpdate(existing._id, { ...ecfData, updated: Date.now() }, { new: true });
    } else {
      result = await new ECF(ecfData).save();
    }

    return res.status(200).json({
      success: true,
      result,
      message: 'e-CF submitted successfully. Waiting for DGII approval.',
      encf,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = methods;
