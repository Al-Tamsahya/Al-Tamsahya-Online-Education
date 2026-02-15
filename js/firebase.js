<<<<<<< HEAD
// js/firebase.js
(function () {
    const firebaseConfig = {
        apiKey: "AIzaSyDRAwI-FZxQyD_KRPcdtLhAVbjgwLSZ9xU",
        authDomain: "ai-tamsahya-online-education.firebaseapp.com",
        projectId: "ai-tamsahya-online-education",
        storageBucket: "ai-tamsahya-online-education.firebasestorage.app",
        messagingSenderId: "853000263503",
        appId: "1:853000263503:web:5c6406ac42c8dcffbb573a"
    };

    // منع التهيئة مرتين
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.firestore();

    // أدوات compat جاهزة
    window.firestoreTools = {
        db,

        // collection("students")
        collection: (name) => db.collection(name),

        // doc("students", id)  أو doc("students/id")
        doc: (...segments) => {
            const path = segments.join("/");
            return db.doc(path);
        },

        // getDocs(collection("students"))  أو getDocs(query)
        getDocs: async (refOrQuery) => refOrQuery.get(),

        // addDoc(collection("students"), data)
        addDoc: async (colRef, data) => colRef.add(data),

        // deleteDoc(docRef)
        deleteDoc: async (docRef) => docRef.delete(),

        // updateDoc(docRef, data)
        updateDoc: async (docRef, data) => docRef.update(data),

        // setDoc(docRef, data)
        setDoc: async (docRef, data) => docRef.set(data),

        // query + where (compat)
        query: (colRef, ...conds) => conds.reduce((q, c) => q.where(...c), colRef),
        where: (field, op, value) => [field, op, value],
    };

    console.log("🔥 Firebase Initialized Successfully (compat mode)");
})();
=======
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
>>>>>>> 86b0063a6a7a65235492840f579e1aac1f4798d4
