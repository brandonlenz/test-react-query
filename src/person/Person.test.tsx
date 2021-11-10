import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { AxiosError, AxiosResponse } from "axios";
import { UseMutateFunction, UseMutationResult, UseQueryResult } from "react-query";

import { usePersonApi } from "../queries/usePersonApi";
import { useAddUser } from '../mutations/useAddUser'
import { Person } from "./Person";
import { User } from "../types/types";

// Mock the usePersonApi() custom hook
jest.mock('../queries/usePersonApi')
const mockUsePersonApi = usePersonApi as jest.MockedFunction<typeof usePersonApi>

// Mock the useAddUser() custom hook
jest.mock('../mutations/useAddUser')
const mockUseAddUser = useAddUser as jest.MockedFunction<typeof useAddUser>

const mockPersonResponse: AxiosResponse = {
  status: 200,
  statusText: 'OK',
  config: {},
  headers: {},
  data: {
    name:"Luke Skywalker",
    height:"172",
  }
}

const mockMutateFunction = jest.fn() as UseMutateFunction<AxiosResponse, AxiosError, User>

const mockAddUserResponse: AxiosResponse = {
  status: 200,
  statusText: 'OK',
  config: {},
  headers: {},
  data: {
    id: 11,
    name:"Brandon",
    job:"Software Engineer",
    createdAt: new Date()
  }
}

describe("Person Component", () => {

  // Before each test
  beforeEach(() => {
    // Reset mocks to reset function call counters
    jest.resetAllMocks()

    //Provide default implementation for mocks
    // Note: This must be done in the scope of each test. 
    // If done at the file level or describe level, or even within the beforeAll() scope, it does not apply. 
    // Mocks seem to carry an implementation for the scope of individual tests only.
    // Any calls of `mockReturnValueOnce()` or similar will override this default within a given test.

    //Provide default implementation for usePersonApi() hook
    mockUsePersonApi.mockImplementation(() => ({
      isLoading: false,
      data: mockPersonResponse
    } as UseQueryResult<AxiosResponse, AxiosError>))
    
    // Provide default implementation for useAddUser() hook
    mockUseAddUser.mockImplementation(() => ({
      isLoading: false,
      isError: false,
      mutate: mockMutateFunction,
      data: undefined
    } as UseMutationResult<AxiosResponse, AxiosError, User>))
  })

  describe("usePersonApi container", () => {
    it("Loads the person data" , () => {
      // mock the query hook to return a good response
      mockUsePersonApi.mockReturnValueOnce({
        isLoading: false,
        data: mockPersonResponse
      } as UseQueryResult<AxiosResponse, AxiosError>)
  
      const { queryByTestId } = render(<Person />)
      
      const personDiv = queryByTestId('person-div')
      const loadingDiv = queryByTestId('loader-div')
      const errorDiv = queryByTestId('error-div')
      const stringifiedPerson = JSON.stringify(mockPersonResponse.data)
  
      expect(mockUsePersonApi).toHaveBeenCalledTimes(1)
      expect(personDiv).toBeInTheDocument()
      expect(personDiv).toHaveTextContent(stringifiedPerson)
      expect(loadingDiv).not.toBeInTheDocument()
      expect(errorDiv).not.toBeInTheDocument()
    })
  
    describe("while loading", () => {
      it("renders a loader", () => {
        // mock the query hook to return a loading response
        mockUsePersonApi.mockReturnValueOnce({
          isLoading: true
        } as UseQueryResult<AxiosResponse, AxiosError>)
    
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
        } as AxiosError
        
        // mock the query hook to return an error response
        mockUsePersonApi.mockReturnValueOnce({
          isError: true,
          error: error
        } as UseQueryResult<AxiosResponse, AxiosError>)
    
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
  
  describe("useAddUser container", () => {
    describe("attempting to add a user", () => {
      it("displays the added user on success", () => {
        // mock the mutate function to return a good response
        mockUseAddUser.mockReturnValueOnce({
          isLoading: false,
          mutate: mockMutateFunction,
          data: mockAddUserResponse
        } as UseMutationResult<AxiosResponse, AxiosError, User>)
  
        const { getByTestId, queryByTestId } = render(<Person />)
  
        const addUserButton = getByTestId('add-user-button')
  
        userEvent.click(addUserButton)
  
        expect(mockMutateFunction).toHaveBeenCalledTimes(1)
        expect(mockMutateFunction).toHaveBeenCalledWith({ name: 'Brandon', job: 'Software Engineer'})
  
        const addedUserContainer = queryByTestId("added-user-container")
        const mutationLoaderDiv = queryByTestId("mutation-loader-div")
        const addUserErrorContainer = queryByTestId("add-user-error-container")
        
        expect(addedUserContainer).toBeInTheDocument()
        expect(addedUserContainer).toHaveTextContent(JSON.stringify(mockAddUserResponse.data))
        expect(mutationLoaderDiv).not.toBeInTheDocument()
        expect(addUserErrorContainer).not.toBeInTheDocument()
      })

      it("displays a loader while loading", () => {
        // mock the mutate function to return a loading response
        mockUseAddUser.mockReturnValueOnce({
          isLoading: true,
          mutate: mockMutateFunction
        } as UseMutationResult<AxiosResponse, AxiosError, User>)
  
        const { getByTestId, queryByTestId } = render(<Person />)
  
        const addUserButton = getByTestId('add-user-button')
  
        userEvent.click(addUserButton)
  
        expect(mockMutateFunction).toHaveBeenCalledTimes(1)
        expect(mockMutateFunction).toHaveBeenCalledWith({ name: 'Brandon', job: 'Software Engineer'})
  
        const addedUserContainer = queryByTestId("added-user-container")
        const mutationLoaderDiv = queryByTestId("mutation-loader-div")
        const addUserErrorContainer = queryByTestId("add-user-error-container")
        
        expect(addedUserContainer).not.toBeInTheDocument()
        expect(mutationLoaderDiv).toBeInTheDocument()
        expect(mutationLoaderDiv).toHaveTextContent("Loading...")
        expect(addUserErrorContainer).not.toBeInTheDocument()
      })

      it("displays an error when an error occurs", () => {
        const error = {
          message: "User could not be added!"
        } as AxiosError

        // mock the mutate function to return an error response
        mockUseAddUser.mockReturnValueOnce({
          isLoading: false,
          isError: true,
          error: error,
          mutate: mockMutateFunction
        } as UseMutationResult<AxiosResponse, AxiosError, User>)
  
        const { getByTestId, queryByTestId } = render(<Person />)
  
        const addUserButton = getByTestId('add-user-button')
  
        userEvent.click(addUserButton)
  
        expect(mockMutateFunction).toHaveBeenCalledTimes(1)
        expect(mockMutateFunction).toHaveBeenCalledWith({ name: 'Brandon', job: 'Software Engineer'})
  
        const addedUserContainer = queryByTestId("added-user-container")
        const mutationLoaderDiv = queryByTestId("mutation-loader-div")
        const addUserErrorContainer = queryByTestId("add-user-error-container")
        
        expect(addedUserContainer).not.toBeInTheDocument()
        expect(mutationLoaderDiv).not.toBeInTheDocument()
        expect(addUserErrorContainer).toBeInTheDocument()
        expect(addUserErrorContainer).toHaveTextContent(error.message)
      })
    })
  })
})
