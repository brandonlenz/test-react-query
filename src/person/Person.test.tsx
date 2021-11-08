import { render } from "@testing-library/react";
import { AxiosError, AxiosResponse } from "axios";
import { isError, UseQueryResult } from "react-query";
import { usePersonApi } from "../queries/usePersonApi";
import { Person } from "./Person";

jest.mock('../queries/usePersonApi', () => ({
  // __esModule: true,
  usePersonApi: jest.fn()
}))
const mockUsePersonApi = usePersonApi as jest.Mock

const personResponse = {
  data: {
    name:"Luke Skywalker",
    height:"172",
  }
}

describe("Person Component", () => {
  
  it("Loads the person data" , () => {
    mockUsePersonApi.mockReturnValueOnce({
      isLoading: false,
      data: personResponse
    })

    const { queryByTestId } = render(<Person />)
    
    const personDiv = queryByTestId('person-div')
    const loadingDiv = queryByTestId('loader-div')
    const errorDiv = queryByTestId('error-div')
    const stringifiedPerson = JSON.stringify(personResponse.data)

    expect(mockUsePersonApi).toHaveBeenCalledTimes(1)
    expect(personDiv).toBeInTheDocument()
    expect(personDiv).toHaveTextContent(stringifiedPerson)
    expect(loadingDiv).not.toBeInTheDocument()
    expect(errorDiv).not.toBeInTheDocument()
  })

  describe("while loading", () => {
    it("renders a loader", () => {
      mockUsePersonApi.mockReturnValueOnce({
        isLoading: true
      })
  
      const { queryByTestId } = render(<Person />)
      
      const personDiv = queryByTestId('person-div')
      const loadingDiv = queryByTestId('loader-div')
      const errorDiv = queryByTestId('error-div')  
  
      expect(mockUsePersonApi).toHaveBeenCalledTimes(1)
      expect(personDiv).not.toBeInTheDocument()
      expect(loadingDiv).toBeInTheDocument()
      expect(loadingDiv).toHaveTextContent("Loading...")
      expect(errorDiv).not.toBeInTheDocument()
    })
  })

  describe("given a query error", () => {
    it("shows the error message", () => {
      const error = {
        message: "An error occurred!"
      }

      mockUsePersonApi.mockReturnValueOnce({
        isError: true,
        error: error
      })
  
      const { queryByTestId } = render(<Person />)
      
      const personDiv = queryByTestId('person-div')
      const loadingDiv = queryByTestId('loader-div')
      const errorDiv = queryByTestId('error-div')      
  
      expect(mockUsePersonApi).toHaveBeenCalledTimes(1)
      expect(personDiv).not.toBeInTheDocument()
      expect(loadingDiv).not.toBeInTheDocument()
      expect(errorDiv).toBeInTheDocument()
      expect(errorDiv).toHaveTextContent(error.message)
    })
  })
})
