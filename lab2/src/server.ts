import express, { type Request, type Response } from 'express';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>hello</h1>');
});

const person = {
    name: "Fedorenko",
    lovesMom: true
}

app.get('/fedorenko', (req: Request, res: Response) => {
    res.render('index', { person })
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});