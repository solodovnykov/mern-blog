import React, { useState } from "react";

import { useParams } from "react-router-dom";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useEffect } from "react";
import ReactMarkdown from 'react-markdown';

import axios from "../axios";

export const FullPost = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn(error);
      });
  }, []);

  if (isLoading) {
    return <Post isLoading={true} isFullPost />;
  }

  return (
    <>
      <Post
        _id={data._id}
        title={data.title}
        imageUrl={data.imageUrl}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost>
        <p>{data.text}</p>
        <ReactMarkdown children={data.text}/>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Will Smith",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Test Comment",
          },
          {
            user: {
              fullName: "Demna Gvasalia",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}>
        <Index />
      </CommentsBlock>
    </>
  );
};
