type User = {
  id?: number;
  username: string;
  email: string;
};

type Note = {
  id: number;
  title: string;
  content: string;
  authorId?: number;
  isFavorited?: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

type LoginRequestPayload = {
  username?: string;
  email?: string;
  password: string;
};

type RegisterRequestPayload = {
  username: string;
  email: string;
  password: string;
};

type GuestUser = {
  id: number;
  username: string;
  password: string;
};

type NoteRequestPayload = {
  title: string;
  content: string;
  authorId?: number;
  isFavorited?: boolean;
};
