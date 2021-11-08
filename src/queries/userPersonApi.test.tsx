import { renderHook } from "@testing-library/react-hooks"
import { AxiosInstance } from "axios"
import { QueryClient, QueryClientProvider } from "react-query"
import httpClient from "../http/httpClient"
import { usePersonApi } from "./usePersonApi"

jest.mock('../http/httpClient')
const mockedHttpClient = httpClient as jest.Mocked<AxiosInstance>

const personResponse = {
  data: {
    name:"Luke Skywalker",
    height:"172",
  }
}

describe("usePersonApi Hook", () => {
  

  it("Calls the query", async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
    

    mockedHttpClient.get.mockResolvedValueOnce(personResponse)

    const { result, waitFor } =  renderHook(() => usePersonApi(), { wrapper })

    await waitFor(() => {
      return result.current.isSuccess
    })
    

    expect(mockedHttpClient.get).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual(personResponse)
  })
})