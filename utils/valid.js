const valid = (name, email, password, cf_password) => {
  if (!name || !email || !password) return 'Заполните все поля.'

  if (!validateEmail(email)) return 'Недействительные электронная почта.'

  if (password.length < 6) return 'Пароль должен состоять не менее чем из 6 символов..'

  if (password !== cf_password) return 'Пароли не совпадают.'
}

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export default valid
