import { DeactivatePreviousStep } from "aurelia-router";
import { firestore, FirebaseError } from "firebase";

interface User {
  firstName: string,
  lastName: string,
  avatarUrl: string
}

interface SearchQuery{

}

interface TorrentResult{
  title: string,
  content: string,
  link: string
}

interface SearchResuts{
  errorMessage?: string,
  torrents: Array<TorrentResult>,
  currentPage: number,
}
