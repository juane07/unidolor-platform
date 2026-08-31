const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },

  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  number: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  content: String,
  recurring: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'annually', 'quarter'],
  },
  date: {
    type: Date,
    required: true,
  },
  expiredDate: {
    type: Date,
    required: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: 'Branch',
    autopopulate: true,
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doctor',
    autopopulate: true,
  },
  converted: {
    from: {
      type: String,
      enum: ['quote', 'offer'],
    },
    offer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Offer',
    },
    quote: {
      type: mongoose.Schema.ObjectId,
      ref: 'Quote',
    },
  },
  items: [
    {
      service: {
        type: mongoose.Schema.ObjectId,
        ref: 'Service',
      },
      cupsCode: {
        type: String,
      },
      simonLevel: {
        type: String,
      },
      itemName: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
  taxRate: {
    type: Number,
    default: 0,
  },
  subTotal: {
    type: Number,
    default: 0,
  },
  taxTotal: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'NA',
    uppercase: true,
    required: true,
  },
  credit: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  payment: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Payment',
    },
  ],
  paymentStatus: {
    type: String,
    default: 'unpaid',
    enum: ['unpaid', 'paid', 'partially'],
  },
  isOverdue: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  ncf: {
    type: String,
  },
  ncfTipo: {
    type: String,
  },
  regimen: {
    type: String,
    enum: ['RST', 'RDL', 'RGN'],
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'sent', 'refunded', 'cancelled', 'on hold'],
    default: 'draft',
  },
  estadoFiscal: {
    type: String,
    enum: ['borrador', 'emitida', 'anulada', 'nota_credito'],
    default: 'borrador',
  },
  notaRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'Invoice',
  },
  motivo: String,
  bitacora: [
    {
      accion: String,
      usuario: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
      },
      fecha: {
        type: Date,
        default: Date.now,
      },
      detalle: String,
    },
  ],
  pdf: {
    type: String,
  },
  files: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: true,
      },
    },
  ],
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

invoiceSchema.plugin(require('mongoose-autopopulate'));

invoiceSchema.index({ client: 1, removed: 1, date: -1 });
invoiceSchema.index({ 'items.service': 1, removed: 1 });
invoiceSchema.index(
  { ncf: 1 },
  { unique: true, partialFilterExpression: { ncf: { $type: 'string' }, removed: false } }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
