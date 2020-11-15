// document.addEventListener("DOMContentLoaded", function() {

  const firebaseConfig = {
    apiKey: "AIzaSyD40f2H44NltOHguyhhkNMuT4GgfuVRtxE",
    authDomain: "pikazu-86a38.firebaseapp.com",
    databaseURL: "https://pikazu-86a38.firebaseio.com",
    projectId: "pikazu-86a38",
    storageBucket: "pikazu-86a38.appspot.com",
    messagingSenderId: "205422380916",
    appId: "1:205422380916:web:5b19cabffc42ff6de50e21"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

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
        forgetPassLink = loginForm.querySelector(".login-forget"),
        signupLink = loginForm.querySelector(".login-signup"),
        btnExit = userElem.querySelector(".exit"),
        iconEdit = userElem.querySelector(".icon-edit"),
        userEditElem = userElem.querySelector(".user-edit"),
        userEditForm = userElem.querySelector(".edit-form"),
        userEditUsername = userElem.querySelector(".edit-username"),
        userEditAvatar = userElem.querySelector(".edit-avatar"),
        postsWrapper = document.querySelector(".posts"),
        postWarnElem = postsWrapper.querySelector(".post.post-warning"),
        addPostForm = document.querySelector(".add-post"),
        addTextPostInput = addPostForm.querySelector(".add-text"),
        addTextSymbolCounter = addPostForm.querySelector(".add-text__counter");

  // data

  const REGEXP_MAIL_VALID = /^\w{0,}(\.|\w{0,})\w{0,}@\w{0,}\.\w{2,}$/,
        DEFAULT_PHOTO_URL = userAvatarElem.src;

  const usersList = [
    {
      id: 1,
      email: 'den@mail.com',
      pass: 'qwerty',
      displayName: 'DenJs'
    },
    {
      id: 2,
      email: 'alex@gmail.com',
      pass: '12345',
      displayName: 'AlexC#'
    }
  ];

  const setUsers = {
    user: null,
    initUser(handler) {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.user = user;
        } else {
          this.user = null;
        }
        if (handler) {
          handler();
        }
      });
    },
    logIn(email, pass, handler) {

      firebase.auth().signInWithEmailAndPassword(email, pass)
      .then(data => {
        this.user = data.user;
      })
      .catch(err => {
        const errCode = err.code;
        if (errCode === "auth/wrong-password") {
          alert("Неверный пароль.");
        } else if (errCode === "auth/user-not-found") {
          alert('Пользователь не найден.');
        } else {
          alert('Упс, возникла ошибка: ', err);
        }
        console.log(err);
      });

    },
    logOut(handler) {
      
      firebase.auth().signOut()
      .then(() => {
        console.log('Log out');
        if (handler) {
          handler()
        }
      });

    },
    signUp(email, pass, handler) {
      console.log('signUp');

      if(!REGEXP_MAIL_VALID.test(email)) {
        alert("Невалидное поле email. \n Логин почты не может содержать спец.символы");
        return;
      }

      if (pass.trim() !== '') {

        const displayName = email.slice(0, email.indexOf('@'));

        console.log(displayName);

        firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then(data => {
          this.editUser(email.slice(0, email.indexOf("@")), null, handler, 'signup');
        })
        .catch(error => {
          const errCode = error.code,
                errMsg = error.message;

          if (errCode === 'auth/weak-password') {
            alert("Пароль не может содержать меньше 6 символов.")
          } else if (errCode === 'auth/email-already-in-use') {
            alert("Этот email уже используется.");
          } else {
            alert(errMsg);
          }

          console.log(error);
        });

      } else {
        alert("Вы не ввели пароль");
      }
    },
    editUser(displayName, photoURL = '', handler, flag = '') {

      const user = firebase.auth().currentUser;

      if (displayName) {
        if ((displayName.length < 2 || displayName.length > 11 ) && !flag) {
          alert("Недопустимая длина имени. Имя пользователя может содержать от 2 до 11 символов.");
          return false;
        }
        if (photoURL) {
          user.updateProfile({
            displayName,
            photoURL
          }).then(handler);
        } else {
          user.updateProfile({
            displayName
          }).then(handler);
        }
      }

      if (handler) {
        handler();
      }

      // TODO: rewrite this by using firebase
      // setPosts.updateUserDataInPosts();
      // showAllPosts();

    },
    resetPass(email) {

      if(!email) {
        alert("Введите email.");
        return;
      }

      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          alert('Письмо отправлено');
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  const setPosts = {
    posts: [],
    addPost(title, text, tags, handler) {

      const user = firebase.auth().currentUser;

      this.posts.unshift({
        id: `postID${(+new Date()).toString(16)}-${user.uid.slice(0,2)}`,
        title,
        text,
        tags: tags.split(',').map((item) => item.trim()),
        author: {
          uid: setUsers.user.uid,
          displayName: setUsers.user.displayName,
          photoURL: setUsers.user.photoURL
        },
        date: new Date().toLocaleDateString(),
        likes: 0,
        comments: 0
      });
      
      firebase.database().ref('post').set(this.posts)
        .then(() => this.getPosts(handler));

      console.log(this.posts);

    },
    getPosts(handler) {
      firebase.database().ref('post').on('value', snapshot => {
        this.posts = snapshot.val() || [];

        if (handler) {
          handler();
        }

        if (this.posts.length === 0) {
          showWarnMsg();
        }
      });
    },
    filterPosts(filter) {
      this.posts.filter(post => {
        post.tags.forEach(tag => {
          if (tag === filter)
            return post;
        });
      });
    }
  }

  const toggleAuthDom = () => {
    const user = setUsers.user;
    if (user) {
      loginElem.style.display = 'none';
      userElem.style.display = '';
      sidebarNavElem.style.display = 'block';
      btnNewPost.classList.add("visible");
      userNameElem.textContent = user.displayName || userNameElem.textContent;
      userAvatarElem.src = user.photoURL || DEFAULT_PHOTO_URL;
    } else {
      loginElem.style.display = '';
      userElem.style.display = 'none';
      sidebarNavElem.style.display = '';
      btnNewPost.classList.remove("visible");
      addPostForm.classList.remove("visible");
      postsWrapper.classList.add("visible");
      userNameElem.textContent = '';
      userAvatarElem.src =  DEFAULT_PHOTO_URL;
    }
  }

  const showAddPost = () => {
    addPostForm.classList.add("visible");
    postsWrapper.classList.remove("visible");
  }
  
  const showAllPosts = () => {

    // setPosts.updateUserDataInPosts();

    let postsMarkup = '';

    setPosts.posts.forEach(({title, text, tags, author, date, likes, comments}) => {
      postsMarkup += `<section class="post">
                        <div class="post-body">
                          <h2 class="post-title">${title}</h2>
                          <p class="post-text">${text}</p>
                          <div class="tags">${tags.map(tag => `<a href="#${tag}" class="tag">#${tag}</a>`).join('')}</div>
                          <!-- /.tags -->
                        </div>
                        <!-- /.post-body -->
                        <div class="post-footer">
                          <div class="post-buttons">
                            <button class="post-button likes">
                              <svg width="19" height="20" class="icon icon-like">
                                <use xlink:href="img/icons.svg#like"></use>
                              </svg>
                              <span class="likes-counter">${likes}</span>
                            </button>
                            <button class="post-button comments">
                              <svg width="21" height="21" class="icon icon-comment">
                                <use xlink:href="img/icons.svg#comment"></use>
                              </svg>
                              <span class="comments-counter">${comments}</span>
                            </button>
                            <button class="post-button save">
                              <svg width="19" height="19" class="icon icon-save">
                                <use xlink:href="img/icons.svg#save"></use>
                              </svg>
                            </button>
                            <button class="post-button share">
                              <svg width="17" height="19" class="icon icon-share">
                                <use xlink:href="img/icons.svg#share"></use>
                              </svg>
                            </button>
                          </div>
                          <!-- /.post-buttons -->
                          <div class="post-author">
                            <div class="author-about">
                              <a href="#" class="author-username">${author.displayName}</a>
                              <span class="post-time">${date}</span>
                            </div>
                            <a href="#" class="author-link"><img src="${author.photoURL || 'img/user-avatar.png'}" alt="avatar" class="author-avatar"></a>
                          </div>
                          <!-- /.post-author -->
                        </div>
                        <!-- /.post-footer -->
                      </section>`
    });

    postsWrapper.innerHTML = postsMarkup;

    addPostForm.classList.remove("visible");
    postsWrapper.classList.add("visible");
    
  }

  const showWarnMsg = () => {
    postsWrapper.innerHTML = `
    <section class="post post-warning">
      <div class="post-body">
        <h2 class="post-title">Упс... новых постов нет.</h2>
      </div>
    </section>
    `;
  }

  // init

  const init = () => {

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

    forgetPassLink.addEventListener("click", event => {

      event.preventDefault();

      setUsers.resetPass(emailInput.value);

      emailInput.value = '';

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

    btnNewPost.addEventListener("click", event => {

      event.preventDefault();

      showAddPost();

    });

    addPostForm.addEventListener("submit", event => {

      event.preventDefault();

      const formElements = addPostForm.elements;

      const {title, text, tags} = formElements;

      console.log(title, text, tags);

      if (title.value.length < 3) {
        alert("Заголовок поста не может быть меньше 3 символов");
        return;
      }

      if (text.value.length < 3 || text.value.length > 1600) {
        alert("Длина поста не может быть меньше 3 и не больше 1600 символов");
        return;
      }

      setPosts.addPost(title.value, text.value, tags.value, showAllPosts);

      showAllPosts();

      addPostForm.classList.remove("visible");

      addPostForm.reset();

    });

    addTextPostInput.addEventListener("input", event => {
      addTextSymbolCounter.textContent = addTextPostInput.value.length;
    });


    setUsers.initUser(toggleAuthDom);

    setPosts.getPosts(showAllPosts);
  
    toggleAuthDom();

  }

  init();

// });



