export type Tank01Response<T> = {
  statusCode: number;
  body: T;
  error?: string;
};
