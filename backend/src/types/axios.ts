export type ApiError = {
  error: string
}

export type ApiResponse<T> = {
  [key: string]: T
}
