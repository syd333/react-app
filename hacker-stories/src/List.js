import React, { useState } from "react";
import { ReactComponent as Check } from "./check.svg";
import { sortBy } from "lodash";
import styles from "./App.module.css";

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
  AUTHOR: (list) => sortBy(list, "author"),
  COMMENT: (list) => sortBy(list, "num_comments").reverse(),
  POINT: (list) => sortBy(list, "points").reverse(),
};

type ListProps = {
  list: Stories,
  onRemoveItem: (item: Story) => void,
};

const List = ({ list, onRemoveItem }: ListProps) => {
  const [sort, setSort] = useState("NONE");

  const handleSort = (sortKey) => {
    setSort(sortKey);
  };


    const sortFunction = SORTS[sort];
    const sortedList = sortFunction(list);

  return (
    <div>
      <div>
        <span>
          <button type="button" onClick={() => handleSort("TITLE")}>
            Title
          </button>
        </span>
        <span>
          <button type="button" onClick={() => handleSort("AUTHOR")}>
            Author
          </button>
        </span>
        <span>
          <button type="button" onClick={() => handleSort("COMMENT")}>
            Comments
          </button>
        </span>
        <span>
          <button type="button" onClick={() => handleSort("POINT")}>
            Points
          </button>
        </span>
        <span>Actions</span>
      </div>
      {sortedList.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </div>
  );
};

type ItemProps = {
  item: Story,
  onRemoveItem: (item: Story) => void,
};

const Item = ({ item, onRemoveItem }: ItemProps) => (
  // { title, url, author, num_comments, points } <-- props coming in culd be like this
  // or -->  item: { objectID, title, url, author, num_comments, points }, then displayed as {url}{author} etc.

  // const handleRemoveItem = () => {
  //   onRemoveItem(item);
  // };
  <li className={styles.item} key={item.objectID}>
    <span style={{ width: "40%" }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: "30%" }}>{item.author}</span>
    <span style={{ width: "10%" }}>{item.num_comments}</span>
    <span style={{ width: "10%" }}>{item.points}</span>
    <span style={{ width: "10%" }}>
      <button
        type="button"
        className={`${styles.button} ${styles.buttonSmall}`}
        onClick={() => onRemoveItem(item)}
      >
        <Check height="18px" width="18px" />
      </button>
    </span>
  </li>
);
export { List };
