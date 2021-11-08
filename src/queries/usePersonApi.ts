import { AxiosError, AxiosResponse } from "axios"
import { useQuery } from "react-query"
import httpClient from "../http/httpClient"

export const usePersonApi = () => {
  return useQuery<AxiosResponse, AxiosError>('person-query', () => httpClient.get('https://swapi.dev/api/people/1/'))
}