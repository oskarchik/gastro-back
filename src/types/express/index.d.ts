// type Pagination = {
//   page: number;
//   limit: number;
//   offset: number;
// };
type Pagination = {
  page: number;
  limit: number;
  offset: number;
};

declare namespace Express {
  export interface Request {
    pagination: Pagination;
  }
}
