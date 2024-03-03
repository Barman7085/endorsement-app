import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  projectId: "endorsement-page-38b7b",
  databaseURL: "https://endorsement-page-38b7b-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const endorsementListInDB = ref(database, "endorsementLists");

const endorsementInputFieldEl = document.getElementById("endorsement-section");
const publishEndorsementEl = document.getElementById("publish-endorsement");
const endorsedListsShow = document.getElementById("endorsed-list");
const fromEndorseElementEl = document.getElementById("from");
const toEndorseElementEl = document.getElementById("to");

publishEndorsementEl.addEventListener('click', () => {
    let endorsedContents = endorsementInputFieldEl.value;
    let endorsementTo = toEndorseElementEl.value;
    let endorsementFrom = fromEndorseElementEl.value;
    
    push(endorsementListInDB, {
        to: endorsementTo,
        from: endorsementFrom,
        content: endorsedContents
    });
    
    clearInputField();
});

onValue(endorsementListInDB, (snapshot) => {
    if(snapshot.exists()) {
        let commentObject = snapshot.val();
        clearEndorsedComment();
        
        for (const commentID in commentObject) {
            let { to, from, content } = commentObject[commentID];
            appendEndorsedComments(commentID, content, to, from);
        }   
    } else {
        endorsedListsShow.innerHTML = `<label>No endorsements yet...</label>`;
    }
});

function clearEndorsedComment() {
    endorsedListsShow.innerHTML = "";
}

function clearInputField() {
    endorsementInputFieldEl.value = "";
    toEndorseElementEl.value = "";
    fromEndorseElementEl.value = "";
}

function appendEndorsedComments(commentID, commentValue, endorsementToValue, endorsementFromValue) {
    let newElement = document.createElement("li");
    
    newElement.innerHTML = `<b>To:</b> <b>${endorsementToValue}</b><br>${commentValue}<br><b>From:</b> <b>${endorsementFromValue}</b>`;
    
    newElement.addEventListener('click', () => {
        let locationOfEndorsements = ref(database, `endorsementLists/${commentID}`);
        let locationToEndorse = ref(database, `to`)
        let locationFromEndorse = ref(database, `from`)
        remove(locationOfEndorsements);
        remove(locationToEndorse)
        remove(locationFromEndorse)
    });
    
    endorsedListsShow.append(newElement);
}
