import React, { useState, useEffect, useRef, useReducer, useCallback } from "react";
import axios from 'axios'

  // const initialStories = [
  //   {
  //     title: "React",
  //     url: "https://reactjs.org/",
  //     author: "Jordan Walke",
  //     num_comments: 3,
  //     points: 4,
  //     objectID: 0,
  //   },
  //   {
  //     title: "Redux",
  //     url: "https://redux.js.org/",
  //     author: "Dan Abramov, Andrew Clark",
  //     num_comments: 2,
  //     points: 5,
  //     objectID: 1,
  //   },
  // ];

 const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

// const getAsyncStories = () =>
//   new Promise((resolve) =>
//     setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
//   );

//custom hooks
const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};
const App = () => {

  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`)

  // const [stories, setStories] = useState(initialStories);

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });


  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(false);


const handleFetchStories = useCallback( async () => {
  // useEffect(() => {
    // if (!searchTerm) return;
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    // getAsyncStories()
    try {
   const result = await axios.get(url)
        // setStories(result.data.stories);
        // setIsLoading(false);
        dispatchStories({
          type: "STORIES_FETCH_SUCCESS",
          payload: result.data.hits,
        });
        // setIsLoading(false);
     } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" })
    }
  }, [url]);


  useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories])


  const handleRemoveStory = (item) => {
    // const newStories = stories.filter(
    //   (story) => item.objectID !== story.objectID
    // );
    // setStories(newStories);
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit =() => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  }

  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1> Hacker Stories</h1>
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <button
      type="button"
      disabled={!searchTerm}
      onClick={handleSearchSubmit}>
        </button>
      {stories.isError && <p> Something went wrong ... </p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const InputWithLabel = ({
  id,
  label,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        id={id}
        ref={inputRef}
        autoFocus={isFocused}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      //       <Item
      //   key={item.objectID}
      //   title={item.title}
      //   url={item.url}
      //   author={item.author}
      //   num_comments={item.num_comments}
      //   points={item.points}
      // />
      // <Item key={item.objectID} {...item} />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => {
  // { title, url, author, num_comments, points } <-- props coming in culd be like this
  // or -->  item: { objectID, title, url, author, num_comments, points }, then displayed as {url}{author} etc.

  // const handleRemoveItem = () => {
  //   onRemoveItem(item);
  // };
  return (
    <li key={item.objectID}>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </li>
  );
};

export default App;
