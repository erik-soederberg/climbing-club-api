# Climbing Club API

REST-API för en klätterklubbs ledlogg (Inlämning 2). Ingen frontend, bara API. Datan ligger i json-filer under `/data`.

## Kom igång

```
npm install
npm start
```

Servern körs på http://localhost:3000

Tester:

```
npm test
```

## Endpoints

### Routes (leder)

| Metod | Sökväg | Vad den gör |
|---|---|---|
| GET | `/routes` | alla leder |
| GET | `/routes/:id` | en led |
| GET | `/routes/type/:type` | filtrera på typ, t.ex. `boulder` eller `led` |
| GET | `/routes/wall/:wall` | filtrera på vägg, t.ex. `vägg-a` |
| POST | `/routes` | skapa led |
| PUT | `/routes/:id` | uppdatera led |
| DELETE | `/routes/:id` | ta bort led |

POST/PUT body (name, wall, type och grade är obligatoriska):

```json
{
  "name": "Crimp City",
  "wall": "vägg-a",
  "type": "boulder",
  "grade": "6A",
  "holdColor": "orange",
  "setterId": 1
}
```

DELETE ger 204 och ingen body.

### Setters (sättare)

| Metod | Sökväg | Vad den gör |
|---|---|---|
| GET | `/setters` | alla sättare |
| GET | `/setters/:id` | en sättare |
| POST | `/setters` | skapa sättare (`name` och `email` krävs) |

## Felkoder

- **400** – saknas obligatoriska fält
- **404** – leden/sättaren finns inte
- **500** – t.ex. om json-filen saknas eller är korrupt
