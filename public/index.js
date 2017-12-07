// getting the filter update button here
var button = document.getElementById('filter-update-button');
var textInput = document.getElementById('filter-text');
// Adding an event listener to filter update button
if(button) {
  button.addEventListener('click',function() {
    // filter through each post
    document.querySelectorAll('.post').forEach(function(post) {
      // get value from text search
      var textValue = textInput.value;
      var postTitle = post.querySelector('.post-title').innerText;
      // if value doesn't show up in node, blow it away
      if (!postTitle.toLowerCase().includes(textValue.toLowerCase()))  {
        post.remove();
      }
    });
  });
}
// get the post-something-button/modal & modal-backdrop
var postSomethingButton = document.getElementById('post-something-button');
var postSomethingModal = document.getElementById('post-something-modal');
var modalBackDrop = document.getElementById('modal-backdrop');

// accessing modal close and cancel button/'x'
var closeModalButton = document.getElementById('modal-close');
var cancelPostButtonInModal = document.getElementById('modal-cancel');

// getting elements needed to clone the node
var createPostButton = document.getElementById('modal-accept');
var deletePostButton = document.getElementById('delete-button');
var node = document.querySelector('.post');
var posts = document.getElementById('posts');

/*--------------------functions to show,hide & clear modal--------------------------*/
function clearModalInput() {
  var modalInputElements = document.querySelectorAll('#post-something-modal input')
  for (var i = 0; i < modalInputElements.length; i++) {
    modalInputElements[i].value = "";
  }
}

function showModal() {
  postSomethingModal.classList.remove('hidden');
  modalBackDrop.classList.remove('hidden');
}

function hideModal() {
  postSomethingModal.classList.add('hidden');
  modalBackDrop.classList.add('hidden');
  clearModalInput();
}

// event listener to button, access to modal/backdrop, remove hidden class
if(postSomethingButton){
  postSomethingButton.addEventListener('click', function () {
    showModal();
  });

  // event listener to modal close button and cancel button, adds hidden class
  closeModalButton.addEventListener('click', function() {
    hideModal();
  });

  cancelPostButtonInModal.addEventListener('click', function() {
    hideModal();
  });
}
// create a new post
function createPost(photoURL, comment, description) {

  var postTemplateArgs = {
    description: description,
    photoURL: photoURL,
    comment: comment,
  };

  var postHTML = Handlebars.templates.post(postTemplateArgs);

  return postHTML;
}

// event listener to post button -- create postObject, check if fiels are blank
if(createPostButton) {
  createPostButton.addEventListener('click', function() {

    var description = document.getElementById('post-text-input').value.trim();
    var photoURL = document.getElementById('post-photo-input').value.trim();
    var comment = document.getElementById('post-comment-input').value.trim();

    var postObject = {
      description: description,
      photoURL: photoURL,
      comment: comment,
    };
    //debugger;

    if (!description || !photoURL || !comment) {
      alert("You must fill in all of the fields!");
    } else {
      // make XMLHttp request
      var postRequest = new XMLHttpRequest();
      var postURL = "/addPost";
      postRequest.open('POST', postURL);
      // set request body, postRequest and setRequestHeader
      var requestBody = JSON.stringify(postObject);
      postRequest.setRequestHeader('Content-Type', 'application/json');

      postRequest.addEventListener('load', function (event) {
        if (event.target.status !== 200) {
          alert("Error storing post in database:\n\n\n" + event.target.response);
        } else {
          var newPost = createPost(photoURL, comment, description);
          var postContainer = document.querySelector('#posts');
          postContainer.insertAdjacentHTML('beforeend', newPost);
          // insert at the bottom of page
        }
      });

      postRequest.send(requestBody);

      hideModal();
    }

  });
}

// delete the post from mongoDb using similar method from above
if(deletePostButton) {
  deletePostButton.addEventListener('click', function () {

    var deleteRequest = new XMLHttpRequest();
    var deleteURL = "/delete" + window.location.pathname;
    deleteRequest.open('DELETE', deleteURL);

    //var requestBody = JSON.stringify('bla bla bla string');
    deleteRequest.setRequestHeader('Content-Type', 'application/json');
    deleteRequest.send();

    deleteRequest.addEventListener('load', function (event) {
        window.location = '/';
    });

  });
}
