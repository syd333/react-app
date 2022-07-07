import  React from "react";
import { ReactComponent as Check } from "./check.svg";
import styles from "./App.module.css";

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

const List = ({ list, onRemoveItem }: ListProps) =>
  console.log("B:List") || (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  );

type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
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
