document.addEventListener("DOMContentLoaded", function() {

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

  console.log(firebase);

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
        userEditAvatar = userElem.querySelector(".edit-avatar"),
        postsWrapper = document.querySelector(".posts"),
        addPostForm = document.querySelector(".add-post"),
        addTextPostInput = addPostForm.querySelector(".add-text"),
        addTextSymbolCounter = addPostForm.querySelector(".add-text__counter");

  // data

  const REGEXP_MAIL_VALID = /^\w+@\w+\.\w{2,}$/;

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
    logIn(email, pass, handler) {

      console.log('logIn');

      if(!REGEXP_MAIL_VALID.test(email)) {
        alert("Невалидное поле email. \n Логин почты не может содержать спец.символы");
        return;
      }

      const user = this.getUser(email);

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

      if(!REGEXP_MAIL_VALID.test(email)) {
        alert("Невалидное поле email. \n Логин почты не может содержать спец.символы");
        return;
      }

      if (pass.trim() !== '') {
        if (!this.getUser(email)) {
          let displayName = email.substring(0, email.indexOf("@"));
          const user = {id : usersList.length + 1,email, pass, displayName, photoURL: ''};
          usersList.push(user);
          this.authorizedUser(user);
          console.log(usersList);
          if (handler) {
            handler();
          }

        } else {
          alert('Пользователь с таким email уже существует.');
        }       
      } else {
        alert("Вы не ввели пароль");
      }
    },
    editUser(username, avatar = '', handler) {
      if (username) {
        if (username.length < 3 || username.length > 11 ) {
          return alert("Недопустимая длина имени. Имя пользователя может содержать от 3 до 11 символов.")
        }
        this.user.displayName = username;
      }

      if (avatar) {
        this.user.photoURL = avatar;
      }

      if (handler) {
        handler();
      }

      setPosts.updateUserDataInPosts();
      showAllPosts();

    },
    getUser(email) {
      return usersList.find(item => item.email == email);
    },
    authorizedUser(user) {
      this.user = user;
    }
  }

  const setPosts = {
    posts: [
      {
        title: 'Заголовок этого поста',
        text: `Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Языком что рот
        маленький реторический вершину текстов обеспечивает гор свой назад решила сбить маленькая дорогу жизни рукопись ему
        букв деревни предложения, ручеек залетают продолжил парадигматическая? Но языком сих пустился, запятой своего его
        снова решила меня вопроса моей своих пояс коварный, власти диких правилами напоивший они текстов ipsum первую
        подпоясал? Лучше, щеке подпоясал приставка большого курсивных на берегу своего? Злых, составитель агентство что
        вопроса ведущими о решила одна алфавит!`,
        tags: ['свежее','новое','горячее','мое','случай'],
        author: {id: 1, displayName: 'DenJS', photoURL: ''},
        date: '11.11.20, 14.05',
        likes: 85,
        comments: 20
      },
      {
        title: 'Заголовок этого поста №2',
        text: `Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Языком что рот
        маленький реторический вершину текстов обеспечивает гор свой назад решила сбить маленькая дорогу жизни рукопись ему
        букв деревни предложения, ручеек залетают продолжил парадигматическая? Но языком сих пустился, запятой своего его
        снова решила меня вопроса моей своих пояс коварный, власти диких правилами напоивший они текстов ipsum первую
        подпоясал? Лучше, щеке подпоясал приставка большого курсивных на берегу своего? Злых, составитель агентство что
        вопроса ведущими о решила одна алфавит!`,
        tags: ['старческое','холодненькое','мое','привет'],
        author: {id: 2, displayName: 'atrem goncharov', photoURL: ''},
        date: '11.11.20, 14.05',
        likes: 26,
        comments: 6
      }
    ],
    addPost(title, text, tags, handler) {

      this.posts.unshift({
        title,
        text,
        tags: tags.split(',').map((item) => item.trim()),
        author: {
          id: setUsers.user.id,
          displayName: setUsers.user.displayName,
          photoURL: setUsers.user.photoURL
        },
        date: new Date().toLocaleDateString(),
        likes: 0,
        comments: 0
      });
      
      if (handler) {
        handler();
      }

      console.log(this.posts);

    },
    updateUserDataInPosts() {
      this.posts.forEach(post => {
        post.author.displayName = usersList[post.author.id - 1].displayName;
        post.author.photoURL = usersList[post.author.id - 1].photoURL;
      });
    }
  }

  const toggleAuthDom = () => {
    const user = setUsers.user;
    if (user) {
      loginElem.style.display = 'none';
      userElem.style.display = '';
      userNameElem.textContent = user.displayName || userNameElem.textContent;
      sidebarNavElem.style.display = 'block';
      btnNewPost.classList.add("visible");
      userAvatarElem.src = user.photoURL || userAvatarElem.src;
    } else {
      loginElem.style.display = '';
      userElem.style.display = 'none';
      sidebarNavElem.style.display = '';
      btnNewPost.classList.remove("visible");
      addPostForm.classList.remove("visible");
      postsWrapper.classList.add("visible");
    }
  }

  const showAddPost = () => {
    addPostForm.classList.add("visible");
    postsWrapper.classList.remove("visible");
  }
  
  const showAllPosts = () => {

    setPosts.updateUserDataInPosts();

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

      setPosts.addPost(title.value, text.value, tags.value, showAddPost);

      showAllPosts();

      addPostForm.classList.remove("visible");

      addPostForm.reset();

    });

    addTextPostInput.addEventListener("input", event => {
      addTextSymbolCounter.textContent = addTextPostInput.value.length;
    });
  

    showAllPosts(); 
  
    toggleAuthDom();

  }

  init();

});

fetch('https://jsonplaceholder.typicode.com/todos/20')
  .then(response => response.json())
  .then(json => console.log(json))


