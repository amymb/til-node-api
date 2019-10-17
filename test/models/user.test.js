const expect = require('expect');

require('../helpers/testSetup');

const User = require('../../models').User;

describe('User', () => {
  it('can be created', async () => {
    const usersBefore = await User.findAll();
    expect(usersBefore.length).toBe(0);

    await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      admin: true,
      password: 'password',
    });
    const usersAfter = await User.findAll();
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
    try{ 
      const duplicateUser = await User.create({
        firstName: 'Elowyn',
        lastName: 'Platzer Bartel',
        email: 'elowyn@example.com',
        admin: true,
        password: 'password',
      });
    } catch(e) {
      expect(e.message).toEqual('Email taken');
    }


    const users = await User.findAll();
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
    try { 
        const updatedUser = await User.update(
          { email: '  ElowYn@example.com '},
          { returning: true, where: { id: user.id } },
        );
        expect(updatedUser[1][0].dataValues.email).toEqual('elowyn@example.com');
      }catch(e){
        console.log(e)
     }
  });

  it('can be updated', async () => {
    const originalUser = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      admin: true,
      password: 'password',
    });
    const updatedUserObject = await User.update({
      firstName: 'Freyja',
      lastName: 'Puppy',
      email: 'freyja@example.com',
      admin: false,
      password: 'puppy password',
    }, 
    { 
      returning: true,
      where: {id: originalUser.id}
    });

    expect(updatedUserObject[1][0].dataValues.firstName).toBe('Freyja');
    expect(updatedUserObject[1][0].dataValues.lastName).toBe('Puppy');
    expect(updatedUserObject[1][0].dataValues.email).toBe('freyja@example.com');
    expect(updatedUserObject[1][0].dataValues.admin).toBe(false);
    expect(updatedUserObject[1][0].dataValues.password).not.toBe(originalUser.password);
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
    try{
        const updateSecondUserObject = await User.update({
        firstName: 'Freyja',
        lastName: 'Puppy',
        email: firstUser.email,
        admin: false,
        password: 'password',
      }, {
        returning: true,
        where: { id: secondUser.id }
      });
    }catch(e){
      expect(e.message).toEqual('Email taken');
    }
    const secondUserRecord = await User.findByPk(secondUser.id);
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

    const updatedUserObject = await User.update({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',
      admin: true,
      password: 'password',
    }, {
      returning: true,
      where: { id: user.id }
    });

    expect(updatedUserObject[1][0].dataValues.email).toEqual(user.email);
  });

  it('can be found by id', async () => {
    const user = await User.create({
      firstName: 'Elowyn',
      lastName: 'Platzer Bartel',
      email: 'elowyn@example.com',

      admin: true,
      password: 'password',
    });

    const foundUser = await User.findByPk(user.id);
    expect(foundUser.firstName).toEqual('Elowyn');
    expect(foundUser.lastName).toEqual('Platzer Bartel');
    expect(foundUser.email).toEqual('elowyn@example.com');
    expect(foundUser.admin).toEqual(true);
  });

});
