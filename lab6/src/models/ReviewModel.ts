import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'
import sequelize from '../sequelize.ts'

export class ReviewModel extends Model<
  InferAttributes<ReviewModel>,
  InferCreationAttributes<ReviewModel>
> {
  declare review_id: CreationOptional<string>
  declare pub_id: string
  declare user_id: string | null
  declare comment: string
  declare rating: number
  declare created_at: CreationOptional<Date>
}

ReviewModel.init(
  {
    review_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    pub_id: { type: DataTypes.UUID, allowNull: false },
    user_id: { type: DataTypes.UUID, allowNull: true },
    comment: { type: DataTypes.TEXT, allowNull: false },
    rating: { type: DataTypes.FLOAT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'reviews',
    timestamps: false,
  }
)
