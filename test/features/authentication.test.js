const expect = require('expect');
const request = require('supertest');

require('../helpers/testSetup');

const app = require('../../app');

const { createUser } = require('../helpers/objectCreationMethods');

describe('Authentication - ', () => {
  it('users that log in receive JWT & their serialized user obj', async () => {
    const email = 'elowyn@example.com';
    const password = 'password';

    const user = await createUser({ email, password });
    const res = await request(app)
      .post('/login')
      .send({ email, password })
      .expect(200);
    expect(res.body.jwt).not.toBe(undefined);
    expect(res.body.user).toEqual({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email,
      admin: user.admin,
    });

    expect(res.body.user.passwordDigest).toEqual(undefined);
    expect(res.body.user.createdAt).toEqual(undefined);
    expect(res.body.user.updatedAt).toEqual(undefined);
  });

  it('users cannot login without valid credentials', async () => {
    const email = 'bruce@example.com';
    const password = 'password';

    await createUser({ email, password });
    const wrongPasswordRes = await request(app)
      .post('/login')
      .send({ email, password: 'wrong password' })
      .expect(404);
    expect(wrongPasswordRes.body.jwt).toBe(undefined);
    expect(wrongPasswordRes.body.user).toEqual(undefined);
    expect(wrongPasswordRes.body.message).toEqual('email or password is incorrect');

    const noUserRes = await request(app)
      .post('/login')
      .send({ email: 'wrongEmail@example.com', password })
      .expect(404);
    expect(noUserRes.body.jwt).toBe(undefined);
    expect(noUserRes.body.user).toEqual(undefined);
    expect(noUserRes.body.message).toEqual('email or password is incorrect');
  });
});
