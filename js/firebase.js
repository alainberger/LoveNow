// js/firebase.js — Firebase Web v9 (modulaire) + helpers app
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import {
  getAuth, onAuthStateChanged as fbOnAuth,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut as fbSignOut, sendEmailVerification, updateProfile as fbUpdateProfile
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  getFirestore, doc, getDoc, setDoc,
  serverTimestamp, collection, query, where, orderBy, limit, onSnapshot
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

const cfg = {
  apiKey:        window.env?.FIREBASE_API_KEY,
  authDomain:    window.env?.FIREBASE_AUTH_DOMAIN,
  projectId:     window.env?.FIREBASE_PROJECT_ID,
  appId:         window.env?.FIREBASE_APP_ID,
  storageBucket: window.env?.FIREBASE_STORAGE_BUCKET
};
const app  = initializeApp(cfg);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// ---- Auth ----
export function onAuthStateChanged(cb){ return fbOnAuth(auth, cb); }

export async function signUp(email, pass, profile={}){
  const { user } = await createUserWithEmailAndPassword(auth, email, pass);
  if(profile.displayName){ try{ await fbUpdateProfile(user, { displayName: profile.displayName }); }catch{} }
  await sendEmailVerification(user).catch(()=>{});
  await setDoc(doc(db,'users',user.uid), {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: profile.displayName || '',
    city: profile.city || '',
    age: Number(profile.age)||null,
    gender: profile.gender||'',
    bio: profile.bio||'',
    photoURL: profile.photoURL||'',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge:true });
  return user;
}

export async function signIn(email, pass){
  const { user } = await signInWithEmailAndPassword(auth, email, pass);
  return user;
}

export async function signOut(){ return fbSignOut(auth); }

export async function resendEmailVerification(){
  if(!auth.currentUser) throw new Error('not-authenticated');
  await sendEmailVerification(auth.currentUser);
}

export async function getProfileDoc(uid){
  const snap = await getDoc(doc(db,'users',uid));
  return snap.exists()? snap.data() : null;
}

export async function updateProfileDoc(partial){
  if(!auth.currentUser) throw new Error('not-authenticated');
  await setDoc(doc(db,'users',auth.currentUser.uid), { ...partial, updatedAt: serverTimestamp() }, { merge:true });
}

// ---- Liste temps réel (Home) ----
export function listenProfiles({filters={}, pageSize=12, onNext}){
  const col = collection(db,'users');
  const clauses = [];
  if(filters.gender) clauses.push(where('gender','==',filters.gender));
  if(filters.city)   clauses.push(where('city','==',filters.city));
  const q = query(col, ...clauses, orderBy('createdAt','desc'), limit(pageSize));
  return onSnapshot(q, snap=>{
    const list = snap.docs.map(d=>{
      const { displayName, age, city, bio, photoURL, uid } = d.data();
      return { displayName, age, city, bio, photoURL, uid };
    });
    onNext(list);
  });
}