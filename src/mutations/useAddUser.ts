import { AxiosError, AxiosResponse } from "axios"
import { useMutation } from "react-query"
import httpClient from "../http/httpClient"
import { User } from "../types/types"

export const useAddUser = () => {
  return useMutation<AxiosResponse, AxiosError, User>(newUser => httpClient.post('https://reqres.in/api/users', newUser))
}
