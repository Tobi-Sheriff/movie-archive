const request = require('supertest');
const { app, server } = require('../index');
const authService = require('../services/authServices');
const { seedUsers, destroyUsers } = require('./seeds/seedGenerator');

beforeEach(async () => {
  await seedUsers();
});

afterEach(async () => {
  await destroyUsers();
});


describe('Authentication Tests', () => {
  describe('Users Signup', () => {
    it('Should return a success message upon successful signup', async () => {
      const signupData = {
        email: 'testuser@example.com',
        username: 'testuser',
        password: process.env.TEST_PASSWORD
      }

      const response = await request(app)
        .post(`/auth/signup`)
        .set("Content-Type", "application/json")
        .send(signupData);

      expect(response.status).toBe(201);
      expect(response.body.user).toEqual(expect.objectContaining({
        id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
      }));

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User Registered Successfully!');
      expect(response.body.user).toMatchObject({
        username: 'testuser',
        email: 'testuser@example.com',
      });

      // Check that the user exists in the database and that password is hashed
      const user = authService.findUserByEmail(signupData.email)
      expect(user).toBeTruthy();
      expect(user.password_hash).not.toBe('password123');
    })

    it('should not allow registration with missing email field', async () => {
      const userData = {
        email: '',
        username: 'noneExistingUser',
        password: process.env.TEST_PASSWORD
      }

      const response = await request(app)
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'All fields are required.');
    });

    it('should not allow registration with missing username field', async () => {
      const userData = {
        email: 'noneExistingmail@example.com',
        username: '',
        password: process.env.TEST_PASSWORD
      }

      const response = await request(app)
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'All fields are required.');
    });

    it('should not allow registration with missing password field', async () => {
      const userData = {
        email: 'noneExistingmail@example.com',
        username: 'noneExistingUser',
        password: ''
      }

      const response = await request(app)
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'All fields are required.');
    });

    it('should not allow registration with existing email', async () => {
      const userData = {
        username: 'noneExistUser',
        email: 'existingUser@example1.com',
        password: process.env.TEST_PASSWORD
      }
      const response = await request(app)
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .send(userData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Email is already registered.');
    });

    it('should not allow registration with existing username', async () => {
      const userData = {
        username: 'existingUser',
        email: 'noneExistingUser@example1.com',
        password: process.env.TEST_PASSWORD
      }
      const response = await request(app)
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .send(userData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Username is already taken.');
    });

    it('should not allow registration with username that is too short', async () => {
      const userData = {
        username: 'abc4',
        email: 'shortuser@example.com',
        password: process.env.TEST_PASSWORD
      }
      const response = await request(app)
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid Username length.');
      expect(response.body).not.toHaveProperty('user');
    });

    it('should not allow registration with username that is too long', async () => {
      const userData = {
        username: 'abc4',
        email: 'shortuser@example.com',
        password: process.env.TEST_PASSWORD
      }
      const response = await request(app)
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid Username length.');
      expect(response.body).not.toHaveProperty('user');
    });
  })
});