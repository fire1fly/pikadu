document.addEventListener("DOMContentLoaded", function() {

  // elems

  const menuToggle = document.querySelector('#menu-toggle'),
        menu = document.querySelector('.sidebar'),
        loginElem = document.querySelector(".login"),
        userElem = document.querySelector(".user"),
        userAvatarElem = userElem.querySelector(".user-avatar"),
        userNameElem = userElem.querySelector(".user-name"),
        sidebarNavElem = document.querySelector(".sidebar-nav"),
        btnNewPost = document.querySelector(".button-new-post"),
        loginForm = document.querySelector(".login-form"),
        emailInput = loginForm.querySelector(".login-email"),
        passInput = loginForm.querySelector(".login-pass"),
        signupLink = loginForm.querySelector(".login-signup"),
        btnExit = userElem.querySelector(".exit"),
        iconEdit = userElem.querySelector(".icon-edit"),
        userEditElem = userElem.querySelector(".user-edit"),
        userEditForm = userElem.querySelector(".edit-form"),
        userEditUsername = userElem.querySelector(".edit-username"),
        userEditAvatar = userElem.querySelector(".edit-avatar");

  // data

  const regExpValidEmail = /^\w+@\w+\.\w{2,}$/;

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

      if(!regExpValidEmail.test(email)) return alert("Невалидная почта.");

      const user = this.getUser(email)

      if (user && user.pass === pass) {
        this.authorizedUser(user);
        handler();
      } else {
        alert('Неверный email или пароль');
      }

    },
    logOut(handler) {
      this.user = null;
      handler();
    },
    signUp(email, pass, handler) {
      console.log('signUp');

      if(!regExpValidEmail.test(email)) return alert("Невалидное или пустое поле email.");

      if (pass.trim() !== '') {
        if (!this.getUser(email)) {
          let displayName = email.substring(0, email.indexOf("@"));
          const user = {email, pass, displayName, photo: ''};

          
          usersList.push(user);
          this.authorizedUser(user);
          handler();

        } else {
          console.error('Пользователь с таким email уже существует.');
          alert('Пользователь с таким email уже существует.');
        }       
      } else if (pass === '') {
        alert("Вы не ввели пароль");
      }
    },
    editUser(username, avatar = '', handler) {
      if (username) {
        this.user.displayName = username;
      }

      if (avatar) {
        this.user.photo = avatar;
      }

      handler();

      console.log(this.user);

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
      userNameElem.textContent = user.displayName || userNameElem.textContent;
      sidebarNavElem.style.display = 'block';
      btnNewPost.style.display = 'flex';
      userAvatarElem.src = user.photo || userAvatarElem.src;
    } else {
      loginElem.style.display = '';
      userElem.style.display = 'none';
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

    loginForm.reset();

  });

  signupLink.addEventListener("click", event => {

    event.preventDefault();

    setUsers.signUp(emailInput.value, passInput.value, toggleAuthDom);

    loginForm.reset();

  });

  btnExit.addEventListener("click", event => {

    event.preventDefault();

    setUsers.logOut(toggleAuthDom);

  });

  iconEdit.addEventListener("click", event => {
    event.preventDefault();

    userEditElem.classList.toggle("visible");
    
    userEditUsername.value = setUsers.user.displayName;

  });

  userEditForm.addEventListener("submit", event => {

    event.preventDefault();

    setUsers.editUser(userEditUsername.value, userEditAvatar.value, toggleAuthDom);

    userEditElem.classList.remove("visible");
  });

  toggleAuthDom();

});


