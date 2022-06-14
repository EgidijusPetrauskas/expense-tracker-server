import { CategoryDocument } from '../models/category-model';

export type CategoryViewModel = {
  id: string,
  title: string,
  createdAt: string,
  updatedAt: string,
};

const createCategoryViewModel = (categoryDoc: CategoryDocument): CategoryViewModel => ({
  id: categoryDoc._id.toString(),
  title: categoryDoc.title,
  createdAt: categoryDoc.createdAt,
  updatedAt: categoryDoc.updatedAt,
});

export default createCategoryViewModel;
