import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../sequelize.ts';

export class CommentModel extends Model<
    InferAttributes<CommentModel>,
    InferCreationAttributes<CommentModel>
> {
    declare comment_id: CreationOptional<string>;
    declare fanfic_id: string;
    declare user_id: string | null;
    declare text: string;
    declare created_at: CreationOptional<Date>;
}

CommentModel.init({
    comment_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    fanfic_id: { type: DataTypes.UUID, allowNull: false },
    user_id: { type: DataTypes.UUID, allowNull: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    sequelize,
    tableName: 'comments',
    timestamps: false,
});
