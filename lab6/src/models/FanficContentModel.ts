import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import sequelize from '../sequelize.ts'

export class FanficContentModel extends Model<
  InferAttributes<FanficContentModel>,
  InferCreationAttributes<FanficContentModel>
> {
  declare fanfic_id: string
  declare content: string | null
}

FanficContentModel.init(
  {
    fanfic_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    content: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    tableName: 'fanfic_contents',
    timestamps: false,
  }
)
