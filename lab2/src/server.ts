import express, { type Request, type Response } from 'express';
import { team } from '../team.js';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(express.static('public'));
app.use('/assets', express.static('assets'));

app.get('/', (req: Request, res: Response) => {
    res.redirect('/main.html');
});

app.get('/team', (req: Request, res: Response) => {
    res.render('team', { team });
});

app.get('/team/:slug', (req: Request, res: Response) => {
    const requestSlug = req.params.slug;
    const student = team.find(student => student.slug === requestSlug);

    if (student) {
        res.render('index', { student });
    } else {
        res.status(404).send('Student not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});