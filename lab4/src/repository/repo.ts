import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Fanfic } from '../models/fanfic.ts';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data/fanfic.json');

export const getAllSync = () : Fanfic[] => {
    try {
        console.log('Repository: getAllSync called');
        const data = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading or parsing data:', error);
        return [];
    }
}