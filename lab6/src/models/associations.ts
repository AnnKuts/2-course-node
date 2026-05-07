import { UserModel } from './UserModel.ts'
import { FanficModel } from './FanficModel.ts'
import { FanficContentModel } from './FanficContentModel.ts'
import { FanficGenreModel } from './FanficGenreModel.ts'
import { GenreModel } from './GenreModel.ts'
import { ReviewModel } from './ReviewModel.ts'
import { CommentModel } from './CommentModel.ts'

UserModel.hasMany(FanficModel, { foreignKey: 'user_id' })
FanficModel.belongsTo(UserModel, { foreignKey: 'user_id' })

FanficModel.belongsToMany(GenreModel, {
  as: 'Genres',
  through: FanficGenreModel,
  foreignKey: 'fanfic_id',
  otherKey: 'genre_id',
})
GenreModel.belongsToMany(FanficModel, {
  as: 'Fanfics',
  through: FanficGenreModel,
  foreignKey: 'genre_id',
  otherKey: 'fanfic_id',
})

FanficModel.hasOne(FanficContentModel, { foreignKey: 'fanfic_id' })
FanficContentModel.belongsTo(FanficModel, { foreignKey: 'fanfic_id' })

FanficModel.hasMany(ReviewModel, { foreignKey: 'pub_id' })
ReviewModel.belongsTo(FanficModel, { foreignKey: 'pub_id' })

FanficModel.hasMany(CommentModel, { foreignKey: 'fanfic_id' })
CommentModel.belongsTo(FanficModel, { foreignKey: 'fanfic_id' })

export {
  UserModel,
  FanficModel,
  FanficContentModel,
  FanficGenreModel,
  GenreModel,
  ReviewModel,
  CommentModel,
}
