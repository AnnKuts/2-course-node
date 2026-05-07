import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import sequelize from '../sequelize.ts'

export class FanficGenreModel extends Model<
  InferAttributes<FanficGenreModel>,
  InferCreationAttributes<FanficGenreModel>
> {
  declare fanfic_id: string
  declare genre_id: number
}

FanficGenreModel.init(
  {
    fanfic_id: { type: DataTypes.UUID, primaryKey: true },
    genre_id: { type: DataTypes.INTEGER, primaryKey: true },
  },
  {
    sequelize,
    tableName: 'fanfic_genres',
    timestamps: false,
  }
)
