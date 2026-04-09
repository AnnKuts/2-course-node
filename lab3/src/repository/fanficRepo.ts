import fs from 'fs';
import fsPromises from 'fs/promises';
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

export const getAllFanficsAsync = async (): Promise<Fanfic[]> => {
    try {
        const data = await fsPromises.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

export const getFanficByIdAsync = async (id: string): Promise<Fanfic | null> => {
    const fanfics = await getAllFanficsAsync();
    return fanfics.find(f => f.fanfic_id === id) || null;
};

export const saveFanficAsync = async (fanfic: Fanfic): Promise<void> => {
    let fanfics = await getAllFanficsAsync();
    const index = fanfics.findIndex(f => f.fanfic_id === fanfic.fanfic_id);
    
    if (index > -1) {
        fanfics[index] = fanfic;
    } else {
        fanfics.push(fanfic);
    }
    
    await fsPromises.writeFile(dataPath, JSON.stringify(fanfics, null, 2));
};