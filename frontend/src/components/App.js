import { useState, useEffect } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import AddPlacePopup from "./AddPlacePopup ";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import SafetyIssuePopup from "./SafetyIssuePopup";
import ImagePopup from "./ImagePopup";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import * as mestoAuth from "../utils/mestoAuth";
import yesImage from "../images/Yes-symbol.svg";
import noImage from "../images/No-symbol.svg";
import { error } from "../utils/mestoAuth";
import api from "../utils/Api";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isSafetyPopupOpen, setIsSafetyPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ isOpen: false });
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [cardId, setCardId] = useState("");
  const history = useHistory();

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

  // function closeInfoTooltip() {
  //   if (registered) {
  //     history.push("/sign-in");
  //   }

  // }

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
    let isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)

      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function changeImage() {
    const yesSymbol = {
      symbol: yesImage,
      text: "Вы успешно зарегистрировались!",
    };
    const noSymbol = {
      symbol: noImage,
      text: `Что-то пошло не так!
    Попробуйте ещё раз.`,
    };
    let image = {};
    registered ? (image = yesSymbol) : (image = noSymbol);

    return image;
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
  };

  const failure = () => {
    setRegistered(false);
    setIsInfoTooltipOpen(true);
  };

  const handleLogin = ({ password, email }) => {
    return mestoAuth
      .authorize({ password, email })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          tokenCheck();
        }
      })

      .catch(() => {
        console.log(error);
        failure();
      });
  };

  const handleRegister = ({ password, email }) => {
    return mestoAuth
      .register({ password, email })

      .then(() => {
        history.push("/sign-in");
        success();
      })

      .catch(() => {
        console.log(error);
        failure();
      });
  };

  const tokenCheck = () => {
    let jwt = localStorage.getItem("token");
    if (jwt) {
      mestoAuth.content(jwt).then((res) => {
        if (res) {
          let userData = res.email;
          setLoggedIn(true);
          setUserEmail(userData);
        }
      });
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    history.push("/sign-in");
  };

  useEffect(() => {
    tokenCheck();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getInitialCards(), api.getProfile()])
        .then(([cards, user]) => {
          setCards(cards);
          setCurrentUser(user);
          history.push("/");
        })

        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
    }
    // eslint-disable-next-line
  }, [loggedIn]);

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
              <Register handleRegister={handleRegister} />
            </Route>

            <Route path="/sign-in">
              <Login handleLogin={handleLogin} />
            </Route>

            <Route>
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
            image={changeImage()}
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

/////////////////////////////////////// замечание ревьюера//////////////////////////////////////////////////
// После успешной регистрации нужно перекинуть пользователя на страницу входа, или выполнить вход в аккаунт
// НАДО ИСПРАВИТЬ
//
// Roland Sallatc
// ревьюер

//////////////////////////////////////////////ответ///////////////////////////////////////////////////////////////
// После успешной регистрации открывается попап success, а после закрытия попапа переход на страницу входа
