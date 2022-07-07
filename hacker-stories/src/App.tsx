import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
} from "react";
import axios from "axios";
import styles from "./App.module.css";
import styled from "styled-components";
import { SearchForm } from "./SearchForm";
import { List } from "./List";

const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;

  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);

  color: #171212;
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

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

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

// const getAsyncStories = () =>
//   new Promise((resolve) =>
//     setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
//   );

//custom hooks
const useStorageState = (
  key: string,
  initialState: string
): [string, (newValue: string) => void] => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue];
};

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type Stories = Array<Story>;

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

interface StoriesFetchInitAction {
  type: "STORIES_FETCH_INIT";
}

interface StoriesFetchSuccessAction {
  type: "STORIES_FETCH_SUCCESS";
  payload: Stories;
}

interface StoriesFetchFailureAction {
  type: "STORIES_FETCH_FAILURE";
}

interface StoriesRemoveAction {
  type: "REMOVE_STORY";
  payload: Story;
}

type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
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

const getSumComments = (stories) => {
  console.log("C");

  return stories.data.reduce((result, value) => result + value.num_comments, 0);
};

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  // const [stories, setStories] = useState(initialStories);

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(false);

  const handleFetchStories = useCallback(async () => {
    // useEffect(() => {
    // if (!searchTerm) return;
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    // getAsyncStories()
    try {
      const result = await axios.get(url);
      // setStories(result.data.stories);
      // setIsLoading(false);
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
      // setIsLoading(false);
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = useCallback((item) => {
    // const newStories = stories.filter(
    //   (story) => item.objectID !== story.objectID
    // );
    // setStories(newStories);
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  }, []);

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    e.preventDefault();
  };

  console.log("B:App");

  const sumComments = React.useMemo(() => getSumComments(stories), [stories]);

  // const searchedStories = stories.data.filter((story) =>
  //   story.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <StyledContainer>
      <StyledHeadlinePrimary>
        Hacker Stories with {sumComments} comments.
      </StyledHeadlinePrimary>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      {/* moved to separate component */}
      {/* <form onSubmit={handleSearchSubmit}>
        <InputWithLabel
          id="search"
          value={searchTerm}
          isFocused
          onInputChange={handleSearchInput}
        >
          <strong>Search:</strong>
        </InputWithLabel>

        <button type="submit" disabled={!searchTerm}>
          Submit
        </button> 
      </form> */}
      <hr />
      {stories.isError && <p> Something went wrong ... </p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </StyledContainer>
  );
};





export default App;
