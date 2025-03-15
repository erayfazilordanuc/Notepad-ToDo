import {useNetInfo} from '@react-native-community/netinfo';
import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const netInfo = useNetInfo();

// TO DO burada fonksiyonları offline ve online olarak değiştir ve çağrılma işlemlerini ana component halletsin
// yani netInfo ile baksın offline ya da online olma durumuna göre fonksiyonları çağırsın

// TO DO buraya error handler lazım

export const createNote = async (
  userOnline: boolean,
  notePayload?: NoteRequestPayload,
): Promise<Note | null> => {
  const userData = await AsyncStorage.getItem('user');
  const user: User = JSON.parse(userData!);

  const newNotePayload: NoteRequestPayload = {
    title: notePayload?.title || '',
    content: notePayload?.content || '',
    authorId: user.id,
    isFavorited: false,
  };

  let note;

  const jsonNotes = await AsyncStorage.getItem('notes');
  let notes: Note[];
  if (jsonNotes) {
    notes = jsonNotes ? JSON.parse(jsonNotes) : null;
  } else {
    notes = [];
  }

  // If user.id is bigger than 0 it is normal user otherwise it is local guest user
  if (userOnline && user.id! > 0) {
    const response = await apiClient.post(`/note`, newNotePayload);

    note = response.data;
  } else {
    const maxNoteId =
      notes.length > 0
        ? notes.reduce((maxNote, note) =>
            note.id! > maxNote.id! ? note : maxNote,
          )
        : null;

    note = {
      // TO DO bu idnin, online olunduğunda sunucuda veritabanında belirlenmesi lazım
      id: maxNoteId ? maxNoteId.id! + 1 : 0,
      title: newNotePayload.title,
      content: newNotePayload.content,
      authorId: newNotePayload.authorId,
      isFavorited: newNotePayload.isFavorited,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  notes.push(note);

  await AsyncStorage.setItem('notes', JSON.stringify(notes));

  return note;
};

export const getNotesByAuthorId = async (
  id: number,
  userOnline: boolean,
): Promise<Note[]> => {
  // Burada önce localdeki notlar ile sunucudakileri eşlesin
  // Created at değeri localdeki değer olsun
  let notes = [];

  if (userOnline && id > 0) {
    const response = await apiClient.get(`/note/author/${id}`);
    notes = response.data;
    await AsyncStorage.setItem('notes', JSON.stringify(notes));
  } else {
    const jsonNotes = await AsyncStorage.getItem('notes');
    if (jsonNotes) {
      notes = JSON.parse(jsonNotes);
    }

    notes = notes.filter((note: Note) => note.authorId === id);

    notes = [...notes].sort((a: Note, b: Note) => {
      return (
        new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
      );
    });
  }

  return notes;
};

export const getNote = async (
  id: number,
  userOnline: boolean,
): Promise<Note | null> => {
  let note;

  if (userOnline && id > 0) {
    const response = await apiClient.get(`/note/${id}`);
    note = response.data;
  } else {
    const jsonNotes = await AsyncStorage.getItem('notes');
    const notes: Note[] = jsonNotes ? JSON.parse(jsonNotes) : null;

    note = notes.find(n => n.id === id);
  }

  return note;
};

export const updateNote = async (
  noteId: number,
  notePayload: NoteRequestPayload,
  userOnline: boolean,
): Promise<Note | null> => {
  const userData = await AsyncStorage.getItem('user');
  const user: User = JSON.parse(userData!);

  notePayload = {
    title: notePayload!.title,
    content: notePayload!.content,
    authorId: user.id,
    isFavorited: notePayload.isFavorited,
  };

  const jsonNotes = await AsyncStorage.getItem('notes');
  let notes: Note[] = jsonNotes ? JSON.parse(jsonNotes) : [];

  const noteToUpdate = notes.find(n => n.id === noteId) || null;

  let updatedNote: Note;

  if (userOnline && user.id! > 0) {
    const response = await apiClient.post(`/note/${noteId}`, notePayload);
    updatedNote = response.data;
  } else {
    updatedNote = {
      id: noteId,
      title: notePayload.title,
      content: notePayload.content,
      authorId: notePayload.authorId,
      isFavorited: notePayload.isFavorited,
      createdAt: noteToUpdate!.createdAt,
      updatedAt: new Date(),
    };
  }

  notes = notes.map(note => (note.id === noteId ? updatedNote : note));

  await AsyncStorage.setItem('notes', JSON.stringify(notes));

  return updatedNote;
};

export const deleteNoteById = async (
  id: number,
  userOnline: boolean,
): Promise<void> => {
  const userData = await AsyncStorage.getItem('user');
  const user: User = JSON.parse(userData!);

  if (userOnline && user.id! > 0) {
    await apiClient.delete(`/note/${id}`);
  }

  const jsonNotes = await AsyncStorage.getItem('notes');
  let notes: Note[] = jsonNotes ? JSON.parse(jsonNotes) : [];

  notes = notes.filter(note => note.id !== id);

  await AsyncStorage.setItem('notes', JSON.stringify(notes));
};

export const deleteNotesByIds = async (
  ids: number[],
  userOnline: boolean,
): Promise<void> => {
  const userData = await AsyncStorage.getItem('user');
  const user: User = JSON.parse(userData!);

  if (userOnline && user.id! > 0) {
    await apiClient.delete(`/note`, {data: ids});
  }

  const jsonNotes = await AsyncStorage.getItem('notes');
  let notes: Note[] = jsonNotes ? JSON.parse(jsonNotes) : [];

  notes = notes.filter(note => !ids.includes(note!.id!));

  await AsyncStorage.setItem('notes', JSON.stringify(notes));
};
