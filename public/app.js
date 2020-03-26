document.addEventListener('DOMContentLoaded', e => {
    // Get elements
    const txtEmail = document.getElementById('txtEmail')
    const txtPassword = document.getElementById('txtPassword')
    const btnLogin = document.getElementById('btnLogin')
    const btnSignUp = document.getElementById('btnSignUp')
    const btnLogout = document.getElementById('btnLogout')
    // Add login event
    btnLogin.addEventListener('click', e => {
        // Get email and pass
        const email = txtEmail.value
        const pass = txtPassword.value
        const auth = firebase.auth()
        // Sign in
        const promise = auth.signInWithEmailAndPassword(email, pass)
        promise.catch(console.log)
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
            .catch(console.log)
    })
    btnLogout.addEventListener('click', e => {
        firebase.auth().signOut()
    })
    // Add a realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser)
            btnLogout.classList.remove('hide')
        } else {
            console.log('not logged in')
            btnLogout.classList.add('hide')
        }
    })
})