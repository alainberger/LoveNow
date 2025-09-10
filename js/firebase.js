import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, onAuthStateChanged as onAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as fbSignOut, sendEmailVerification as fbSendEmailVerification, updateProfile as fbUpdateProfile } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, collection, query, where, orderBy, limit, onSnapshot, startAfter, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

const cfg = {
  apiKey:        window.env?.FIREBASE_API_KEY        || window.APP_CONFIG?.firebase?.apiKey,
  authDomain:    window.env?.FIREBASE_AUTH_DOMAIN    || window.APP_CONFIG?.firebase?.authDomain,
  projectId:     window.env?.FIREBASE_PROJECT_ID     || window.APP_CONFIG?.firebase?.projectId,
  appId:         window.env?.FIREBASE_APP_ID         || window.APP_CONFIG?.firebase?.appId,
  storageBucket: window.env?.FIREBASE_STORAGE_BUCKET || window.APP_CONFIG?.firebase?.storageBucket,
};

const app = initializeApp(cfg);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const sendEmailVerification = fbSendEmailVerification;

export async function signUp(email, pass, profile){
  const { user } = await createUserWithEmailAndPassword(auth, email, pass);
  await fbSendEmailVerification(user);
  if(profile?.displayName){
    try{ await fbUpdateProfile(user, { displayName: profile.displayName }); }catch(e){}
  }
  const ref = doc(db, 'users', user.uid);
  await setDoc(ref, {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: profile?.displayName || '',
    city: profile?.city || '',
    age: Number(profile?.age) || null,
    gender: profile?.gender || '',
    bio: profile?.bio || '',
    photoURL: profile?.photoURL || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge:true });
  return user;
}

export async function signIn(email, pass){
  const { user } = await signInWithEmailAndPassword(auth, email, pass);
  return user;
}

export function onAuthStateChanged(cb){ return onAuth(auth, cb); }

export async function signOut(){ return fbSignOut(auth); }

export async function updateProfileDoc(partial){
  const u = auth.currentUser;
  if(!u) throw new Error('not-authenticated');
  const ref = doc(db, 'users', u.uid);
  await setDoc(ref, { ...partial, updatedAt: serverTimestamp() }, { merge:true });
}

export async function getProfile(uid){
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export function listenProfiles({filters={}, pageSize=12, onNext}){
  const col = collection(db, 'users');
  const clauses = [];
  if(filters.gender) clauses.push(where('gender','==',filters.gender));
  if(filters.city)   clauses.push(where('city','==',filters.city));
  let q = query(col, ...clauses, orderBy('createdAt','desc'), limit(pageSize));
  const unsub = onSnapshot(q, snap => {
    const list = snap.docs.map(d=>{
      const { displayName, age, city, bio, photoURL, uid } = d.data();
      return { displayName, age, city, bio, photoURL, uid, _doc:d };
    });
    onNext(list);
  });
  return unsub;
}

export async function queryProfilesOnce({filters={}, pageSize=12, startAfterDoc}){
  const col = collection(db, 'users');
  const clauses = [];
  if(filters.gender) clauses.push(where('gender','==',filters.gender));
  if(filters.city)   clauses.push(where('city','==',filters.city));
  let q = query(col, ...clauses, orderBy('createdAt','desc'), limit(pageSize));
  if(startAfterDoc) q = query(col, ...clauses, orderBy('createdAt','desc'), startAfter(startAfterDoc), limit(pageSize));
  const snap = await getDocs(q);
  const list = snap.docs.map(d=>{
    const { displayName, age, city, bio, photoURL, uid } = d.data();
    return { displayName, age, city, bio, photoURL, uid, _doc:d };
  });
  return { profiles:list, lastDoc: snap.docs[snap.docs.length-1] };
}
