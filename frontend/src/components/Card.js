import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner=== currentUser._id;
  const cardDeleteButtonClassName = `element__basket ${
    isOwn ? "card__delete-button_visible" : "element__basket_hidden"
  }`;
  const isLiked = card.likes.some((i) => i=== currentUser._id);


  const cardLikeButtonClassName = `${isLiked ? "element__heart_active" : "element__heart"}`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="element">
      <img
        className="element__image"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />
      <button
        type="button"
        className={cardDeleteButtonClassName}
        onClick={handleDeleteClick}
      ></button>

      <div className="element__description">
        <p className="element__title">{card.name}</p>
        <div className="element__likeContainer">
          <button
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          ></button>
          <span className="element__likeCount">{card.likes.length}</span>
        </div>
      </div>
    </li>
  );
}

export default Card;
