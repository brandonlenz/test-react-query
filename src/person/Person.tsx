import React, { ReactElement } from "react";
import { usePersonApi } from "../queries/usePersonApi";

export const Person = (): ReactElement => {
  const { isLoading, isError, error, data } = usePersonApi()
  
  return (
    <div data-testid="person-container">
      {
        isLoading 
          ? <div data-testid="loader-div">Loading...</div> 
          : isError 
            ? <div data-testid="error-div">{error?.message}</div>
            : <div data-testid="person-div">{JSON.stringify(data?.data)}</div>
      }
    </div>
  )
}
