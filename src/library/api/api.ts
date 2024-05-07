import axios, { AxiosError } from 'axios';

const BASE_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3300';

const MANIFEST_ENDPOINT = `${BASE_API_URL}/manifest`;
const MANIFEST_QUEUE_ENDPOINT = `${BASE_API_URL}/manifest/queue`;
const LIVESTREAM_ENDPOINT = `${BASE_API_URL}/livestream`;
const STATUS_ENDPOINT = `${BASE_API_URL}/status`;

export interface LivestreamDictionary {
  [index: string]: Livestream;
}

export interface Livestream {
  lastReqTime: number;
  liveURL?: string;
  startURL: string;
  manifest: string;
  status: string;
  users: number;
  errorMessage?: string;
}

export interface CreateManifestInput {
  /**
   * The url of the VOD master manifest
   *
   * @type {string}
   * @memberof CreateManifestInput
   */
  manifest: string;
  /**
   * The number of times to loop the manifest. If -1 is set, then Replay will set the stream to be looped infinitely
   *
   * @type {number}
   * @memberof CreateManifestInput
   */
  loop?: number;
  /**
   * The number of seconds used to designate a specific offset from which to start the manifest live stream.
   *
   * @type {number}
   * @memberof CreateManifestInput
   */
  startTime?: number;
  /**
   * The number of seconds the length of the DVR window of a live stream.
   *
   * @type {number}
   * @memberof CreateManifestInput
   */
  dvr?: number;
  /**
   * The number of seconds to clean up the stream once it has entered the ENDED state.
   *
   * @type {number}
   * @memberof CreateManifestInput
   */
  cleanupTime?: number;
  /**
   * The segment proxy allows a user to rewrite the playlist to force the client to make segemnt requests go through Replay.
   *
   * @type {boolean}
   * @memberof CreateManifestInput
   */
  segmentProxy?: boolean;
}

interface ErrorResponse {
  message: string;
}

function handleAxiosError<T>(error: AxiosError): Promise<T> {
  if (error.response) {
    const errorResponse = error.response.data as ErrorResponse;
    if (errorResponse) {
      throw new Error(errorResponse.message);
    } else {
      throw new Error(error.message);
    }
  } else {
    throw new Error(error.message);
  }
}

export function getLivestreamsStatus(): Promise<LivestreamDictionary> {
  return axios
    .get(STATUS_ENDPOINT)
    .then((response) => response.data as LivestreamDictionary)
    .catch((error) => handleAxiosError<LivestreamDictionary>(error));
}

export function startLivestream(url: string): Promise<string> {
  return axios
    .get(url)
    .then((response) => response.toString())
    .catch((error) => handleAxiosError<string>(error));
}

export function deleteLivestream(id: string): Promise<string> {
  const url = new URL(`${LIVESTREAM_ENDPOINT}/deleteStream`);
  url.searchParams.append('id', id);
  return axios
    .get(url.toString())
    .then((response) => response.toString())
    .catch((error) => handleAxiosError<string>(error));
}

function buildCreateLivestreamURL(
  urlString: string,
  input: CreateManifestInput
): URL {
  const { manifest, loop, startTime, dvr, cleanupTime, segmentProxy } = input;
  const url = new URL(urlString);
  url.searchParams.append('manifest', manifest);
  if (loop) url.searchParams.append('loop', `${loop}`);
  if (startTime) url.searchParams.append('startTime', `${startTime}`);
  if (dvr) url.searchParams.append('dvr', `${dvr}`);
  if (cleanupTime) url.searchParams.append('cleanupTime', `${cleanupTime}`);
  if (segmentProxy)
    url.searchParams.append('sp', segmentProxy ? 'true' : 'false');
  return url;
}

export function createLivestreamQueued(
  input: CreateManifestInput
): Promise<string> {
  const url = buildCreateLivestreamURL(MANIFEST_QUEUE_ENDPOINT, input);
  return axios
    .get(url.toString())
    .then((response) => response.toString())
    .catch((error) => handleAxiosError<string>(error));
}

export function createLivestream(input: CreateManifestInput): Promise<string> {
  const url = buildCreateLivestreamURL(MANIFEST_ENDPOINT, input);
  return axios
    .get(url.toString())
    .then((response) => response.toString())
    .catch((error) => handleAxiosError<string>(error));
}
