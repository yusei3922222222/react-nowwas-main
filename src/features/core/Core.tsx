import React, { useEffect, useState } from "react";
import Auth from "../auth/Auth";
import styles from "./Core.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { withStyles } from "@material-ui/core/styles";
import { Button, Grid, Avatar, Badge, CircularProgress } from "@material-ui/core";
import { MdAddAPhoto } from "react-icons/md";

import {
  editNickname,
  selectProfile,
  selectIsLoadingAuth,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  setOpenProfile,
  resetOpenProfile,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  fetchAsyncRegister,
} from "../auth/authSlice";

import {
  selectPosts,
  selectIsLoadingPost,
  setOpenNewPost,
  resetOpenNewPost,
  fetchAsyncGetPosts,
  fetchAsyncGetComments,
} from "../post/postSlice";

import {
  selectNotes,
  fetchAsyncGetNotes,
  setOpenNewNote,
  resetOpenNewNote,
  selectIsLoadingNote,
} from "../note/noteSlice";
import Post from "../post/Post";
import EditProfile from "./EditProfile";
import NewPost from "./NewPost";
import Note from "../note/Note";
import NewNote from "./NewNote";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const Core: React.FC = () => {
  const [activeTab, setActiveTab] = useState("post");
  const dispatch: AppDispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const posts = useSelector(selectPosts);
  const notes = useSelector(selectNotes);
  const isLoadingPost = useSelector(selectIsLoadingPost);
  const isLoadingNote = useSelector(selectIsLoadingNote);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          dispatch(setOpenSignIn());
          return null;
        }
        await dispatch(fetchAsyncGetPosts());
        await dispatch(fetchAsyncGetProfs());
        await dispatch(fetchAsyncGetComments());
        await dispatch(fetchAsyncGetNotes());
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  const handleSignUp = async () => {
    try {
      const signUpData = { email, password };
      await dispatch(fetchAsyncRegister(signUpData));
    } catch (error) {
      console.error("Sign Up Error:", error);
    }
  };

  return (
    <div>
      <Auth />
      <EditProfile />
      <NewPost />
      <NewNote />
      <div className={styles.core_header}>
        <h1 className={styles.core_title}>NowWas</h1>
        {profile?.nickName ? (
          <>
            <button
              className={`${styles.core_btnModal} ${activeTab === "post" ? styles.post : styles.none}`}
              onClick={() => {
                dispatch(setOpenNewPost());
                dispatch(resetOpenProfile());
                dispatch(resetOpenNewNote());
              }}
            >
              <MdAddAPhoto />
            </button>
            <button
              className={`${styles.core_btnModal} ${activeTab === "note" ? styles.note : styles.none}`}
              onClick={() => {
                dispatch(setOpenNewNote());
                dispatch(resetOpenProfile());
                dispatch(resetOpenNewPost());
              }}
            >
              <MdAddAPhoto />
            </button>
            <div className={styles.core_logout}>
              {(isLoadingPost || isLoadingAuth) && <CircularProgress />}
              <Button
                onClick={() => {
                  localStorage.removeItem("localJWT");
                  dispatch(editNickname(""));
                  dispatch(resetOpenProfile());
                  dispatch(resetOpenNewPost());
                  dispatch(resetOpenNewNote());
                  dispatch(setOpenSignIn());
                }}
              >
                Logout
              </Button>
              <button
                className={styles.core_btnModal}
                onClick={() => {
                  dispatch(setOpenProfile());
                  dispatch(resetOpenNewPost()); 
                }}
              >
                <StyledBadge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  variant="dot"
                >
                  <Avatar alt="who?" src={profile.img} />
                </StyledBadge>
              </button>
              
            </div>
          </>
        ) : (
          <div>
            <Button
              onClick={() => {
                dispatch(setOpenSignIn());
                dispatch(resetOpenSignUp());
              }}
            >
              LogIn
            </Button>
            <Button
              onClick={() => {
                dispatch(setOpenSignUp());
                dispatch(resetOpenSignIn());
              }}
            >
              SignUp
            </Button>
          </div>
        )}
      </div>

      {profile?.nickName && (
        <>
          <div className={styles.core_tabs}>
            <button
              className={`${styles.core_tabButton} ${
                activeTab === "note" ? "active" : ""
              }`}
              onClick={() => setActiveTab("note")}
            >
              Now
            </button>
            <button
              className={`${styles.core_tabButton} ${
                activeTab === "post" ? "active" : ""
              }`}
              onClick={() => setActiveTab("post")}
            >
              Was
            </button>
          </div>
          
          {activeTab === "note" && (
  <div className={styles.core_notes}>
    {isLoadingNote ? (
      <CircularProgress />
    ) : (
      <>
        <Grid container spacing={4}>
          {notes
            .slice()
            .reverse()
            .map((note) => (
              <Grid key={note.id} item xs={12} md={4}>
                <Note
                  noteId={note.id}
                  loginId={profile.userProfile}
                  userNote={note.userNote}
                  title={note.title}
                />
              </Grid>
            ))}
        </Grid>
      </>
    )}
  </div>
)}

          {activeTab === "post" && (
            <div className={styles.core_posts}>
              
              {isLoadingPost ? (
                <CircularProgress />
              ) : (
                <>
                <Grid container spacing={4}>
                  {posts
                    .slice()
                    .reverse()
                    .map((post) => (
                      <Grid key={post.id} item xs={12} md={4}>
                        <Post
                          postId={post.id}
                          title={post.title}
                          loginId={profile.userProfile}
                          userPost={post.userPost}
                          imageUrl={post.img}
                          liked={post.liked}
                        />
                      </Grid>
                    ))}
                    </Grid>
                    
                </>
                
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Core;
