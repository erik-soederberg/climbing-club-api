const request = require('supertest');

const app = require('../app');

describe('Routes API', () => {
    it('returns status code 200 and a list with all routes', async () => {
        const response = await request(app).get('/routes');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);

        expect(response.body.length).toBeGreaterThan(0);
        
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('wall');
        expect(response.body[0]).toHaveProperty('type');
        expect(response.body[0]).toHaveProperty('grade');
        expect(response.body[0]).toHaveProperty('holdColor');
        expect(response.body[0]).toHaveProperty('setterId');
    });

    it('returns status 200 and one route for GET /routes/:id', async () => {
        const response = await request(app).get('/routes/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('name');
      });

    it('returns status 404 when route id does not exist', async () => {
        const response = await request(app).get('/routes/999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
      });
});