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

    const ulLists = document.getElementById('ulLists')
    
    const db = firebase.firestore()

    const listNames = ['list1','list2'] // TODO: Get Array from server

    listNames.forEach(listName => {
        newList(listName)
    })

    function newList(listName) {
        const listContainer = document.createElement('div')

        listContainer.classList.add('list-container')

        const h3Name = document.createElement('h3')

        h3Name.innerText = listName

        listContainer.appendChild(h3Name)

        const ulList = document.createElement('ul')

        const list = db.collection('lists').doc(listName)
    
        list.onSnapshot(doc => {
            ulList.innerHTML = ''
            const data = doc.data()
            for (const link in data) {
                const li = document.createElement('li')
                li.innerHTML = format(data[link])
                ulList.appendChild(li)
            }
        })

        listContainer.appendChild(ulList)

        ulLists.appendChild(listContainer)
    }
    
    function format(link) {
        return `<a href="${link}" target="_blank">${link}</a>`
    }
})