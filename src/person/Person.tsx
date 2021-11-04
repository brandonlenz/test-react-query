import React, { ReactElement } from "react";
import { useQuery } from 'react-query';
import { httpClient } from "../http/httpClient";

const getPerson = async () => {
  const { data } = await httpClient.get('https://swapi.dev/api/people/1/')
  return data
}

export const Person = (): ReactElement => {
  const query = useQuery('get-person', () => getPerson())
  
  return <div>
    {query.isLoading ? "Loading..." : JSON.stringify(query.data)}
  </div>
}
