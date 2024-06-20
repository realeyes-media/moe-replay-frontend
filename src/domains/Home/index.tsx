import React, { useState } from 'react';
import {
  Livestream,
  getLivestreamsStatus,
  startLivestream,
  deleteLivestream,
} from 'library/api/index';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import Modal from '@common/components/Modal';
import HomeTableRow from './components/HomeTableRow';
import CreateLivestreamModal from './components/CreateModal';

function Home() {
  const queryClient = useQueryClient();
  const { data } = useQuery('livestreamStatus', getLivestreamsStatus);
  const startStreamMutation = useMutation(startLivestream, {
    onSuccess: () => {
      queryClient
        .invalidateQueries('livestreamStatus')
        .catch((err: Error) => toast.error(err.message));
    },
    onError: (error: Error) => {
      toast.error(error);
    },
  });
  const deleteStreamMutation = useMutation(deleteLivestream, {
    onSuccess: () => {
      queryClient
        .invalidateQueries('livestreamStatus')
        .catch((err: Error) => toast.error(err.message));
    },
    onError: (error: Error) => {
      toast.error(error);
    },
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [displayedStreamError, setDisplayedStreamError] = useState<string>();

  function handlePlay(livestream: Livestream) {
    startStreamMutation.mutate(livestream.startURL);
  }

  function handleDelete(id: string) {
    deleteStreamMutation.mutate(id);
  }

  return (
    <>
      <div className="border-b-2 border-blue-300 h-20 flex justify-between items-center px-6">
        <h1 className="text-lg font-semibold text-gray-800">
          MOE: Replay Livestream Monitor
        </h1>
        <button
          className="px-2 py-2 text-sm font-medium leading-5 text-white bg-blue-300 hover:bg-blue-600 rounded-lg"
          type="button"
          aria-label="Create Livestream"
          onClick={() => setShowCreateModal(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-plus"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 flex flex-col p-6">
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-300 uppercase border-b dark:border-gray-500 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">URLs</th>
                  <th className="px-4 py-3">Last Request Time</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-500 dark:bg-gray-800">
                {data &&
                  Object.keys(data).map((item) => (
                    <HomeTableRow
                      id={item}
                      livestream={data[item]}
                      handlePlay={() => handlePlay(data[item])}
                      handleDelete={() => handleDelete(item)}
                      handleErroredButtonClick={(errorMessage) => {
                        setDisplayedStreamError(errorMessage);
                      }}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showCreateModal ? (
        <CreateLivestreamModal close={() => setShowCreateModal(false)} />
      ) : null}
      {displayedStreamError ? (
        <Modal close={() => setDisplayedStreamError(undefined)}>
          <h1 className="font-bold text-2xl text-red-500 pb-3">Error</h1>
          <p>{displayedStreamError}</p>
        </Modal>
      ) : null}
    </>
  );
}

export default Home;
