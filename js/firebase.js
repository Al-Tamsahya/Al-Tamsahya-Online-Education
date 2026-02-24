(function () {
  // ===================== إعداد Firebase =====================
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

  // تعريف db مرة واحدة فقط على window
  if (!window.db) {
    window.db = firebase.firestore();
  }

  // أدوات Firestore جاهزة مع وظائف مساعدة
  if (!window.firestoreTools) {
    window.firestoreTools = {
      db: window.db,
      collection: (name) => window.db.collection(name),
      doc: (...segments) => window.db.doc(segments.join("/")),
      getDocs: async (refOrQuery) => refOrQuery.get(),
      addDoc: async (colRef, data) => colRef.add(data),
      deleteDoc: async (docRef) => docRef.delete(),
      updateDoc: async (docRef, data) => docRef.update(data),
      setDoc: async (docRef, data) => docRef.set(data),
      query: (colRef, ...conds) => conds.reduce((q, c) => q.where(...c), colRef),
      where: (field, op, value) => [field, op, value],
    };
  }

  // دالة مساعدة للحصول على دور المستخدم بأمان
  window.getUserRole = async function(email) {
    try {
      const adminDoc = await window.db.collection("admins").doc(email).get();
      return adminDoc.exists ? adminDoc.data()?.role || "ADMIN" : "STUDENT";
    } catch (err) {
      console.error("خطأ في جلب الدور:", err);
      return "STUDENT";
    }
  };

  console.log("🔥 Firebase Initialized Successfully (compat mode)");
})();
