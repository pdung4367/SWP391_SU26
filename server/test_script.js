const { createRentalRequest } = require('./src/controllers/tenantRentalRequestController');
const { createContract } = require('./src/controllers/contractController');
const { Room, User } = require('./src/models');

const mockRes = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.data = data;
    console.log(`[Response] Status: ${res.statusCode}`, data);
    return res;
  };
  return res;
};

const mockNext = (err) => {
  console.log('[Error Next]', err);
};

const test = async () => {
  console.log('--- TEST 1: Tenant Rental Request with 5 months (Should Fail) ---');
  let req = {
    user: { userId: 1 }, // tenant
    body: {
      roomId: 1,
      message: 'Hello',
      requestedMoveInDate: '2026-07-01',
      leaseDurationMonths: 5
    }
  };
  let res = mockRes();
  await createRentalRequest(req, res, mockNext);

  console.log('\n--- TEST 2: Tenant Rental Request with 6 months (Should Pass) ---');
  req.body.leaseDurationMonths = 6;
  res = mockRes();
  await createRentalRequest(req, res, mockNext);

  console.log('\n--- TEST 3: Landlord Create Contract with 5 months (Should Fail) ---');
  req = {
    user: { userId: 2 }, // landlord
    body: {
      roomId: 1,
      tenantId: 1,
      startDate: '2026-07-01',
      endDate: '2026-11-01', // 4 months diff
      monthlyRent: 5000,
    }
  };
  res = mockRes();
  await createContract(req, res, mockNext);

  console.log('\n--- TEST 4: Landlord Create Contract with 6 months (Should Pass & check deposit) ---');
  req.body.endDate = '2027-01-01'; // 6 months
  res = mockRes();
  await createContract(req, res, mockNext);
};

test().then(() => {
  console.log('Tests completed.');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
