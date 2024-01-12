// NewNote.tsx

import React, { useState } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

import styles from "./Core.module.css";

import {
  selectOpenNewNote,
  resetOpenNewNote,
  fetchNoteStart,
  fetchNoteEnd,
  fetchAsyncNewNote,
} from "../note/noteSlice";

import { Button, TextField,IconButton } from "@material-ui/core";
import { MdAddAPhoto } from "react-icons/md";
const customStyles = {
  content: {
    top: "55%",
    left: "50%",

    width: 280,
    height: 220,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

const NewNote: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const openNewNote = useSelector(selectOpenNewNote);

  const [title, setTitle] = useState(""); // タイトルだけをstateに持つ
  
  const newNote = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { title: title };
    await dispatch(fetchNoteStart());
    await dispatch(fetchAsyncNewNote(packet));
    await dispatch(fetchNoteEnd());
    setTitle("");
    dispatch(resetOpenNewNote());
  };

  return (
    <>
      <Modal
        isOpen={openNewNote}
        onRequestClose={async () => {
          await dispatch(resetOpenNewNote());
        }}
        style={customStyles}
      >
        <form className={styles.core_signUp}>
          <h1 className={styles.core_title}>Nowwas</h1>
          <br />
          <TextField
            placeholder="Please enter note title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
         
          <Button
            variant="contained"
            color="primary"
            onClick={newNote}
          >
            New note
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default NewNote;

