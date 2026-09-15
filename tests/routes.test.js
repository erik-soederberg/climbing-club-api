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

      it('returns status 201 when creating a route', async () => {
        const newRoute = {
          name: 'Testled',
          wall: 'vägg-a',
          type: 'boulder',
          grade: '6A',
        };
      
        const response = await request(app)
          .post('/routes')
          .send(newRoute);
      
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('Testled');
      
        await request(app).delete(`/routes/${response.body.id}`);
      });

      it('returns status 400 when required fields are missing', async () => {
        const response = await request(app)
          .post('/routes')
          .send({ wall: 'vägg-a', type: 'boulder', grade: '6A' });
      
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('returns status 200 when updating a route', async () => {
        const created = await request(app)
          .post('/routes')
          .send({
            name: 'Att uppdatera',
            wall: 'vägg-a',
            type: 'boulder',
            grade: '6A',
          });
      
        const response = await request(app)
          .put(`/routes/${created.body.id}`)
          .send({
            name: 'Uppdaterad',
            wall: 'vägg-b',
            type: 'led',
            grade: '6b',
          });
      
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Uppdaterad');
        expect(response.body.wall).toBe('vägg-b');
      
        await request(app).delete(`/routes/${created.body.id}`);
      });

      it('returns status 404 when updating a route that does not exist', async () => {
        const response = await request(app)
          .put('/routes/999')
          .send({
            name: 'Finns inte',
            wall: 'vägg-a',
            type: 'boulder',
            grade: '6A',
          });
      
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
      });
});