import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'
import sequelize from '../sequelize.ts'

export class GenreModel extends Model<
  InferAttributes<GenreModel>,
  InferCreationAttributes<GenreModel>
> {
  declare genre_id: CreationOptional<number>
  declare name: string
}

GenreModel.init(
  {
    genre_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  },
  {
    sequelize,
    tableName: 'genres',
    timestamps: false,
  }
)
