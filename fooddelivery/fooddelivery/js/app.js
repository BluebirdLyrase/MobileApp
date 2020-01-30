// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <!-- TODO: Add SDKs for Firebase products that you want to use
//firebase.google.com/docs/web/setup#config-web-app -->

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBAdq_u89QmDH-kYoEfjnSBK6yFy5jjWIU",
  authDomain: "food247-6c698.firebaseapp.com",
  databaseURL: "https://food247-6c698.firebaseio.com",
  projectId: "food247-6c698",
  storageBucket: "food247-6c698.appspot.com",
  messagingSenderId: "518082427459",
  appId: "1:518082427459:web:56a83897767553feaff2f6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

var db = firebase.firestore();

//Moniter authen status
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    console.log(email + " sign in");
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
  } else {
    // User is signed out.
    // ...
  }
});







document.addEventListener('init', function (event) {
  var page = event.target;


  if (page.id === 'homePage') {
    db.collection("recommended").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //object
        console.log(`${doc.id} => ${doc.data()}`);
        // each
        console.log("name : " + doc.data().name);
        console.log("id : " + doc.data().id);
        var carousel = `<ons-carousel-item modifier="nodivider" id="item1" class="recomended_item">
                <div class="thumbnail" style="background-image: url( ${doc.data().photourl} )">
                </div>
                <div class="recomended_item_title" id="item1_name">${doc.data().name}</div>
                </ons-carousel-item>`;
        $('#carousel').append(carousel);
        //` ` for ต่อ string

      });
    });

    db.collection("category").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //object
        console.log(`${doc.id} => ${doc.data()}`);
        // each
        console.log("name : " + doc.data().name);
        console.log("id : " + doc.data().id);
        var category = ` <ons-col width="50%" modifier="nodivider" style="margin-top:10px;">
              <div class="category_wrapper" style="background-image: url(${doc.data().photourl} )">
                  <figure class="category_thumbnail">
                      <div class="category_title" id="Category_1_name">${doc.data().name}</div>
                  </figure>
              </div>
          </ons-col>`;
        $('#category').append(category);
        //` ` for ต่อ string

      });
    });
    console.log("homePage");

    $("#menubtn").click(function () {
      $("#sidemenu")[0].open();
    });
  }

  if (page.id === 'menuPage') {
    console.log("menuPage");

    $("#login").click(function () {
      $("#content")[0].load("login.html");
      $("#sidemenu")[0].close();
    });

    $("#logout").click(function () {
      $("#content")[0].load("home.html");
      $("#sidemenu")[0].close();
      firebase.auth().signOut().then(function () {
        // Sign-out successful.
      }).catch(function (error) {
        // An error happened.
      });
    });

    $("#home").click(function () {
      $("#content")[0].load("home.html");
      $("#sidemenu")[0].close();
    });
  }

  if (page.id === 'loginPage') {
    console.log("loginPage");

    $("#signinbtn").click(function () {
      var username = $("#username").val();
      var password = $("#password").val();
      firebase.auth().signInWithEmailAndPassword(username, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log(errorCode);
        console.log(errorMessage);
      });

    });

    var provider = new firebase.auth.GoogleAuthProvider();
    $("#googlebtn").click(function () {
      firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    });

    $("#backhomebtn").click(function () {
      $("#content")[0].load("home.html");
    });
  }
});
