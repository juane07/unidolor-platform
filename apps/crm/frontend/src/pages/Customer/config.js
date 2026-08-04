export const fields = {
  name: {
    type: 'link',
    url: (record) => `/client/detail/${record._id}`,
  },
  type: {
    type: 'selectWithTranslation',
    options: [
      { value: 'cliente', label: 'Cliente', color: 'blue' },
      { value: 'proveedor', label: 'Proveedor', color: 'purple' },
    ],
    renderAsTag: true,
  },
  country: {
    type: 'country',
    // color: 'red',
  },
  address: {
    type: 'string',
  },
  phone: {
    type: 'phone',
  },
  email: {
    type: 'email',
  },
};
