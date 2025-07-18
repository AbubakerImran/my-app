import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const firebaseConfig = {
  projectId: "angular-app-12112",
  appId: "1:755919150497:web:1d2ab7f393c337edf8bfe0",
  storageBucket: "angular-app-12112.firebasestorage.app",
  apiKey: "AIzaSyAIfddf6DRHUWN-UBZAeY2Lkj5HPczlwRI",
  authDomain: "angular-app-12112.firebaseapp.com",
  messagingSenderId: "755919150497" 
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};
