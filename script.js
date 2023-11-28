const userCookieDetail = document.cookie.split("=");
const crypt = {
  secret: "CIPHERKEY",
  encrypt: (clear) => {
    const cipher = CryptoJS.AES.encrypt(clear, crypt.secret);
    return cipher.toString();
  },
  decrypt: (cipher) => {
    const decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
    return decipher.toString(CryptoJS.enc.Utf8);
  },
};

if (userCookieDetail.length) {
  const userDetails = JSON.parse(localStorage.getItem("userDetails")) || [];
  function signUpForm() {
    document.getElementById("login").style.display = "none";
    document.getElementById("signUp").style.display = "block";
  }

  function signInForm() {
    document.getElementById("signUp").style.display = "none";
    document.getElementById("login").style.display = "block";
  }

  function validateForm(event) {
    event.preventDefault();
    const userName = document.getElementById("userName").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const password = document.getElementById("password").value;
    const encryptedPassword = crypt.encrypt(password);

    if (!userNameValid(userName)) {
      alert(
        "Name should contain at least 3 letters and numbers are not allowed"
      );
      return false;
    }

    if (!emailValid(email) || !emailNotExist(email)) {
      alert("invalid email");
      return false;
    }

    if (!passwordValid(password)) {
      alert(
        "password should contain at lest 8characters including one uppercase,number and special character"
      );
      return false;
    }

    if (!phoneNumberValid(phoneNumber) || !phoneNumNotExist(phoneNumber)) {
      alert("phone number should contain 10 numbers");
      return false;
    }

    addDetails(userName, email, phoneNumber, encryptedPassword);
    document.getElementById("signUp").reset();
    return true;
  }

  function validateDetails(event) {
    event.preventDefault();
    const loginEmail = document.getElementById("loginEmail").value;
    const loginPassword = document.getElementById("loginPassword").value;
    const userExist = userDetails.filter((obj) => obj.userEmail == loginEmail);

    if (userExist.length) {
      const decryptPassword = crypt.decrypt(userExist[0].userPassword);
      if (decryptPassword === loginPassword) {
        const user = userExist[0].userName;
        setCookie("userName", user, 1);
        document.getElementById("login").reset();
        window.location.href = "/login/dashboard.html";
      } else {
        alert("password is incorrect");
      }
    } else {
      alert("user not exist");
    }
  }

  function userNameValid(userName) {
    const userNamePattern = /^[a-zA-Z ]{3,30}$/;
    return userNamePattern.test(userName);
  }

  function emailValid(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  function passwordValid(password) {
    return (
      /[!@#$%^&*()_+{}\[\]:;<>,.?~\-]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password)
    );
  }

  function phoneNumberValid(phoneNumber) {
    const numberPattern = /^\d{10}$/;
    return numberPattern.test(phoneNumber);
  }

  function emailNotExist(email) {
    const userExist = userDetails.findIndex((obj) => obj.userEmail === email);

    if (userExist !== -1) {
      alert("email already exist");
      return false;
    } else {
      return true;
    }
  }

  function phoneNumNotExist(phoneNumber) {
    const userExist = userDetails.findIndex(
      (obj) => obj.userNumber === phoneNumber
    );
    if (userExist !== -1) {
      alert("phoneNumber already exist");
      return false;
    } else {
      return true;
    }
  }

  function setCookie(name, userName, daysLive) {
    const today = new Date();
    today.setTime(today.getTime() + daysLive * 24 * 60 * 60 * 1000);
    const expiryDate = "expires=" + today.toUTCString();
    document.cookie = `${name}=${userName};${expiryDate}; path/`;
  }

  function addDetails(userName, email, phoneNumber, password) {
    const id = userDetails.length + 1;
    const newUser = {
      id,
      userName: userName,
      userEmail: email,
      userNumber: phoneNumber,
      userPassword: password,
    };

    userDetails.push(newUser);
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
    signInForm();
  }
} else {
  window.location.href = "/login/dashboard.html";
}
