import express, { type Request, type Response } from 'express';
import { team } from '../team.js';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>hello</h1>');
});

app.get('/fedorenko', (req: Request, res: Response) => {
    const student = team.find(s => s.fullName === "Ivan Fedorenko");
    res.render('index', { student })
})
app.get('/fring', (req: Request, res: Response) => {
    const student = team.find(s => s.slug === "fring");
    res.render('index', { student })
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});