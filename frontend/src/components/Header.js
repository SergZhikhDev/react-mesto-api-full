import logo from "../logo.svg";
import NavBar from "./NavBar";
function Header({ loggedIn, handleSignOut, userEmail }) {
  return (
    <header className="header">
      <img className="logo" src={logo} alt="логотип проекта Mesto" />
      {loggedIn ? (
        <NavBar handleSignOut={handleSignOut} userEmail={userEmail} />
      ) : null}
      <hr className="header__line" />
    </header>
  );
}

export default Header;
