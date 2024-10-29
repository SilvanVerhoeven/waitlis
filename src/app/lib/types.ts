export type ErrorResponse = {
  error: string
}

export const isErrorResponse = (response: object) => "error" in response