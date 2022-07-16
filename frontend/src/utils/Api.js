class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    return res.ok ? res.json() : Promise.reject(res.status);
  }

  getProfile() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }

  editProfile({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => this._checkResponse(res));
  }

  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    }).then((res) => this._checkResponse(res));
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }

  addlikeCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }

  deletelikeCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this._checkResponse(res));
  }

  avatarUpdate({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    }).then((res) => this._checkResponse(res));
  }

  changeLikeCardStatus(id, isLiked) {
    return isLiked ? this.addlikeCard(id) : this.deletelikeCard(id);
  }
}


export const api = new Api({
  // baseUrl: "https://mesto.nomoreparties.co/v1/cohort-39",
 
  baseUrl: "https://back-szh.students.nomorepartiesxyz.ru/api",
  headers: {
    authorization: localStorage.getItem("token"),
    "Content-Type": "application/json",
  },
});

export default api;
