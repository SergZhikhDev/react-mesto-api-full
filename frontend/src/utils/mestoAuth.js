import { codeErrorMessage } from "./constants/errorCodes";
export const BASE_URL = "http://front-szh.students.nomorepartiesxyz.ru";
export let error ;

function checkResponse(res) {
  return res.ok ? res.json() : Promise.reject(error);
}

export const register = async ({ password, email }) => {
  const res = await fetch(BASE_URL + "/api/signup", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
      email,
    }),
  });
  // if (res.status === 400) {
  //   error = `Ошибка: некорректно заполнено одно из полей`;
  // } else {
  //   error = `Ошибка: ${res.status}` ;
  // }
  if (res.status === 201) {
    error = null
  } else {
    error = codeErrorMessage[res.status]
  }
  console.log('REG', error)
  return checkResponse(res);
};

export const authorize = async ({ password, email }) => {
  const res = await fetch(BASE_URL + "/api/signin", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
      email,
    }),
  });
  // if (res.status === 400) {
  //   error = `Ошибка: некорректно заполнено одно из полей` ;
  // } else if (res.status === 401) {
  //   error = `Ошибка: пользователь с email не найден` ;
  // } else {
  //   error = `Ошибка: ${res.status}` ;
  // }
  if (res.status === 200) {
    error = null
  } else {
    error = codeErrorMessage[res.status]
  }
  console.log('AUTH', error)
  return checkResponse(res);
};

// export const content = async (token) => {
//   const res = await fetch(BASE_URL + "/api/users/me", {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   // if (res.status === 400) {
//   //   error = `Ошибка: токен не передан или передан не в том формате`;
//   // } else if (res.status === 401) {
//   //   error = `Ошибка: переданный токен некорректен`;
//   // } else {
//   //   error = `Ошибка: ${res.status}` ;
//   // }

//   if (res.status === 200) {
//     error = null
//   } else {
//     error = codeErrorMessage[res.status]
//   }
//   console.log('CONT', error)
//   return checkResponse(res);
// };
