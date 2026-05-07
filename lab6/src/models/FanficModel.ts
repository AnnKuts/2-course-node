import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize'
import sequelize from '../sequelize.ts'
import type { GenreModel } from './GenreModel.ts'
import type { FanficContentModel } from './FanficContentModel.ts'

export class FanficModel extends Model<
  InferAttributes<FanficModel, { omit: 'Genres' | 'FanficContent' }>,
  InferCreationAttributes<FanficModel, { omit: 'Genres' | 'FanficContent' }>
> {
  declare fanfic_id: CreationOptional<string>
  declare user_id: string | null
  declare title: string
  declare description: string | null
  declare restriction: CreationOptional<string>
  declare rating: CreationOptional<number>
  declare reports: CreationOptional<number>
  declare created_at: CreationOptional<Date>

  declare Genres?: NonAttribute<GenreModel[]>
  declare FanficContent?: NonAttribute<FanficContentModel>
}

FanficModel.init(
  {
    fanfic_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: { type: DataTypes.UUID, allowNull: true },
    title: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },

    restriction: { type: DataTypes.STRING, defaultValue: '0+' },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    reports: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'fanfics',
    timestamps: false,
  }
)
