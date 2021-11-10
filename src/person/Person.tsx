import { ReactElement } from "react";
import { useAddUser } from "../mutations/useAddUser";
import { usePersonApi } from "../queries/usePersonApi";

export const Person = (): ReactElement => {
  const { isLoading, isError, error, data } = usePersonApi()
  const mutation = useAddUser()

  const newUser = { name: 'Brandon', job: 'Software Engineer' }

  console.log(mutation)

  return (
    <div data-testid="person-container">
      <div data-testid="fetched-person">
        {
          isLoading 
            ? <div data-testid="loader-div">Loading...</div> 
            : isError 
              ? <div data-testid="error-div">{error?.message}</div>
              : <div data-testid="person-div">{JSON.stringify(data?.data)}</div>
        }
      </div>
      
      <br />

      <div data-testid="user-mutation-container">
        <div>User to add: {JSON.stringify(newUser)}</div>
        <button 
          data-testid="add-user-button" 
          onClick={() => mutation.mutate(newUser)}
        >
          Add User
        </button>
        { 
          mutation.isLoading 
            ? <div data-testid="mutation-loader-div">Loading...</div>
            : mutation.isError
              ? <div data-testid="add-user-error-container">{mutation.error?.message}</div>
              : <div data-testid="added-user-container">{JSON.stringify(mutation.data?.data)}</div>
        }
      </div>
    </div>    
  )
}
