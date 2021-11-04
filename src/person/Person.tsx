import React, { ReactElement } from "react";
import { useQuery } from 'react-query';
import httpClient from "../http/httpClient";

export const usePersonApi = () => {
  return useQuery('person-query', () => httpClient.get('https://swapi.dev/api/people/1/'))
}

export const Person = (): ReactElement => {
  const query = usePersonApi()
  
  return (
    <div data-testid="person-div">
      {query.isLoading ? "Loading..." : JSON.stringify(query.data?.data)}
    </div>
  )
}
