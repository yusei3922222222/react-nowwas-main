import React, { useState } from "react";
import styles from "./Note.module.css";

import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Divider, Checkbox } from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";

import AvatarGroup from "@material-ui/lab/AvatarGroup";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

import { selectProfiles } from "../auth/authSlice";

import {
  fetchNoteStart,
  fetchNoteEnd,
} from "./noteSlice";

import { PROPS_NOTE } from "../types";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}));

const Note: React.FC<PROPS_NOTE> = ({
  noteId,
  loginId,
  userNote,
  title,
}) => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const profiles = useSelector(selectProfiles);
  const [text, setText] = useState("");

  const prof = profiles.filter((prof) => {
    return prof.userProfile === userNote;
  });


  if (title) {
    return (
      <div className={styles.note}>
        <div className={styles.note_header}>
          <Avatar className={styles.note_avatar} src={prof[0]?.img} />
          <h3>{prof[0]?.nickName}: {title}</h3>　
        </div>

        
      </div>
    );
  }
  return null;
};

export default Note;