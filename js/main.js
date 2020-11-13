document.addEventListener("DOMContentLoaded", function() {

  // elems

  const menuToggle = document.querySelector('#menu-toggle'),
        menu = document.querySelector('.sidebar'),
        loginElem = document.querySelector(".login"),
        userElem = document.querySelector(".user"),
        userNameElem = userElem.querySelector(".user-name"),
        sidebarNavElem = document.querySelector(".sidebar-nav"),
        btnNewPost = document.querySelector(".button-new-post"),
        loginForm = document.querySelector(".login-form"),
        emailInput = loginForm.querySelector(".login-email"),
        passInput = loginForm.querySelector(".login-pass"),
        signupLink = loginForm.querySelector(".login-signup");

  // data

  const usersList = [
    {
      id: '01',
      email: 'den@mail.com',
      pass: 'qwerty',
      displayName: 'DenJs'
    },
    {
      id: '02',
      email: 'alex@gmail.com',
      pass: '12345',
      displayName: 'AlexC#'
    }
  ];

  const setUsers = {
    user: null,
    logIn(email, pass, handler) {

      console.log('logIn');

      const user = this.getUser(email)

      if (user && user.pass === pass) {
        this.authorizedUser(user);
        handler();
      } else {
        alert('Неверный email или пароль');
        emailInput.value = '';
        passInput.value = '';
      }

    },
    logOut() {
      console.log('logOut');
    },
    signUp(email, pass, handler) {
      console.log('signUp');

      if (!this.getUser(email)) {
        let displayName = email.slice(0, email.indexOf("@"));
        const user = {email, pass, displayName};

        usersList.push(user);
        this.authorizedUser(user);
        handler();

      } else {
        console.error('Пользователь с таким email уже существует');
        alert('Пользователь с таким email уже существует');
        emailInput.value = '';
        passInput.value = '';
      }
      
    },
    getUser(email) {
      return usersList.find((item) => item.email == email);
    },
    authorizedUser(user) {
      this.user = user;
    }
  }

  const toggleAuthDom = () => {
    const user = setUsers.user;
    if (user) {
      loginElem.style.display = 'none';
      userElem.style.display = '';
      userNameElem.textContent = user.displayName;
      sidebarNavElem.style.display = 'block';
      btnNewPost.style.display = 'flex';
    } else {
      loginElem.style.display = '';
      userElem.style.display = 'none';
      userNameElem.textContent = null;
      sidebarNavElem.style.display = '';
      btnNewPost.style.display = '';
    }
  }

  // events and func calls
  
  menuToggle.addEventListener('click', function (event) {

    event.preventDefault();

    menu.classList.toggle('visible');

  });

  loginForm.addEventListener("submit", event => {

    event.preventDefault();

    setUsers.logIn(emailInput.value, passInput.value, toggleAuthDom);

  });

  signupLink.addEventListener("click", event => {

    event.preventDefault();

    setUsers.signUp(emailInput.value, passInput.value, toggleAuthDom);

  });

  toggleAuthDom();

});


