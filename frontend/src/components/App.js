import { useState, useEffect } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Main from "./Main";
import Login from "./Login";
import Header from "./Header";
import Footer from "./Footer";
import api from "../utils/Api";
import Register from "./Register";
import ImagePopup from "./ImagePopup";
import InfoTooltip from "./InfoTooltip";
import { error } from "../utils/mestoAuth";
import AddPlacePopup from "./AddPlacePopup ";
import ProtectedRoute from "./ProtectedRoute";
import noImage from "../images/No-symbol.svg";
import yesImage from "../images/Yes-symbol.svg";
import * as mestoAuth from "../utils/mestoAuth";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import SafetyIssuePopup from "./SafetyIssuePopup";

function App() {
  const history = useHistory();
  const [cards, setCards] = useState([]);
  const [cardId, setCardId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [registered, setRegistered] = useState(false);
  const [isSafetyPopupOpen, setIsSafetyPopup] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ isOpen: false });
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);

  const yesSymbol = {
    symbol: currentUser.avatar ? currentUser.avatar : yesImage,
    text: error === 200 ?
      "Вы успешно зарегистрировались!" :
      `Добро пожаловать `,
    subtitle: `${currentUser.name}`
  };
  const noSymbol = {
    symbol: noImage,
    text: (error ?? `Нет сети`),
  };

  function handleAvatarUpdateClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleCardPopupClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleSafetyPopupOpen(card) {
    setIsSafetyPopup(true);
    setCardId(card._id);
  }

  function handleCardClick(card) {
    setSelectedCard({
      isOpen: true,
      ...card,
    });
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsSafetyPopup(false);
    setSelectedCard({ isOpen: false });
    setIsInfoTooltipOpen(false);
  }

  function handleUpdateUser({ name, about }) {
    api
      .editProfile({ name, about })
      .then((res) => {
        setCurrentUser(res.data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .avatarUpdate({ avatar })
      .then((res) => {
        setCurrentUser(res.data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleAddPlace({ name, link }) {
    api
      .addCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleCardLike(card) {
    let isLiked = card.likes.some((i) => i === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)

      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard.data : c))
        );
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleCardDelete() {
    api
      .deleteCard(cardId)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== cardId));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);

      });
  }

  const success = () => {
    setRegistered(true);
    setIsInfoTooltipOpen(true);
    setTimeout(closeAllPopups, 3000);

  };

  const failure = () => {
    setRegistered(false);
    setIsInfoTooltipOpen(true);
  };

  const handleLogin = async ({ password, email }) => {
    try {
      const data = await mestoAuth
        .authorize({ password, email });
      localStorage.setItem("token", data.token);
      success();
      setLoggedIn(true)

    } catch {
      failure();
    }
  };

  const handleRegister = async ({ password, email }) => {
    try {
      await mestoAuth
        .register({ password, email });
      handleLogin({ password, email });
      success();

    } catch {
      failure();
    }
  };





  const signOut = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    history.push("/sign-in");
  };



  useEffect(() => {
    localStorage.getItem("token") ?
      Promise.all([api.getProfile(), api.getInitialCards()])
        .then(([user, cards]) => {

          setUserEmail(user.email)
          setCurrentUser(user)
          setCards(cards.reverse())



          // setLoggedIn(true)
        })

        .catch((err) => {
          console.log(`Ошибка: ${err}`)
        }) :
      signOut()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInfoTooltipOpen])



  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <div className="page">
          <Header
            handleSignOut={signOut}
            loggedIn={loggedIn}
            userEmail={userEmail}
          />

          <Switch>
            <ProtectedRoute exact path="/" loggedIn={loggedIn}>
              <Main
                onEditAvatar={handleAvatarUpdateClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleCardPopupClick}
                onCardClick={handleCardClick}
                onCardDelete={handleSafetyPopupOpen}
                onCardLike={handleCardLike}
                cards={cards}
              />
            </ProtectedRoute>

            <Route path="/sign-up">
              {!loggedIn ? (
                <Register handleRegister={handleRegister} />
              ) : (
                <Redirect exact to="/" />
              )}
            </Route>

            <Route path="/sign-in">
              {!loggedIn ? (
                <Login handleLogin={handleLogin} />
              ) : (
                <Redirect exact to="/" />
              )}
            </Route>

            <Route path='*'>
              {loggedIn ? (
                <Redirect exact to="/" />
              ) : (
                <Redirect to="/sign-in" />
              )}
            </Route>
          </Switch>
          <Footer />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlace}
          />

          <SafetyIssuePopup
            isOpen={isSafetyPopupOpen}
            onClose={closeAllPopups}
            onSafetyIssue={handleCardDelete}
          />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <InfoTooltip

            image={registered ? yesSymbol : noSymbol}
            // {changeImage()}
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

