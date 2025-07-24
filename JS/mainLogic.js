
const baseUrl = "https://tarmeezAcademy.com/api/v1"

// ======= POST REQUESTS ======////
function createNewPostClicked() {
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == ""
    


    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value
    const image = document.getElementById("post-image-input").files[0]
    const token = localStorage.getItem("token")

    let formData = new FormData()
    formData.append("body", body)
    formData.append("title", title)
    formData.append("image", image)


    let url = ``        
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }

    if(isCreate)
    {
        url = `${baseUrl}/posts`            

    }else {

        formData.append("_method", "put")
        url = `${baseUrl}/posts/${postId}`
    }

    toggleLoader(true)
    axios.post(url, formData, {
        headers: headers
    })
    .then((response) => {
        const modal = document.getElementById("create-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("New Post Has Been Created", "success")
        getPosts()

    })
    .catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    })
    .finally(() => {
        toggleLoader(false)
    })

    
}

function editPostBtnClicked(postObject)
{
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)
    
    document.getElementById("post-modal-submit-btn").innerHTML = "Update"
    document.getElementById("post-id-input").value = post.id
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("post-title-input").value = post.title
    document.getElementById("post-body-input").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle()
}

function deletePostBtnClicked(postObject)
{
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)

    document.getElementById("delete-post-id-input").value = post.id
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
    postModal.toggle()
}

function confirmPostDelete() {
    const token = localStorage.getItem("token")
    const postId = document.getElementById("delete-post-id-input").value
    const url = `${baseUrl}/posts/${postId}`
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }


    axios.delete(url, {
        headers: headers
    })
    .then((response) => {
        const modal = document.getElementById("delete-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("The Post Has Been Deleted Successfully", "success")
        getPosts()

    }).catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    })
}


function profileClicked() {
    const user = getCurrentUser();
    
    if (user && user.id) {
        window.location = `profile.html?userid=${user.id}`;
    } else {
        showAlert("Please login first", "danger");
        // window.location = 'login.html';
    }
}
function setupUI()
{
    const token = localStorage.getItem("token")

    const loginDiv = document.getElementById("logged-in-div")
    const logoutDiv = document.getElementById("logout-div")

    // add btn
    const addBtn = document.getElementById("add-btn")

    if(token == null) // user is guest (not logged in)
    {
        if(addBtn != null)
        {
            addBtn.style.setProperty("display", "none", "important")
        }
        
        loginDiv.style.setProperty("display", "flex", "important")
        logoutDiv.style.setProperty("display", "none", "important")
    }else { // for logged in user

        if(addBtn != null)
        {
            addBtn.style.setProperty("display", "block", "important")
        }
        
        loginDiv.style.setProperty("display", "none", "important")
        logoutDiv.style.setProperty("display", "flex", "important")

        const user = getCurrentUser()
        document.getElementById("nav-username").innerHTML = user.username
        document.getElementById("nav-user-image").src = user.profile_image
    }
}


// ======= AUTH FUNCTIONS ==========
function loginBtnClicked()
{
    const username = document.getElementById("username-input").value
    const password = document.getElementById("password-input").value

    const params = {
        "username": username,
        "password" : password
    }

    const url = `${baseUrl}/login`
    toggleLoader(true)
    axios.post(url, params)
    .then((response) => {        
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        const modal = document.getElementById("login-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        
        showAlert("Logged in successfully", "success")
        setupUI()

    }).catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    }).finally(()=> {
        toggleLoader(false)
    })
}

function toggleLoader(show = true)
{
    if(show)
    {
        document.getElementById("loader").style.visibility = 'visible'
    }else {
        document.getElementById("loader").style.visibility = 'hidden'
    }
}



function registerBtnClicked()
{
    const name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value
    const image = document.getElementById("register-image-input").files[0]
    

    let formData = new FormData()
    formData.append("name", name)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("image", image)

    
    const headers = {
        "Content-Type": "multipart/form-data",
    }

    const url = `${baseUrl}/register`

    toggleLoader(true)
    axios.post(url, formData, {
        headers: headers
    })
    .then((response) => {
        console.log(response.data)

        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        const modal = document.getElementById("register-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        
        showAlert("New User Registered Successfully", "success")
        setupUI()

    }).catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    })
    .finally(() => {
        toggleLoader(false)
    })
}


function logout()
{
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("Logged out successfully")
    setupUI()
}

// ..,,
// function showAlert(customMessage, type="success")
// {
//     const alertPlaceholder = document.getElementById('success-alert')

//     const alert = (message, type) => {
//         const wrapper = document.createElement('div')
//         wrapper.innerHTML = [
//             `<div class="alert alert-${type} alert-dismissible" role="alert">`,
//             `   <div>${message}</div>`,
//             '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
//             '</div>'
//         ].join('')

//         alertPlaceholder.append(wrapper)
//     }

//     alert(customMessage, type) 
    
//     // todo: hide the alert
//     setTimeout(() => {
//         const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
        
//         document.getElementById("success-alert").hide();

//         const alert = document.getElementById("success-alert")
//         const modalAlert = bootstrap.Alert.getInstance(alert)
//         modalAlert.hide()
//     }, 2000);
    
    
// }
// ...
function showAlert(customMessage , type="success") {
    const alertPlaceholder = document.getElementById('success-alert');
    if (!alertPlaceholder) {
        console.warn("SuccessAlert element not found!");
        return;
    }
    const alert = (message, type) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close " data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');
        alertPlaceholder.append(wrapper);
    }
    alert(customMessage, type);
    // Todo: show alert
    setTimeout(() => {
        // إغلاق التنبيه بعد ثانيتين
        alertPlaceholder.innerHTML = "";
    }, 2000);
}


function getCurrentUser()
{
    let user = null 
    const storageUser = localStorage.getItem("user")

    if(storageUser != null)
    {
        user = JSON.parse(storageUser)
    }
    
    return user
}
// .
  setupUI()

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('postId');

    getPost()

    function getPost() {
        axios.get(`${baseUrl}/posts/${id}`)
        .then((response) => {
            const data = response.data
            const post = data.data
            const comments = post.comments
            console.log(comments)
            fillPost(post)
            fillComments(comments)
        })
    }
    

    function fillPost(post)
    {
        document.getElementById("post").innerHTML = ""
        const author = post.author
        const content = 
        `
        <div class="card shadow-sm mb-5">
            <div class="card-header">                      
                <img src="${author.profile_image}" class="img-thumbnail rounded-5" style="width: 40px; height: 40px">
                <b>@${author.username}</b>
            </div>

            
            <div class="card-body" onclick="postClicked(1)">
                <img src="${post.image}" class="card-img-top">
                <h6 style="color: rgb(171, 171, 171)">
                    2 min ago
                </h6>

                <h5 class="card-title">
                    
                </h5>

                <p class="card-text">
                    ${post.body}
                </p>

                <hr>

                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                    </svg>
                    <span>
                        (3) Comments
                    </span>

                </div>

                             
            </div>

            <hr>   

            <!-- COMMENTS -->
                <div id="comments">
                    
                    <!-- COMMENT -->
                    <div class="p-3 rounded-3" style="background: rgb(241, 246, 255)">
                        <div>
                            <img src="./profile-pics/1.png" class="img-thumbnail rounded-5" style="width: 40px; height: 40px">
                            <b>@Ahmed</b>
                        </div>

                        <div  >
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam numquam odio totam, aspernatur neque nisi sit assumenda a iure harum! Reprehenderit accusantium animi quam repellat saepe modi! Ullam, porro eaque.
                        </div>
                    </div>
                    <!--// COMMENT //-->

                    <!-- COMMENT -->
                    <div class="p-3 rounded-3 mt-3" style="background: rgb(241, 246, 255)">
                        <div>
                            <img src="./profile-pics/1.png" class="img-thumbnail rounded-5" style="width: 40px; height: 40px">
                            <b>@Ahmed</b>
                        </div>

                        <div  >
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam numquam odio totam, aspernatur neque nisi sit assumenda a iure harum! Reprehenderit accusantium animi quam repellat saepe modi! Ullam, porro eaque.
                        </div>
                    </div>
                    <!--// COMMENT //-->
                </div>
                <!--// COMMENTS //-->
                
                <div class="input-group mb-3" id="add-comment-div">                            
                    <input id="comment-input" type="text" placeholder="add your comment.." class="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1">
                    <button class="btn btn-outline-primary" type="button" id="button-addon1" onclick="createCommentClicked()">send</button>
                </div>
        </div>   
        `
        document.getElementById("post").innerHTML = content
        document.getElementById("username-span").innerHTML = post.author.username
    }

    function fillComments(comments)
    {
        const commentsDiv = document.getElementById("comments") 
        commentsDiv.innerHTML = ""
        comments.forEach(comment => {
            console.log(comment)                       
            const content = 
            `
                <!-- COMMENT -->
                <div class="p-3 rounded-3" style="background: rgb(241, 246, 255)">
                    <div>
                        <img src="${comment.author.profile_image}" class="img-thumbnail rounded-5" style="width: 40px; height: 40px">
                        <b>${comment.author.username}</b>
                    </div>

                    <div>
                        ${comment.body}
                    </div>
                </div>
                <!--// COMMENT //-->
            `
            commentsDiv.innerHTML += content
        });
    }

    function createCommentClicked()
    {
        
        let body = document.getElementById("comment-input").value        
        let params = {"body" : body}
        let token = localStorage.getItem("token")

        axios.post(`${baseUrl}/posts/${id}/comments`, params, {
            headers: {
                "Content-Type": "multipart/form-data",
                "authorization": `Bearer ${token}`
            }
        })
        .then((response) => {            
            getPost()
            showAlert("The comment has been added successfully", "success")
        }).catch((error) => {        
            showAlert(error.response.data.message, "danger")
        })
    }