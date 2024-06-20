import { FunctionComponent } from 'react';
import { useIsFetching } from 'react-query';

const GlobalLoader: FunctionComponent = () => {
  const isFetching = useIsFetching();
  return (
    <div
      className={`fixed h-6 w-6 z-10 inset-0 ml-1 mt-1 ${
        isFetching ? '' : 'opacity-0'
      }`}
    >
      <div
        className={`h-6 w-6 rounded-full border-4 border-t-4 border-blue-200 ${
          isFetching ? 'animate-spin' : ''
        }`}
        style={{ borderTopColor: '#82b7fc' }}
      />
    </div>
  );
};

export default GlobalLoader;
