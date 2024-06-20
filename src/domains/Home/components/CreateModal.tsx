import React, { FunctionComponent } from 'react';
import {
  createLivestream,
  createLivestreamQueued,
  CreateManifestInput,
} from 'library/api/index';
import { useMutation, useQueryClient } from 'react-query';
import Modal from '@common/components/Modal';
import { toast } from 'react-toastify';

interface CreateLivestreamModalProps {
  close?: () => void;
}

const CreateLivestreamModal: FunctionComponent<CreateLivestreamModalProps> = ({
  close,
}: CreateLivestreamModalProps) => {
  const queryClient = useQueryClient();
  const manifestID = 'manifest';
  const loopID = 'loop';
  const startTimeID = 'startTime';
  const dvrID = 'DVR';
  const cleanupTimeID = 'cleanupTime';
  const segmentProxyID = 'segmentProxy';
  const queueID = 'segmentProxy';

  const createStreamMutation = useMutation(createLivestream, {
    onSuccess: () => {
      close?.();
      queryClient
        .invalidateQueries('livestreamStatus')
        .catch((err: Error) => toast.error(err.message));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const createStreamQueuedMutation = useMutation(createLivestreamQueued, {
    onSuccess: () => {
      close?.();
      queryClient
        .invalidateQueries('livestreamStatus')
        .catch((err: Error) => toast.error(err.message));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const manifest = formData.get(manifestID) as string;
    const loop = formData.get(loopID) as number | null;
    const startTime = formData.get(startTimeID) as number | null;
    const dvr = formData.get(dvrID) as number | null;
    const cleanupTime = formData.get(cleanupTimeID) as number | null;
    const segmentProxy = formData.get(segmentProxyID) as boolean | null;
    const queue = formData.get(queueID) as boolean | null;

    const input: CreateManifestInput = {
      manifest,
      loop: loop || undefined,
      startTime: startTime || undefined,
      dvr: dvr || undefined,
      cleanupTime: cleanupTime || undefined,
      segmentProxy: segmentProxy || undefined,
    };

    if (queue) {
      createStreamQueuedMutation.mutate(input);
    } else {
      createStreamMutation.mutate(input);
    }
  }
  return (
    <Modal close={() => close?.()}>
      <div className="flex justify-end">
        <button
          type="button"
          className="p-2 text-base font-medium leading-5 text-white bg-blue-300 hover:bg-blue-600 rounded-lg self-center"
          onClick={() => close?.()}
        >
          Close
        </button>
      </div>
      <form className="flex flex-col space-y-6 px-4" onSubmit={handleSubmit}>
        <label htmlFor={manifestID} className="block">
          <span className="text-gray-700">Manifest*</span>
          <input
            type="text"
            name={manifestID}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </label>
        <label htmlFor={loopID} className="block self-center">
          <span className="text-gray-700">Loop</span>
          <input
            type="number"
            name={loopID}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label htmlFor={startTimeID} className="block self-center">
          <span className="text-gray-700">Start Time (seconds)</span>
          <input
            type="number"
            name={startTimeID}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label htmlFor={dvrID} className="block self-center">
          <span className="text-gray-700">DVR Window (seconds)</span>
          <input
            type="number"
            name={dvrID}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label htmlFor={cleanupTimeID} className="block self-center">
          <span className="text-gray-700">Cleanup Time (seconds)</span>
          <input
            type="number"
            name={cleanupTimeID}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <div className="flex space-x-12 self-center">
          <label
            htmlFor={segmentProxyID}
            className="flex flex-col items-center self-center"
          >
            <span className="text-gray-700">Segment Proxy</span>
            <input
              type="checkbox"
              name={segmentProxyID}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label
            htmlFor={queueID}
            className="flex flex-col items-center self-center"
          >
            <span className="text-gray-700">Queue</span>
            <input
              type="checkbox"
              name={queueID}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
        </div>
        <button
          type="submit"
          className="px-4 py-3 text-base font-medium leading-5 text-white bg-blue-300 hover:bg-blue-600 rounded-lg self-center"
        >
          Create Livestream
        </button>
      </form>
    </Modal>
  );
};

export default CreateLivestreamModal;
