export interface Note {
  id: number;
  text: string;
  tags: string[];
  pinned: boolean;
  createdAt: number;
}
