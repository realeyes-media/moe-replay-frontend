import React, { FunctionComponent, useState } from "react";
import { Livestream } from "library/api/index";
import { toast } from "react-toastify";

// @TODO: move this to constants
const MOE_VIEWER_URL =
  process.env.REACT_APP_MOE_VIEWER_URL || "https://mv.realeyes.cloud";

enum StatusCellStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  ERRORED = "ERRORED",
  ENDED = "ENDED",
  UNKNOWN = "UNKNOWN",
}

interface StatusTableCellProps {
  status: StatusCellStatus;
  handleErroredButtonClick: () => void;
}

function colorFromStatus(status: StatusCellStatus): string {
  switch (status) {
    case StatusCellStatus.ACTIVE: {
      return "bg-green-300";
    }
    case StatusCellStatus.PENDING: {
      return "bg-yellow-300";
    }
    case StatusCellStatus.ERRORED: {
      return "bg-red-300";
    }
    case StatusCellStatus.ENDED: {
      return "bg-blue-300";
    }
    case StatusCellStatus.UNKNOWN: {
      return "bg-gray-300";
    }
  }
}

const StatusCell: FunctionComponent<StatusTableCellProps> = ({
  status,
  handleErroredButtonClick,
}: StatusTableCellProps) => {
  const color = colorFromStatus(status);
  return (
    <td className="px-4 py-3 text-sm">
      <button
        type="button"
        aria-label="Status button"
        disabled={status !== StatusCellStatus.ERRORED}
        className="tooltip-target"
        onClick={handleErroredButtonClick}
      >
        <span className="tooltip-text ring-2 ring-blue-300 bg-gray-100 text-black px-2 py-1 rounded-lg -mt-8 shadow-md">
          {status}
        </span>
        <span
          className={`${color} px-4 py-4 rounded-full inline-block  align-middle`}
        >
          {" "}
        </span>
      </button>
    </td>
  );
};

interface MultipleURLsCellObject {
  name: string;
  url: string;
  href?: string;
}

interface MultipleURLsCellProps {
  objects: MultipleURLsCellObject[];
}

const MultipleURLsCell: FunctionComponent<MultipleURLsCellProps> = ({
  objects,
}: MultipleURLsCellProps) => {
  function handleCopyButton(text: string) {
    navigator.clipboard
      .writeText(text)
      .catch((error: Error) => toast.error(error.message));
  }

  const objectsWithURLs = objects.filter((value) => value.url.length > 0);

  return (
    <td className="px-4 py-3">
      {objectsWithURLs.map((value, index) => (
        <div className="flex items-center space-x-2 py-2" key={index}>
          <p className="text-xs font-bold">{value.name}</p>
          <button
            className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-white bg-blue-300 hover:bg-blue-600 rounded-lg"
            aria-label="Copy Live URL"
            type="button"
            onClick={() => handleCopyButton(value.url)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-copy"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          {value.href ? (
            <a
              className="text-xs break-all text-blue-300 hover:text-blue-600"
              href={value.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {value.url}
            </a>
          ) : (
            <p className="text-xs break-all">{value.url}</p>
          )}
        </div>
      ))}
    </td>
  );
};

interface TitleTableCellProps {
  value: string;
}

const LastRequestTimeCell: FunctionComponent<TitleTableCellProps> = ({
  value,
}: TitleTableCellProps) => <td className="px-4 py-3 text-sm">{value}</td>;

interface ActionsCellProps {
  handlePlay: () => void;
  handleDelete: () => void;
  hidePlay: boolean;
}

const ActionsCell: FunctionComponent<ActionsCellProps> = ({
  handlePlay,
  handleDelete,
  hidePlay = false,
}: ActionsCellProps) => {
  const [disablePlay, setDisablePlay] = useState(false);
  const [disableDelete, setDisableDelete] = useState(false);

  function handlePlayButton() {
    setDisablePlay(true);
    handlePlay();
  }

  function handleDeleteButton() {
    setDisableDelete(true);
    handleDelete();
  }

  return (
    <td className="px-4 py-3">
      <div className="flex items-center space-x-4 text-sm">
        <button
          className={`flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-white bg-blue-300 hover:bg-blue-600 rounded-lg ${
            hidePlay ? "hidden" : ""
          }`}
          aria-label="Start Livestream"
          type="button"
          disabled={disablePlay}
          onClick={handlePlayButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-play"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
        <button
          className="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-white bg-blue-300 hover:bg-blue-600 rounded-lg"
          aria-label="Stop/Delete Livestream"
          type="button"
          disabled={disableDelete}
          onClick={handleDeleteButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-trash-2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </td>
  );
};

interface HomeTableRowProps {
  id: string;
  livestream: Livestream;
  handlePlay: () => void;
  handleDelete: () => void;
  handleErroredButtonClick: (errorMessage?: string) => void;
}

function statusFromLivestream(livestream: Livestream): StatusCellStatus {
  switch (livestream.status) {
    case "ACTIVE": {
      return StatusCellStatus.ACTIVE;
    }
    case "PENDING": {
      return StatusCellStatus.PENDING;
    }
    case "ERRORED": {
      return StatusCellStatus.ERRORED;
    }
    case "ENDED": {
      return StatusCellStatus.ENDED;
    }
    default: {
      return StatusCellStatus.UNKNOWN;
    }
  }
}

function getFormattedLastRequestTime(epochTime: number): string {
  if (epochTime <= 0) {
    return "--:--:--";
  }
  const date = new Date(epochTime);
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);
  return `${hours}:${minutes}:${seconds}`;
}

function buildMoeViewerURL(manifestURL: string): string {
  return `${MOE_VIEWER_URL}/?url=${manifestURL}/`;
}

const HomeTableRow: FunctionComponent<HomeTableRowProps> = ({
  id,
  livestream,
  handlePlay,
  handleDelete,
  handleErroredButtonClick,
}: HomeTableRowProps) => {
  const livestreamStatus = statusFromLivestream(livestream);
  const hidePlay =
    livestreamStatus !== StatusCellStatus.PENDING &&
    livestreamStatus !== StatusCellStatus.ERRORED;
  const formattedLastRequestTime = getFormattedLastRequestTime(
    livestream.lastReqTime
  );
  const urlObjects: MultipleURLsCellObject[] = [
    {
      name: "Live",
      url: `${livestream.liveURL || ""}`,
      href: livestream.liveURL
        ? buildMoeViewerURL(livestream.liveURL)
        : undefined,
    },
    { name: "Manifest", url: livestream.manifest },
  ];
  return (
    <tr className="text-gray-500" key={id}>
      <StatusCell
        status={livestreamStatus}
        handleErroredButtonClick={() =>
          handleErroredButtonClick(livestream.errorMessage)
        }
      />
      <MultipleURLsCell objects={urlObjects} />
      <LastRequestTimeCell value={formattedLastRequestTime} />
      <ActionsCell
        handlePlay={handlePlay}
        handleDelete={handleDelete}
        hidePlay={hidePlay}
      />
    </tr>
  );
};

export default HomeTableRow;
