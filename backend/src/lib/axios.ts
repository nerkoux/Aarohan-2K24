import axios from "axios"

export const makeRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})
