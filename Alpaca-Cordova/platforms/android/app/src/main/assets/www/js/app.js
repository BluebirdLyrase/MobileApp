console.log('Alpaca Onsen Webapp ver 0.2.4');

// Your web app's Firebase configuration
var item = [];
var firebaseConfig = {
    apiKey: "AIzaSyC2pyNOOA-f53D-UCcoGQPJECnEc5SLC6g",
    authDomain: "alpaca-one-page.firebaseapp.com",
    databaseURL: "https://alpaca-one-page.firebaseio.com",
    projectId: "alpaca-one-page",
    storageBucket: "alpaca-one-page.appspot.com",
    messagingSenderId: "598311265035",
    appId: "1:598311265035:web:602895d35ecefd48b8f80e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function payment(){
    document.querySelector('#myNavigator').pushPage('content/address.html');
}

function setAddress(){
    var lat = localStorage.getItem("selectedLat");
    var lng = localStorage.getItem("selectedLng");
    if(item.length != 0){
    ons.notification.confirm({
        message: 'Set delivery destination to Latitude : '+lat+'<bry> Longtitude : '+lng+' ?',
        callback: function (answer) {
            if (answer == 1) {
                ons.notification.alert('Your order is on the way');
                item = [];
                document.querySelector('#myNavigator').resetToPage('splitter.html');

            }
        }
    });
    }else{
        ons.notification.alert('Set delivery destination to Latitude : '+lat+'<bry> Longtitude : '+lng);
    }

    
}

function setIDtoFoodMenu(ID) {
    localStorage.setItem("selectedID", ID);
    document.querySelector('#myNavigator').pushPage('content/Food.html')
}

function setSelectedCatagory(Catagory) {
    localStorage.setItem("selectedCatagory", Catagory);
    document.querySelector('#myNavigator').pushPage('content/Result.html')
}

function deletebtn(index, name) {
    item.splice(index, 1);
    orderTable();
}

function orderTable() {
    var total = 0;
    $("#orderTable").empty();
    tablehead = "<th>Name of dish</th><th>Price</th>";
    $("#orderTable").append(tablehead);
    item.forEach((item, index) => {
        var orderTable = `<tr>              
        <td style="color:grey">${item[0]}</td>
        <td style="color:grey">${item[1]}</td>
        <td>
        <div class="deletebtn" onclick="deletebtn(${index},'${item[0]}')">x</div>
        </td>
        </tr>`;
        $("#orderTable").append(orderTable);
        total = total + item[1];
    });
    $("#total").empty();
    $("#total").append('<b>Total : </b> ฿ ' + total);
}

function itemNoti() {
    if (item.length != 0) {
        $("#orderNoti").empty();
        $("#orderNoti").append(item.length);
    } else {
        $("#orderNoti").empty();
    }
}

function buybtn(name, price) {
    var ResStatus = localStorage.getItem("ResStatus");
    console.log(ResStatus);
    var user = firebase.auth().currentUser;
    if (!user) {
        ons.notification.alert('Please Sign-in! before place order');
    } else if (ResStatus) {
        item.push([name, price]);
        console.log(item);
        ons.notification.alert(name + ' (฿' + price + ') ' + 'has been added');
        itemNoti();
    } else {
        ons.notification.alert('This Resturant is close');
    }
}

function backbtn() {
    document.querySelector('#myNavigator').popPage();
}

function backbtnconfirm() {
    if (item.length != 0) {
        ons.notification.confirm({
            message: 'your order will be reset!',
            callback: function (answer) {
                if (answer == 1) {
                    item = [];
                    document.querySelector('#myNavigator').popPage();
                }
            }
        });
    } else {
        document.querySelector('#myNavigator').popPage();
    }
}

function createCard(id, img, name, distance, star, status) {

    var card = `<ons-card style="height : auto; margin-top:0px;" onclick="setIDtoFoodMenu('${id}')"><ons-row>
    <ons-col width="25%"><img src=${img}} alt="Onsen UI"style="width: 65px; height :55px;"></ons-col>
    <ons-col width="75%">
    <div style="font-size: 17px; white-space: nowrap;">&nbsp;&nbsp;<b>${name}</b></div>
    <div style="color:grey">&nbsp;&nbsp;&nbsp;Distance : ${distance}  km</div>
    <ons-row>&nbsp;&nbsp;
    <ons-col width="50%">` //for starrate
    for (var i = star; i > 0; i--) {
        card += '<i class="fas fa-star star"></i>';
    }
    for (var i = (5 - star); i > 0; i--) {
        card += '<i class="fas fa-star grey"></i>';
    }
    card += '</ons-col>';
    if (status) card += '<ons-col width="45%"  class="open" ><b>Open</b></ons-col>';
    else card += '<ons-col width="45%"  class="close" ><b>Close</b></ons-col>';
    card += '</ons-row></ons-col></ons-row></ons-card>';
    return card;
}

function Search(name) {

    db.collection("Resturant").where("name", "==", name).get().then((querySnapshot) => {
        $('#Searchcard').empty();
        querySnapshot.forEach((doc) => {
            /////////////////////Append Resturant Card////////////////////////////////////
            var Rescard = createCard(doc.id, doc.data().img, doc.data().name, doc.data().distance, doc.data().star, doc.data().status);
            $('#Searchcard').append(Rescard);
        });
    });

}

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
        ons.notification.alert('Successfully Sign-in!');
        // ...
    } else {
        // User is signed out.
        // ...
    }
});

document.addEventListener('init', function (event) {
    var page = event.target;
    console.log(page.id);


    if (page.id === "tabbar") {
        //Code for tabbar
        $("#menubtn").click(function () {
            $("#sidemenu")[0].open();
        });

        ///////////////////change tabbar color//////////////////
        $("#tabbar1").click(function () {
            $(this).attr("style", "background-color: rgb(173, 232, 105);");
            $("#tabbar2").attr("style", "background-color: rgb(255, 163, 26);");
            $("#tabbar3").attr("style", "background-color: rgb(255, 163, 26);");
            $("#tabbar4").attr("style", "background-color: rgb(255, 163, 26);");
            $("#title").empty();
            $("#title").append("Recommended");
        });
        $("#tabbar2").click(function () {
            $(this).attr("style", "background-color: rgb(173, 232, 105);");
            $("#tabbar1").attr("style", "background-color: rgb(255, 163, 26);");
            $("#tabbar3").attr("style", "background-color: rgb(255, 163, 26);");
            $("#tabbar4").attr("style", "background-color: rgb(255, 163, 26);");
            $("#title").empty();
            $("#title").append("Search for Resturant");
        });
        $("#tabbar3").click(function () {
            $(this).attr("style", "background-color: rgb(173, 232, 105);");
            $("#tabbar1").attr("style", "background-color: rgb(255, 163, 26);");
            $("#tabbar2").attr("style", "background-color: rgb(255, 163, 26);");
            $("#tabbar4").attr("style", "background-color: rgb(255, 163, 26);");
            $("#title").empty();
            $("#title").append("Setting");
        });
        $("#tabbar4").click(function () {
            $(this).attr("style", "background-color: rgb(173, 232, 105);");
            $("#tabbar1").attr("style", "background-color: rgb(255, 163, 26);");
            $("#tabbar2").attr("style", "background-color: rgb(255, 163, 26);");
            $("#tabbar3").attr("style", "background-color: rgb(255, 163, 26);");
            $("#title").empty();
            $("#title").append("Basket");
        });
        ///////////////////end of change tabbar color//////////////////
    }

    if (page.id === "menu") {
        //Code for sidemenu
        $("#regisbtn").click(function () {
            console.log('regisbtn pressed');
            document.querySelector('#myNavigator').pushPage('content/regis.html');
            $("#sidemenu")[0].close();
        });
        $("#loginbtn").click(function () {
            console.log('loginbtn pressed');
            document.querySelector('#myNavigator').pushPage('content/login.html');
            $("#sidemenu")[0].close();

        });
        $("#logoutbtn").click(function () {
            console.log('logoutbtn pressed');
            $("#sidemenu")[0].close();
            firebase.auth().signOut().then(function () {
                // Sign-out successful.
            }).catch(function (error) {
                // An error happened.
            });
        });
        $("#addressbtn").click(function(){
            document.querySelector('#myNavigator').pushPage('content/address.html');
            $("#sidemenu")[0].close();
        });





    }


    if (page.id === "Result") {
        var selectedCatagory = localStorage.getItem("selectedCatagory");
        db.collection("Resturant").where("catagory", "==", selectedCatagory)
            .get().then((querySnapshot) => {
                $('#Resturantcard').empty();
                querySnapshot.forEach((doc) => {
                    Rescard = createCard(doc.id, doc.data().img, doc.data().name, doc.data().distance, doc.data().star, doc.data().status);
                    $('#Resturantcard').append(Rescard);
                });
            });

        ///////////////////////End of Append Resturant Card///////////////////////////////////////


    }

    if (page.id === "Food") {

        /////////////////////Append Food Menu Card////////////////////////////////////
        var selectedID = localStorage.getItem("selectedID");
        db.collection("Resturant").doc(selectedID).get().then(function (doc) {
            localStorage.setItem("ResStatus", doc.data().status);
            localStorage.setItem("Resname", doc.data().name);
            localStorage.setItem("ResPic", doc.data().img);
            var Menucard = `<div style="text-align: center">
            <div style="font-size: 18px; margin-bottom:5px; text-align: center;"><b>${doc.data().name}</b></div>
            <img src=${doc.data().img} alt="Onsen UI"style="width: 80%; height :auto; text-align: center">
            </div>
            <div style="color:grey">Distance : ${doc.data().distance} km</div>
            <ons-row style = "margin-top:7px;">
            <ons-col width="50%">`
            for (var i = doc.data().star; i > 0; i--) {
                Menucard += '<i class="fas fa-star star"></i>';
            }
            for (var i = (5 - doc.data().star); i > 0; i--) {
                Menucard += '<i class="fas fa-star grey"></i>';
            }
            Menucard += '</ons-col>';

            if (doc.data().status) Menucard += '<ons-col width="45%"  class="open" ><b>Open</b></ons-col>';
            else Menucard += '<ons-col width="45%"  class="close" ><b>Close</b></ons-col>';


            Menucard += `</ons-col>
                         </ons-row>
                         <hr>
                         <div style="font-size: 16px; margin-top:10px;"><b>Menu</b></div>`;
            // console.log(Menucard);
            $('#foodcard').append(Menucard);
        });
        db.collection("Resturant").doc(selectedID).collection("Food").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                Foodcard = `<ons-row><ons-col width="60%">
             <div style="font-size: 15px; margin-top:10px;">${doc.data().name}</div>
             <div style="font-size: 12px; color:grey ">${doc.data().des}</div>
             </ons-col>
             <ons-col width="20%" style="margin-top:5%">฿${doc.data().price}</ons-col>
             <ons-col width="11%" style="margin-left:8px; margin-top:4%">
             <ons-button onclick="buybtn('${doc.data().name}',${doc.data().price})" class="buyBtn">
             <div class="buyBtntext">+</div></ons-button></ons-col></ons-row>`;
                $('#foodcard').append(Foodcard);
            });
        });

        /////////////////////End of Append Food Menu Card////////////////////////////////////

        $("#orderBtn").click(function () {
            var ResStatus = localStorage.getItem("ResStatus");
            var user = firebase.auth().currentUser;
            if (!user) {
                ons.notification.alert('Please Sign-in! before place order');
            } else if (ResStatus) {
                document.querySelector('#myNavigator').pushPage('content/Order.html');
            } else {
                ons.notification.alert('This Resturant is close');
            }
        });
        if (item.length != 0) {
            $("#orderNoti").empty();
            $("#orderNoti").append(item.length);
        }
    }




    if (page.id === "Recommended") {
        db.collection("Resturant").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().status && doc.data().star >= 4) {
                    var carousel = `<ons-carousel-item modifier="nodivider" class="recomended_item" onclick="setIDtoFoodMenu('${doc.id}')">
            <img  src=${doc.data().img}alt="Onsen UI" class="thumbnail">
            <div class="recomended_item_title" >${doc.data().name}</div>
            </ons-carousel-item>`;
                    $('#carousel').append(carousel);
                }
            });
        });
        db.collection("Category").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var Categorycard = `<ons-col width="50%" style="height: 80%;">
                <ons-card style="width: 90%;height: 90%; text-align: center;" onclick="setSelectedCatagory('${doc.data().name}')">
                    <img  src=${doc.data().img}alt="Onsen UI" style="width: 100px ; height: 75px;">
                    <div>${doc.data().name}</div>
                </ons-card>
            </ons-col>`;
                console.log(doc.id);
                $('#Recomcategorycard').append(Categorycard);
            });
        });
    }


    if (page.id === "Login") {
        $("#signinbtn").click(function () {
            console.log("signinbtn pressed");
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            firebase.auth().signInWithEmailAndPassword(username, password).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
                console.log('errorCode :' + errorCode);
                console.log('errorMessage:' + errorMessage);
                ons.notification.alert('Incorrect Email or Password');
            });
        });

        var provider = new firebase.auth.GoogleAuthProvider();
        $("#googlebtn").click(function () {
            console.log("googlebtn pressed");
            firebase.auth().signInWithRedirect(provider);
            firebase.auth().getRedirectResult().then(function (result) {
                if (result.credential) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    // ...
                }
                // The signed-in user info.
                var user = result.user;
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
                ons.notification.alert('Something went wrong please try agian later');
            });
        });

        $("#regisbtn2").click(function () {
            document.querySelector('#myNavigator').pushPage('content/regis.html');
        });
    }

    if (page.id === "Regis") {
        $("#registerAccountbtn").click(function () {
            console.log('registerAccountbtn pressed');
            var username = document.getElementById('Email').value;
            var password = document.getElementById('password').value;
            var password2 = document.getElementById('password2').value;

            if (!(username && password && password2)) {
                ons.notification.alert('You should fill everything');
            }
            else if (password.length < 6) {
                ons.notification.alert('Your password must contains at least 6 characters');
            }
            else if (password == password2) {
                firebase.auth().createUserWithEmailAndPassword(username, password).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                });
                ons.notification.alert('Successfully Registered!');
            }
            else {
                ons.notification.alert('both password should be the same :-(');
            }

        });
    }

    if (page.id === "Order") {
        var Resname = localStorage.getItem("Resname");
        var ResPic = localStorage.getItem("ResPic");
        $("#Resname").empty();
        $("#Resname").append(Resname);
        $("#ResPic").attr('src', ResPic);
        orderTable();

    }

    if (page.id === "NearBy") {
        db.collection("Resturant").orderBy("distance").get().then((querySnapshot) => {
            $('#Nearbycard').empty();
            querySnapshot.forEach((doc) => {
                /////////////////////Append Resturant Card////////////////////////////////////
                var Rescard = createCard(doc.id, doc.data().img, doc.data().name, doc.data().distance, doc.data().star, doc.data().status);
                $('#Nearbycard').append(Rescard);
            });
        });
    }

    if (page.id === "Address") {
        console.log("Address Page");
        var lat;
        var lng;

        //get Geolocation from Cordova
        var onSuccess = function(position) {
            lat = position.coords.latitude
            lng =position.coords.longitude
            mapboxgl.accessToken = 'pk.eyJ1IjoiYmx1ZWJpcmRseXJhc2UiLCJhIjoiY2sybGFkb3puMDUwdzNkcHIwMzVnenlnNSJ9.zkXOi-GQ7ZHW6bXY-cMYqg';
            var map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [lng, lat], // starting position [lng, lat]
            zoom: 13 // starting zoom
            });

            var marker = new mapboxgl.Marker({
                draggable: true
                })
                .setLngLat([lng, lat])
                .addTo(map);
                onDragEnd();
                function onDragEnd() {
                var lngLat = marker.getLngLat();
                coordinates.style.display = 'block';
                coordinates.innerHTML = 'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
                localStorage.setItem("selectedLat", lngLat.lat);
                localStorage.setItem("selectedLng", lngLat.lng );
                }
                 
                marker.on('dragend', onDragEnd);
        }

        function onError(error) {
            ons.notification.alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }


        
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

    }

});

