const fs = require('fs');
const path = require('path');
const request = require('supertest');

const app = require('../app');
const routesPath = path.join(__dirname, '..', 'data', 'routes.json');

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

      it('returns status 204 when deleting a route', async () => {
        const created = await request(app)
          .post('/routes')
          .send({
            name: 'Att radera',
            wall: 'vägg-a',
            type: 'boulder',
            grade: '6A',
          });
      
        const response = await request(app).delete(`/routes/${created.body.id}`);
      
        expect(response.status).toBe(204);
      
        const check = await request(app).get(`/routes/${created.body.id}`);
        expect(check.status).toBe(404);
      });

      it('returns status 404 when deleting a route that does not exist', async () => {
        const response = await request(app).delete('/routes/999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
      });

    it('returns only boulder routes for GET /routes/type/boulder', async () => {
        const all = await request(app).get('/routes');
        const response = await request(app).get('/routes/type/boulder');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body.length).toBeLessThan(all.body.length);
        expect(response.body.every((route) => route.type === 'boulder')).toBe(true);
      });

    it('returns only led routes for GET /routes/type/led', async () => {
        const response = await request(app).get('/routes/type/led');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body.every((route) => route.type === 'led')).toBe(true);
      });

    it('returns only routes on that wall for GET /routes/wall/:wall', async () => {
        const response = await request(app).get('/routes/wall/vägg-a');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body.every((route) => route.wall === 'vägg-a')).toBe(true);
      });

    it('returns status 500 when routes data cannot be read', async () => {
        const original = fs.readFileSync(routesPath, 'utf8');
        fs.writeFileSync(routesPath, '{not-valid-json');

        try {
          const response = await request(app).get('/routes');
          expect(response.status).toBe(500);
          expect(response.body).toHaveProperty('error');
        } finally {
          fs.writeFileSync(routesPath, original);
        }
      });
});