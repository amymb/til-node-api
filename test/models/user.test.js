const expect = require('expect');

require('../helpers/testSetup');

const User = require('../../models/user.js');

describe('User', () => {
  it('can be created', async () => {
    const usersBefore = await User.all();
    expect(usersBefore.length).toBe(0);

    await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      admin: true,
      password: 'password',
    });
    const usersAfter = await User.all();
    expect(usersAfter.length).toBe(1);
  });

  it('must have unique email to be created', async () => {
    await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      admin: true,
      password: 'password',
    });
    const duplicateUser = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      admin: true,
      password: 'password',
    });

    expect(duplicateUser).toEqual({ errors: ['Email already taken'] });
    const users = await User.all();
    expect(users.length).toBe(1);
  });


  it('removes email whitespaces, down cases on create/update ', async () => {
    const user = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: '  ElowYn@example.com ',
      admin: true,
      password: 'password',
    });

    expect(user.email).toEqual('elowyn@example.com');

    const updatedUser = await User.update({
      id: user.id,
      email: '  ElowYn@example.com ',
    });

    expect(updatedUser.email).toEqual('elowyn@example.com');
  });

  it('can be updated', async () => {
    const originalUser = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      admin: true,
      password: 'password',
    });
    const updatedUser = await User.update({
      id: originalUser.id,
      firstName: 'Freyja',
      lastName: 'Puppy',
      email: 'freyja@example.com',
      admin: false,
      password: 'puppy password',
    });

    expect(updatedUser.firstName).toBe('Freyja');
    expect(updatedUser.lastName).toBe('Puppy');
    expect(updatedUser.email).toBe('freyja@example.com');
    expect(updatedUser.admin).toBe(false);
    expect(updatedUser.passwordDigest).not.toBe(originalUser.passwordDigest);
  });

  it('must have unique email to be updated', async () => {
    const firstUser = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      admin: true,
      password: 'password',
    });
    const secondUser = await User.create({
      firstName: 'Freyja',
      lastName: 'Puppy',
      email: 'freyja@example.com',
      admin: false,
      password: 'password',
    });
    const updateSecondUser = await User.update({
      id: secondUser.id,
      firstName: 'Freyja',
      lastName: 'Puppy',
      email: firstUser.email,
      admin: false,
      password: 'password',
    });

    expect(updateSecondUser).toEqual({ errors: ['Email already taken'] });
    const secondUserRecord = await User.find(secondUser.id);
    expect(secondUserRecord.email).toEqual('freyja@example.com');
  });

  it('can update user using same email address', async () => {
    const user = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      admin: true,
      password: 'password',
    });

    const updatedUser = await User.update({
      id: user.id,
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      admin: true,
      password: 'password',
    });

    expect(updatedUser.email).toEqual(user.email);
  });

  it('can be found by id', async () => {
    const user = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',

      admin: true,
      password: 'password',
    });

    const foundUser = await User.find(user.id);
    expect(foundUser.firstName).toEqual('Elowyn');
    expect(foundUser.lastName).toEqual('Platzer Bartel');
    expect(foundUser.email).toEqual('elowyn@example.com');
    expect(foundUser.admin).toEqual(true);
  });

  it('can be found by property', async () => {
    await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      admin: true,
      password: 'password',
    });

    const foundUserByEmail = await User.findBy({ email: 'elowyn@example.com' });
    expect(foundUserByEmail.firstName).toEqual('Elowyn');
    expect(foundUserByEmail.lastName).toEqual('Platzer Bartel');
    expect(foundUserByEmail.email).toEqual('elowyn@example.com');
    expect(foundUserByEmail.admin).toEqual(true);

    const foundUserByFirstName = await User.findBy({ firstName: 'Elowyn' });
    expect(foundUserByFirstName.firstName).toEqual('Elowyn');
    expect(foundUserByFirstName.lastName).toEqual('Platzer Bartel');
    expect(foundUserByFirstName.email).toEqual('elowyn@example.com');
    expect(foundUserByFirstName.admin).toEqual(true);

    const foundUserByLastName = await User.findBy({ lastName: 'Platzer Bartel' });
    expect(foundUserByLastName.firstName).toEqual('Elowyn');
    expect(foundUserByLastName.lastName).toEqual('Platzer Bartel');
    expect(foundUserByLastName.email).toEqual('elowyn@example.com');
    expect(foundUserByLastName.admin).toEqual(true);


    const foundUserByadmin = await User.findBy({ admin: true });
    expect(foundUserByadmin.firstName).toEqual('Elowyn');
    expect(foundUserByadmin.lastName).toEqual('Platzer Bartel');
    expect(foundUserByadmin.email).toEqual('elowyn@example.com');
    expect(foundUserByadmin.admin).toEqual(true);
  });
});
