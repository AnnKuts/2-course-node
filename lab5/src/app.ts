import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fanficRoutes from './routes/routes.ts';
import sequelize from './sequelize.ts';
import './models/associations.ts'; // реєструє всі моделі та зв'язки між ними

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', fanficRoutes);

sequelize.authenticate()
    .then(() => {
        console.log('Sequelize: з\'єднання з БД встановлено');
        app.listen(PORT, () => {
            console.log(`Makima is listening on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Sequelize: не вдалося підключитися до БД:', err);
        process.exit(1);
    });
