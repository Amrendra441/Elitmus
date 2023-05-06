// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBu8SVdhNUfc5YF0w9vl1BprRatryYq1UI",
    authDomain: "puzzle-game-8bb1b.firebaseapp.com",
    projectId: "puzzle-game-8bb1b",
    storageBucket: "puzzle-game-8bb1b.appspot.com",
    messagingSenderId: "792145803409",
    appId: "1:792145803409:web:84b14e38b6f7b999046730",
    measurementId: "G-GB9VQZV1FD"
    
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  
  // Get a reference to the authentication service
  var auth = firebase.auth();
  
  // Get a reference to the Firestore database service
  var db = firebase.firestore();
  
  // Get a reference to the signup form
  var signupForm = $('#signupForm');
  
  // Get a reference to the login form
  var loginForm = $('#loginForm');
  
  // Get a reference to the logout button
  var logoutBtn = $('#logoutBtn');
  
  // Get a reference to the puzzle section
  var puzzleSection = $('#puzzleSection');
  
  // Get a reference to the clue element
  var clue = $('#clue');
  
  // Get a reference to the answer input
  var answerInput = $('#answer');
  
  // Get a reference to the submit button
  var submitBtn = $('#submitBtn');
  
  // Set up event listener for signup form submission
  signupForm.on( 'submit', function(event) {

  
    event.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();
    
    // Check if the email is valid
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address');
      return;
    } else {
      // Create user account using Firebase Authentication
      auth.createUserWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        console.log('User signed up:', userCredential.user);
        alert('Signup successful');
        // Create user document in Firestore
        db.collection('users').doc(userCredential.user.uid).set({
          email: email
        })
          .then(function() {
            console.log('User document created');
          })
          .catch(function(error) {
            console.error('Error creating user document:', error);
          });
      })
      .catch(function(error) {
        console.error('Error signing up:', error);
        alert('Error signing up: ' + error.message);
      });
  }
});

// Validate email format using Firebase
function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

  
  // Set up event listener for login form submission
  loginForm.on('submit', function(event) {
    event.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();
    auth.signInWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        console.log('User logged in:', userCredential.user);
        alert('Login successful');
        showPuzzleSection();
      })
      .catch(function(error) {
        console.error('Error logging in:', error);
        alert('Error logging in: ' + error.message);
      });
  });
  // Fetch user data from Firestore using UID
function getUserData(uid) {
    return db.collection('users').doc(uid).get()
      .then(function(doc) {
        if (doc.exists) {
          return doc.data();
        } else {
          console.error('User document not found');
          return null;
        }
      })
      .catch(function(error) {
        console.error('Error fetching user document:', error);
        throw error;
      });
  }
  
  
  // Set up event listener for logout button click
  logoutBtn.on('click', function(event) {
    auth.signOut()
      .then(function() {
        console.log('User logged out');
        alert('Logout successful');
        showLoginForm();
      })
      .catch(function(error) {
        console.error('Error logging out:', error);
        alert('Error logging out: ' + error.message);
      });
  });
  
  // Set up event listener for submit button click
  submitBtn.on('click', function(event) {
    event.preventDefault();
    var answer = answerInput.val().trim().toLowerCase();
    if (answer === currentQuestion.answer) {
      alert('Correct answer! You have unlocked the next clue.');
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        showClue();
      } else {
        alert('Congratulations! You have solved the puzzle.');
        resetPuzzle();
      }
    } else {
      alert('Incorrect answer. Please try again.');
    }
    answerInput.val('');
  });
  
  // Array of questions with clues and answers
  var questions = [
    {
      clue: 'I am always hungry, I must always be fed. The finger I touch, Will soon turn red. What am I?',
      answer: 'fire'
    },
    {
      clue: 'What has a head and a tail but no body?',
      answer: 'coin'
    }]