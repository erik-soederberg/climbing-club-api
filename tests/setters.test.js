const fs = require('fs');
const path = require('path');
const request = require('supertest');

const app = require('../app');
const settersPath = path.join(__dirname, '..', 'data', 'setters.json');

describe('Setters API', () => {
    it('returns status 200 and a list with all setters', async () => {
        const response = await request(app).get('/setters');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('email');
    });

    it('returns status 200 and one setter for GET /setters/:id', async () => {
        const response = await request(app).get('/setters/1');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('email');
    });

    it('returns status 404 when setter id does not exist', async () => {
        const response = await request(app).get('/setters/999');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    it('returns status 201 when creating a setter', async () => {
        const original = fs.readFileSync(settersPath, 'utf8');

        try {
            const response = await request(app)
                .post('/setters')
                .send({ name: 'Testare Testsson', email: 'test@example.com' });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe('Testare Testsson');
        } finally {
            fs.writeFileSync(settersPath, original);
        }
    });

    it('returns status 400 when required fields are missing', async () => {
        const response = await request(app)
            .post('/setters')
            .send({ name: 'Saknar email' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});
