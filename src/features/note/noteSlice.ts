import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_NEWNOTE } from "../types";

const apiUrlNote = `${process.env.REACT_APP_DEV_API_URL}api/note/`;
console.log('API URL:', apiUrlNote);


export const fetchAsyncGetNotes = createAsyncThunk("note/get", async () => {
  const res = await axios.get(apiUrlNote, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

export const fetchAsyncNewNote = createAsyncThunk(
  "note/note",
  async (newNote: PROPS_NEWNOTE) => {
    const uploadData = new FormData();
    uploadData.append("title", newNote.title);
    const res = await axios.post(apiUrlNote, uploadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const noteSlice = createSlice({
  name: "note",
  initialState: {
    isLoadingNote: false,
    openNewNote: false,
    notes: [
      {
        id: 0,
        title: "",
        userNote: 0,
        created_on: "",
      },
    ],
  },
  reducers: {
    fetchNoteStart(state) {
      state.isLoadingNote = true;
    },
    fetchNoteEnd(state) {
      state.isLoadingNote = false;
    },
    setOpenNewNote(state) {
      state.openNewNote = true;
    },
    resetOpenNewNote(state) {
      state.openNewNote = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetNotes.fulfilled, (state, action) => {
      return {
        ...state,
        notes: action.payload,
      };
    });
    builder.addCase(fetchAsyncNewNote.fulfilled, (state, action) => {
      return {
        ...state,
        notes: [...state.notes, action.payload],
      };
    });
  },
});

export const {
  fetchNoteStart,
  fetchNoteEnd,
  setOpenNewNote,
  resetOpenNewNote,
} = noteSlice.actions;

export const selectIsLoadingNote = (state: RootState) =>
  state.note.isLoadingNote;
export const selectOpenNewNote = (state: RootState) => state.note.openNewNote;
export const selectNotes = (state: RootState) => state.note.notes;

export default noteSlice.reducer;