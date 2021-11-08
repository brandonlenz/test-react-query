import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Person } from './person/Person';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient} >
      <div className="App">
        <Person />
      </div>
    </QueryClientProvider>
  );
}



export default App;
