import { Op, WhereOptions } from 'sequelize';
import sequelize from '../sequelize.ts';
import { FanficModel, GenreModel, FanficContentModel } from '../models/associations.ts';
import { Fanfic } from '../models/fanfic.ts';

const INCLUDE_ALL = [
    { model: GenreModel, through: { attributes: [] } },
    { model: FanficContentModel },
];

const toFanfic = (f: FanficModel): Fanfic => ({
    fanfic_id: f.fanfic_id,
    user_id: f.user_id || '',
    title: f.title,
    description: f.description || '',
    genre: f.Genres?.map((g) => g.name) ?? [],
    restriction: f.restriction || '0+',
    rating: Number(f.rating) || 0,
    reports: Number(f.reports) || 0,
    content: f.FanficContent?.content ?? undefined,
});

export const getAll = async (): Promise<Fanfic[]> => {
    const fanfics = await FanficModel.findAll({ include: INCLUDE_ALL });
    return fanfics.map(toFanfic);
};

export const getById = async (id: string): Promise<Fanfic | null> => {
    const fanfic = await FanficModel.findByPk(id, { include: INCLUDE_ALL });
    return fanfic ? toFanfic(fanfic) : null;
};

export const create = async (fanfic: Partial<Fanfic>): Promise<string> => {
    return await sequelize.transaction(async (t) => {
        const created = await FanficModel.create({
            user_id: fanfic.user_id || null,
            title: fanfic.title!,
            description: fanfic.description || null,
            restriction: fanfic.restriction || '0+',
            rating: fanfic.rating || 0,
            reports: fanfic.reports || 0,
        }, { transaction: t });

        if (fanfic.content) {
            await FanficContentModel.create({
                fanfic_id: created.fanfic_id,
                content: fanfic.content,
            }, { transaction: t });
        }

        if (Array.isArray(fanfic.genre) && fanfic.genre.length > 0) {
            for (const name of fanfic.genre) {
                const [genre] = await GenreModel.findOrCreate({
                    where: { name },
                    transaction: t,
                });
                await (created as any).addGenre(genre, { transaction: t });
            }
        }

        return created.fanfic_id;
    });
};

export const update = async (id: string, fanfic: Partial<Fanfic>): Promise<void> => {
    await sequelize.transaction(async (t) => {
        const existing = await FanficModel.findByPk(id, { transaction: t });
        if (!existing) throw new Error('Fanfic not found');

        const fields: Partial<FanficModel> = {};
        if (fanfic.title !== undefined) fields.title = fanfic.title;
        if (fanfic.description !== undefined) fields.description = fanfic.description;
        if (fanfic.restriction !== undefined) fields.restriction = fanfic.restriction;
        if (fanfic.rating !== undefined) fields.rating = fanfic.rating;
        if (fanfic.reports !== undefined) fields.reports = fanfic.reports;
        await existing.update(fields, { transaction: t });

        if (fanfic.content !== undefined) {
            await FanficContentModel.upsert(
                { fanfic_id: id, content: fanfic.content },
                { transaction: t }
            );
        }

        if (fanfic.genre !== undefined) {
            await (existing as any).setGenres([], { transaction: t });
            if (Array.isArray(fanfic.genre) && fanfic.genre.length > 0) {
                for (const name of fanfic.genre) {
                    const [genre] = await GenreModel.findOrCreate({
                        where: { name },
                        transaction: t,
                    });
                    await (existing as any).addGenre(genre, { transaction: t });
                }
            }
        }
    });
};

export interface FanficFilterOptions {
    page: number;
    limit: number;
    genre?: string;
    restriction?: string;
    minRating?: number;
    search?: string;
}

export const getFanficsFiltered = async (
    opts: FanficFilterOptions
): Promise<{ rows: Fanfic[]; count: number }> => {
    const { page, limit, genre, restriction, minRating, search } = opts;

    const where: WhereOptions<FanficModel> = {};
    if (restriction) (where as any).restriction = restriction;
    if (minRating !== undefined) (where as any).rating = { [Op.gte]: minRating };
    if (search) (where as any).title = { [Op.iLike]: `%${search}%` };

    const genreInclude: any = {
        model: GenreModel,
        through: { attributes: [] },
        ...(genre ? { where: { name: genre }, required: true } : {}),
    };

    const { rows, count } = await FanficModel.findAndCountAll({
        where,
        include: [genreInclude, { model: FanficContentModel }],
        limit,
        offset: (page - 1) * limit,
        distinct: true, // потрібно для коректного count при LEFT JOIN
    });

    return { rows: rows.map(toFanfic), count };
};

export const deleteById = async (id: string): Promise<boolean> => {
    return await sequelize.transaction(async (t) => {
        const count = await FanficModel.destroy({
            where: { fanfic_id: id },
            transaction: t,
        });
        return count > 0;
    });
};
