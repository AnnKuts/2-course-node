import { getAllFanfics } from '../services/service.ts'

export const getAllFanficsController = () => {
    try {
        console.log('Controller: getAllFanficsController called');
        const fanfics = getAllFanfics();
        console.log('Fanfics:', fanfics);
    } catch (error) {
        console.error('Error in getAllFanficsController:', error);
    }
}