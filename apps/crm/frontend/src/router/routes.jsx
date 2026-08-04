import { lazy } from 'react';

import { Navigate } from 'react-router-dom';

const Logout = lazy(() => import('@/pages/Logout.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));


const Customer = lazy(() => import('@/pages/Customer'));
const Pipeline = lazy(() => import('@/pages/Pipeline'));
const Doctor = lazy(() => import('@/pages/Doctor'));
const Branch = lazy(() => import('@/pages/Branch'));
const Appointment = lazy(() => import('@/pages/Appointment'));
const ClinicalRecord = lazy(() => import('@/pages/ClinicalRecord'));
const InsuranceCompany = lazy(() => import('@/pages/InsuranceCompany'));
const InsurancePlan = lazy(() => import('@/pages/InsurancePlan'));
const ArsAuthorization = lazy(() => import('@/pages/ArsAuthorization'));
const Service = lazy(() => import('@/pages/Service'));
const ClientDetail = lazy(() => import('@/pages/ClientDetail'));
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'));
const NcfSequence = lazy(() => import('@/pages/NcfSequence'));
const ECF = lazy(() => import('@/pages/ECF'));
const DgiiReport = lazy(() => import('@/pages/DgiiReport'));
const Withholding = lazy(() => import('@/pages/Withholding'));
const PaymentMode = lazy(() => import('@/pages/PaymentMode'));
const Quote = lazy(() => import('@/pages/Quote'));
const QuoteCreate = lazy(() => import('@/pages/Quote/QuoteCreate'));
const QuoteRead = lazy(() => import('@/pages/Quote/QuoteRead'));
const QuoteUpdate = lazy(() => import('@/pages/Quote/QuoteUpdate'));
const Invoice = lazy(() => import('@/pages/Invoice'));
const InvoiceCreate = lazy(() => import('@/pages/Invoice/InvoiceCreate'));

const InvoiceRead = lazy(() => import('@/pages/Invoice/InvoiceRead'));
const InvoiceUpdate = lazy(() => import('@/pages/Invoice/InvoiceUpdate'));
const InvoiceRecordPayment = lazy(() => import('@/pages/Invoice/InvoiceRecordPayment'));

const Payment = lazy(() => import('@/pages/Payment/index'));
const PaymentRead = lazy(() => import('@/pages/Payment/PaymentRead'));
const PaymentUpdate = lazy(() => import('@/pages/Payment/PaymentUpdate'));

const Settings = lazy(() => import('@/pages/Settings/Settings'));

const Profile = lazy(() => import('@/pages/Profile'));

const About = lazy(() => import('@/pages/About'));

const ChatbotConversations = lazy(() => import('@/pages/ChatbotConversations'));

let routes = {
  expense: [],
  default: [
    {
      path: '/login',
      element: <Navigate to="/" />,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      path: '/about',
      element: <About />,
    },
    {
      path: '/',
      element: <Pipeline />,
    },
    {
      path: '/customer',
      element: <Customer />,
    },
    {
      path: '/pipeline',
      element: <Pipeline />,
    },
    {
      path: '/doctor',
      element: <Doctor />,
    },
    {
      path: '/branch',
      element: <Branch />,
    },
    {
      path: '/appointment',
      element: <Appointment />,
    },
    {
      path: '/clinical-record',
      element: <ClinicalRecord />,
    },
    {
      path: '/insurance-company',
      element: <InsuranceCompany />,
    },
    {
      path: '/insurance-plan',
      element: <InsurancePlan />,
    },
    {
      path: '/ars-authorization',
      element: <ArsAuthorization />,
    },
    {
      path: '/service',
      element: <Service />,
    },
    {
      path: '/client/detail/:id',
      element: <ClientDetail />,
    },
    {
      path: '/service/detail/:id',
      element: <ServiceDetail />,
    },

    {
      path: '/invoice',
      element: <Invoice />,
    },
    {
      path: '/invoice/create',
      element: <InvoiceCreate />,
    },
    {
      path: '/invoice/read/:id',
      element: <InvoiceRead />,
    },
    {
      path: '/invoice/update/:id',
      element: <InvoiceUpdate />,
    },
    {
      path: '/invoice/pay/:id',
      element: <InvoiceRecordPayment />,
    },
    {
      path: '/quote',
      element: <Quote />,
    },
    {
      path: '/quote/create',
      element: <QuoteCreate />,
    },
    {
      path: '/quote/read/:id',
      element: <QuoteRead />,
    },
    {
      path: '/quote/update/:id',
      element: <QuoteUpdate />,
    },
    {
      path: '/payment',
      element: <Payment />,
    },
    {
      path: '/payment/read/:id',
      element: <PaymentRead />,
    },
    {
      path: '/payment/update/:id',
      element: <PaymentUpdate />,
    },

    {
      path: '/settings',
      element: <Settings />,
    },
    {
      path: '/settings/edit/:settingsKey',
      element: <Settings />,
    },
    {
      path: '/payment/mode',
      element: <PaymentMode />,
    },
    {
      path: '/ncfsequence',
      element: <NcfSequence />,
    },
    {
      path: '/ecf',
      element: <ECF />,
    },
    {
      path: '/dgiireport',
      element: <DgiiReport />,
    },
    {
      path: '/withholding',
      element: <Withholding />,
    },

    {
      path: '/chatbot-conversations',
      element: <ChatbotConversations />,
    },

    {
      path: '/profile',
      element: <Profile />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default routes;
