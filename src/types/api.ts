export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ItemsResponse<T> {
  items: T[]
}

export interface ApiError {
  detail: string
}

export interface MessageResponse {
  message: string
}

export interface ReorderRequest {
  ids: string[]
}
