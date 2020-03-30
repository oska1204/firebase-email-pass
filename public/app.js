document.addEventListener('DOMContentLoaded', e => {
    // Get elements
    const btnLoginMenu = document.getElementById('btnLoginMenu')
    const btnAddLinkMenu = document.getElementById('btnAddLinkMenu')
    const txtEmail = document.getElementById('txtEmail')
    const txtPassword = document.getElementById('txtPassword')
    const btnLogin = document.getElementById('btnLogin')
    const btnSignUp = document.getElementById('btnSignUp')
    const btnLogout = document.getElementById('btnLogout')
    const btnAddLink = document.getElementById('btnAddLink')
    // Add login event
    btnLogin.addEventListener('click', e => {
        // Get email and pass
        const email = txtEmail.value
        const pass = txtPassword.value
        const auth = firebase.auth()
        // Sign in
        const promise = auth.signInWithEmailAndPassword(email, pass)
        promise
            .catch(alert)
    })
    // Create User event
    btnSignUp.addEventListener('click', e => {
        // Get email and pass
        // TODO: CHECK 4 REAL EMAILZ
        const email = txtEmail.value
        const pass = txtPassword.value
        const auth = firebase.auth()
        // Sign in
        const promise = auth.createUserWithEmailAndPassword(email, pass)
        promise
            .catch(alert)
    })
    btnLogout.addEventListener('click', e => {
        firebase.auth().signOut()
    })
    // Add a realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser)
            btnAddLinkMenu.classList.remove('hide')
            btnLogout.classList.remove('hide')
            document.querySelector('.login').classList.add('hide')
        } else {
            console.log('not logged in')
            btnAddLinkMenu.classList.add('hide')
            btnLogout.classList.add('hide')
            document.querySelector('.login').classList.add('hide')
        }
    })

    const ulList = document.getElementById('list')
    const dbRefObject = firebase.database().ref().child('lists')
    console.log(dbRefObject)
    const dbRefList = dbRefObject.child('list')
    dbRefList.on('child_added', snap => {
        const li = document.createElement('li')
        li.innerHTML = format(snap.val())
        li.id = snap.key
        ulList.appendChild(li)
    })
    dbRefList.on('child_changed', snap => {
        const liChanged = document.getElementById(snap.key)
        liChanged.innerHTML = format(snap.val())
    })
    dbRefList.on('child_removed', snap => {
        const liToRemove = document.getElementById(snap.key)
        liToRemove.parentNode.removeChild(liToRemove)
    })
    function format(link) {
        return `<a href="${link}" target="_blank">${link}</a>`
    }
})