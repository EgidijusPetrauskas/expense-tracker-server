import { RequestHandler } from 'express';

import CategoryModel from '../models/category-model';
import createCategoryViewModel, { CategoryViewModel } from '../view-model-creators/create-category-view-model';

type SingularCategoryResponse = { category: CategoryViewModel } | ErrorResponseBody;

export const getCategories: RequestHandler<
  unknown,
  { categories: CategoryViewModel[] }
> = async (req, res) => {
  const categoryDocs = await CategoryModel.find();

  res.status(200).json({
    categories: categoryDocs.map((categoryDoc) => createCategoryViewModel(categoryDoc)),
  });
};

export const getCategory: RequestHandler<
  { id: string },
  SingularCategoryResponse
> = async (req, res) => {
  const { id } = req.params;
  try {
    const categoryDoc = await CategoryModel.findById(id);
    if (categoryDoc === null) {
      throw new Error(`Category with id '${id}' is not found!`);
    }

    res.status(200).json({
      category: createCategoryViewModel(categoryDoc),
    });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error ? error.message : 'Server error searching for Category',
    });
  }
};

export const createCategory: RequestHandler<
  unknown,
  SingularCategoryResponse,
  { title: string }
> = async (req, res) => {
  const categoryProps = req.body;

  try {
    const existingCategories = await CategoryModel.find();
    const categoryExists = existingCategories.find((cat) => cat.title === categoryProps.title);

    if (categoryExists) {
      throw new Error('Category already exists!');
    }

    const categoryDoc = await CategoryModel.create(categoryProps);
    res.status(201).json({
      category: createCategoryViewModel(categoryDoc),
    });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error ? error.message : 'Server error while creating Category',
    });
  }
};

export const deleteCategory: RequestHandler<
  { id: string },
  SingularCategoryResponse
> = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryDoc = await CategoryModel.findByIdAndDelete(id);
    if (categoryDoc === null) {
      throw new Error(`Category with id '${id}' is not found!`);
    }

    res.status(200).json({
      category: createCategoryViewModel(categoryDoc),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Server error while deleting category',
    });
  }
};
