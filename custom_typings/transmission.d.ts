type Ids = undefined |number| Array<number>|'recently=active';

interface SetTypes{
  bandwidthPriority?: number;
  downloadLimit?: number;
  downloadLimited?: boolean;
  'files-wanted'? : Array<any>;
  'files-unwanted'?: Array<any>;
  honorsSessionLimits?: boolean;
  ids: Ids;
  location?: string;
  'peer-limit'?: number;
  'priority-high': Ids;
  'priority-low': Ids;
  'priority-normal': Ids;
  seedRatioLimit: number;
  seedRatioMode: number;
  uploadLimit: number;
  uploadLimited: boolean;
}

declare class Transmission{
  start(ids: Ids);
  stop(ids: Ids);
  verify(ids: Ids);
  reannounce(ids:Ids);
  stopAll();
  startAll();
  set(ids: Ids);
  get()
}

interface Torrent{
  activityDate?: number;
  addedDate?: number;
  announceResponse?: string;
  announceURL?: string;
  bandwidthPriority?: number;
  comment?: string;
  corruptEver?: number;
  creator?: string;
  dateCreated?: number;
  desiredAvailable?: number;
  doneDate?: number;
  downloadDir?: string;
  downloadedEver?: number;
  downloaders?: number;
  downloadLimit?: number;
  downloadLimited?: boolean;
  error?: number;
  errorString?: string;
  eta?: number;
  files?: Array<TorrentFile>;
  fileStats?: Array<FileStat>;
  hashString?: string;
  haveUnchecked?: number;
  haveValid?: number;
  honorsSessionLimits?: boolean;
  id?: number;
  isPrivate?: boolean;
  lastAnnounceTime?: number;
  lastScrapeTime?: number;
  leechers?: number;
  leftUntilDone?: number;
  manualAnnounceTime?: number;
  maxConnectedPeers?: number;
  name?: string;
  nextAnnounceTime?: number;
  nextScrapeTime?: number;
  'peer-limit'?: number;
  peers?: Array<Peer>;
  peersConnected?: number;
  peersFrom?: PeersFrom;
  peersGettingFromUs?: number;
  peersKnown?: number;
  peersSendingToUs?: number;
  percentDone?: number;
  /**
  a bitfield holding pieceCount flags
  which are set to 'true' if we have
  the piece mathing that position.
  JSON doesn't allow raw binary data,
  so this is a base640encoded string
  **/
  pieces?: string;
  pieceCount?: number;
  pieceSize?: number;
  /**
  an array of tr_info.filecount numbers.
  eacg us the tr_priority_t mode for
  the corrisponding file
  **/
  priorities?: Array<any>;
  /**
   (B/s)
  **/
  rateDownload?: number;
  /**
   (B/s)
  **/
  rateUpload?: number;
  recheckProgress?: number;
  scrapeResponse?: string;
  scrapeURL?: string;
  seeders?: number;
  seedRatioLimit?: number;
  seedRatioMode?: number;
  sizeWhenDone?: number;
  startDate?: number;
  status?: number;
  /**
   (K/s)
  **/
  swarmSpeed?: number;
  timesCompleted?: number;
  trackers?: Array<Tracker>;
  totalSize?: number;
  torrentFile?: string;
  uploadedEver?: number;
  uploadLimit?: number;
  uploadLimited?: boolean;
  uploadRatio?: number;
  /**
  an array of tr_info.fileCount
  'booleans' true if the corresponding
  file is to be downloaded.
  **/
  wanted?: Array<any>;
  webseeds?: Array<Webseed>;
  webseedsSendingToUs?: number;
}

declare enum FileType{
  File,
  Dir,
  Other
}
interface TorrentFile{
  key: FileType;
  bytesCompleted: number;
  length: number;
  name: string;
}

interface FileStat{
  bytesCompleted: number;
  wanted: boolean;
  priority: number;
}
interface Peer{
  address: string;
  clientName: string;
  clientIsChoked: boolean;
  clientIsInterested: boolean;
  isDownloadingFrom: boolean;
  isEncrypted: boolean;
  isIncoming: boolean;
  isUploadingTo: boolean;
  peerIsChoked: boolean;
  peerIsInterested: boolean;
  port: number;
  progress: number;
  /**
  B/s
  **/
  rateToClient: number;
  /**
  B/s
  **/
  rateToPeer: number
}

interface PeersFrom{
  fromCache: number;
  fromIncoming: number;
  fromPex: number;
  fromTracker: number;
}

interface Tracker{
  announce: string;
  scrape: string;
  tier: number;
}
interface Webseed{
  webseed: string;
}
