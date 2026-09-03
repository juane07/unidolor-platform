const prisma = require('@/db/prisma');

// Maps Mongoose model names to Prisma model accessors and table names
const modelMap = {
  Admin: { prisma: prisma.admin, table: 'admins' },
  AdminPassword: { prisma: prisma.adminPassword, table: 'admin_passwords' },
  Branch: { prisma: prisma.branch, table: 'branches' },
  Client: { prisma: prisma.client, table: 'clients' },
  Doctor: { prisma: prisma.doctor, table: 'doctors' },
  Service: { prisma: prisma.service, table: 'services' },
  Procedure: { prisma: prisma.procedure, table: 'procedures' },
  InsuranceCompany: { prisma: prisma.insuranceCompany, table: 'insurance_companies' },
  InsurancePlan: { prisma: prisma.insurancePlan, table: 'insurance_plans' },
  ArsAuthorization: { prisma: prisma.arsAuthorization, table: 'ars_authorizations' },
  NcfSequence: { prisma: prisma.ncfSequence, table: 'ncf_sequences' },
  Invoice: { prisma: prisma.invoice, table: 'invoices' },
  InvoiceItem: { prisma: prisma.invoiceItem, table: 'invoice_items' },
  Payment: { prisma: prisma.payment, table: 'payments' },
  Withholding: { prisma: prisma.withholding, table: 'withholdings' },
  ECF: { prisma: prisma.eCF, table: 'ecf' },
  Appointment: { prisma: prisma.appointment, table: 'appointments' },
  Case: { prisma: prisma.case, table: 'cases' },
  ClinicalRecord: { prisma: prisma.clinicalRecord, table: 'clinical_records' },
  ConsentTemplate: { prisma: prisma.consentTemplate, table: 'consent_templates' },
  ConsentInstance: { prisma: prisma.consentInstance, table: 'consent_instances' },
  Opportunity: { prisma: prisma.opportunity, table: 'opportunities' },
  Notification: { prisma: prisma.notification, table: 'notifications' },
  DgiiReport: { prisma: prisma.dgiiReport, table: 'dgii_reports' },
  DoctorSchedule: { prisma: prisma.doctorSchedule, table: 'doctor_schedules' },
  Setting: { prisma: prisma.setting, table: 'settings' },
  Upload: { prisma: null, table: 'uploads' },
  InstitutionalFAQ: { prisma: prisma.institutionalFAQ, table: 'institutional_faqs' },
};

// Models that existed in Mongoose and are mapped
const modelsFiles = Object.keys(modelMap);

// Build routesList like the original
const routesList = [];
for (const modelName of modelsFiles) {
  if (modelName === 'Admin' || modelName === 'AdminPassword' || modelName === 'Setting' || modelName === 'Upload' || modelName === 'InstitutionalFAQ') continue;
  const firstChar = modelName.charAt(0);
  const fileNameLowerCaseFirstChar = modelName.replace(firstChar, firstChar.toLowerCase());
  const entity = modelName.toLowerCase();
  const controllerName = fileNameLowerCaseFirstChar + 'Controller';
  routesList.push({ entity, modelName, controllerName });
}

const getPrismaModel = (modelName) => {
  const entry = modelMap[modelName];
  if (!entry) throw new Error(`Model ${modelName} not found in modelMap`);
  return entry.prisma;
};

module.exports = { modelMap, modelsFiles, routesList, getPrismaModel };
