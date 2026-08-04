require('dotenv').config();
const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI || process.env.DATABASE;

(async () => {
  await mongoose.connect(URI);
  const Appointment = mongoose.model('Appointment', new mongoose.Schema({}, { strict: false }));
  const Client = mongoose.model('Client', new mongoose.Schema({}, { strict: false }));

  const carla = await Client.find({ name: /carla/i }).lean();
  console.log('Clientes con "carla":', carla.length);
  for (const c of carla) {
    console.log(' -', c.name, '| phone:', c.phone, '| id:', c._id);
    const appts = await Appointment.find({ client: c._id }).lean();
    console.log('   citas:', appts.length);
    for (const a of appts) {
      console.log('    ->', a._id, '| type:', a.type, '| status:', a.status, '| removed:', a.removed, '| date:', a.date, '| start:', a.startTime, '| doctor:', a.doctor, '| created:', a.created);
    }
  }

  const total = await Appointment.countDocuments({});
  const notRemoved = await Appointment.countDocuments({ removed: false });
  const byStatus = await Appointment.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]);
  const byRemoved = await Appointment.aggregate([{ $group: { _id: '$removed', n: { $sum: 1 } } }]);
  console.log('\nTOTAL citas:', total, '| no-removed:', notRemoved);
  console.log('por status:', JSON.stringify(byStatus));
  console.log('por removed:', JSON.stringify(byRemoved));

  const last = await Appointment.find({}).sort({ created: -1 }).limit(5).lean();
  console.log('\núltimas 5 citas:');
  for (const a of last) {
    console.log(' -', a._id, '| client:', a.client, '| type:', a.type, '| status:', a.status, '| removed:', a.removed, '| date:', a.date, '| start:', a.startTime, '| created:', a.created);
  }
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
