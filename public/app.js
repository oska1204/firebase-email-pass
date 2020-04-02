document.addEventListener('DOMContentLoaded', e => {
    // Get elements
    const divContainer = document.querySelector('.container')
    const btnLoginMenu = document.getElementById('btnLoginMenu')
    const btnAddLinkMenu = document.getElementById('btnAddLinkMenu')
    const txtEmail = document.getElementById('txtEmail')
    const txtPassword = document.getElementById('txtPassword')
    const btnLogin = document.getElementById('btnLogin')
    const btnSignUp = document.getElementById('btnSignUp')
    const btnLogout = document.getElementById('btnLogout')
    const btnAddLink = document.getElementById('btnAddLink')
    const txtLink = document.getElementById('txtLink')
    const selectLists = document.getElementById('selectLists')
    const ulLists = document.getElementById('ulLists')
    const divAddLink = document.querySelector('.add-link')
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
            divContainer.classList.add('loggedIn')
            btnAddLinkMenu.classList.remove('hide')
            btnLogout.classList.remove('hide')
            document.querySelector('.login').classList.add('hide')
        } else {
            console.log('not logged in')
            divContainer.classList.remove('loggedIn')
            btnAddLinkMenu.classList.add('hide')
            btnLogout.classList.add('hide')
            document.querySelector('.login').classList.add('hide')
        }
    })

    const db = firebase.firestore()

    db.collection('lists').get()
        .then(collection => {
            collection.docs.forEach(doc => {
                newList(doc.id)
            })
        })

    function newList(listName) {
        const optionSelect = document.createElement('option')
        optionSelect.value = listName
        optionSelect.innerText = listName
        selectLists.appendChild(optionSelect)

        const listContainer = document.createElement('div')
        listContainer.classList.add('list-container')

        const h3Name = document.createElement('h3')
        h3Name.innerText = listName
        listContainer.appendChild(h3Name)

        const ulList = document.createElement('ul')
        ulList.setAttribute('data-list-name', listName)
        const list = db.collection('lists').doc(listName)
        list.onSnapshot(doc => {
            ulList.innerHTML = ''
            const data = doc.data()
            for (const link in data) {
                const li = document.createElement('li')
                li.setAttribute('data-list-item', link)
                li.innerHTML = format(data[link])
                li.insertAdjacentHTML('beforeend', '<button class="btn btn-secondary delete">Delete</button>')
                li.lastChild.addEventListener('click', removeLink)
                ulList.appendChild(li)
            }
        })
        listContainer.appendChild(ulList)
        ulLists.appendChild(listContainer)
    }
    function format(link) {
        return `<a href="${link}" target="_blank">${link}</a>`
    }
    btnAddLink.addEventListener('click', addLink)
    txtLink.addEventListener('keydown', addLink)
    function addLink(e) {
        if (e.type === 'keydown') if (e.key !== 'Enter') return
        if (!txtLink.value || !selectLists.value) {
            alert('Required fields')
            return
        }
        divAddLink.classList.add('hide')
        const list = db.collection('lists').doc(selectLists.value)
        let txtLinkValue = txtLink.value
        if (!txtLinkValue.match(/^(https?:\/\/)/)) txtLinkValue = 'https://' + txtLinkValue
        const obj = {}
        obj[txtLinkValue.replace(/[~*/[\]\.]/g, '|')] = txtLinkValue
        list.update(obj)
            .catch(alert)
    }
    function removeLink(e) {
        const answer = window.prompt('Do you want to delete the link? \nType "delete" to confirm', '')
        if (answer !== 'delete') return
        const list = db.collection('lists').doc(e.target.parentNode.parentNode.dataset.listName)
        const obj = {}
        obj[e.target.parentNode.dataset.listItem] = firebase.firestore.FieldValue.delete()
        list.update(obj)
            .catch(alert)
    }
})