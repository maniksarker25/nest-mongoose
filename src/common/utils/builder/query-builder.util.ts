import { Query, FilterQuery } from 'mongoose';

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Search functionality --------------
  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm as string;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  // Filtering --------------
  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  // Sorting functionality
  sort() {
    const sortField = this.query.sort as string;
    if (sortField) {
      const order = sortField.startsWith('-') ? -1 : 1;
      const fieldName = sortField.replace('-', '');
      this.modelQuery = this.modelQuery.sort({
        [fieldName]: order,
      });
    } else {
      // Default sorting by 'createdAt'
      this.modelQuery = this.modelQuery.sort('-createdAt');
    }
    return this;
  }

  // Pagination --------------------
  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // Fields selection (optional: exclude or include fields)
  fields() {
    const fields =
      (this.query.fields as string)?.split(',')?.join(' ') || '-_v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  // Count the total documents for pagination metadata--------------
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}
