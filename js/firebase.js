// ===============================
// Firebase Configuration
// ===============================

var firebaseConfig = {
    apiKey: "AIzaSyDRAwI-FZxQyD_KRPcdtLhAVbjgwLSZ9xU",
    authDomain: "ai-tamsahya-online-education.firebaseapp.com",
    projectId: "ai-tamsahya-online-education",
    storageBucket: "ai-tamsahya-online-education.firebasestorage.app",
    messagingSenderId: "853000263503",
    appId: "1:853000263503:web:5c6406ac42c8dcffbb573a"
};

// ===============================
// Initialize Firebase
// ===============================

firebase.initializeApp(firebaseConfig);

// Initialize Firestore
var db = firebase.firestore();

console.log("🔥 Firebase initialized successfully");

// ===============================
// Firestore Tools (متوافق مع بقية الكود)
// ===============================

var firestoreTools = {

    db: db, // نضيف db لكي تعمل firestoreTools.db.collection(...)

    collection: function (name) {
        return db.collection(name);
    },

    addDoc: function (collectionRef, data) {
        return collectionRef.add(data);
    },

    addDocument: function (collectionName, data) {
        return db.collection(collectionName).add(data);
    },

    getCollection: function (collectionName) {
        return db.collection(collectionName).get();
    },

    deleteDocument: function (collectionName, docId) {
        return db.collection(collectionName).doc(docId).delete();
    }

};

// ===============================
// Admin Section Function
// ===============================

function showAdminSection() {
    var adminSection = document.getElementById("adminSection");
    if (adminSection) {
        adminSection.style.display = "block";
    }
}
