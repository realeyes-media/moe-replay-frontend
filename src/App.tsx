import Home from 'domains/Home';
import { QueryClient, QueryClientProvider } from 'react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalLoader from '@common/components/GlobalLoader';

const queryClient = new QueryClient();

toast.configure({
  position: 'top-right',
  autoClose: 10000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <QueryClientProvider client={queryClient}>
        <GlobalLoader />
        <Home />
      </QueryClientProvider>
    </div>
  );
}

export default App;
