import {
  Schema,
  Model,
  Document,
  Types,
  model,
} from 'mongoose';

type Category = {
  title: string,
  createdAt: string,
  updatedAt: string,
};

export type CategoryDocument = Document<Types.ObjectId, unknown, Category> & Category & {
  _id: Types.ObjectId;
};

const categorySchema = new Schema<Category, Model<Category>>({
  title: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const CategoryModel = model('Category', categorySchema);

export default CategoryModel;
