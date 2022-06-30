import React, { useState } from "react";

const App = () => {
  const stories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1> Hacker Stories</h1>
      <Search search={searchTerm} onSearch={handleSearch} />
      <hr />

      <List list={searchedStories} />
    </div>
  );
};

const Search = ({ search, onSearch }) => (
  <div>
    <label htmlFor="search">Search: </label>
    <input id="search" value={search} type="text" onChange={onSearch} />
  </div>
);

const List = ({ list }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} />
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

const Item = ({ item: { objectID, title, url, author, num_comments, points } }) => (
  // { title, url, author, num_comments, points }
  <li key={objectID}>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </li>
);

export default App;
