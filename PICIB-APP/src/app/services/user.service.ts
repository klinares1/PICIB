import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Usuario } from '../model/usuarios.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private auth: Auth, private firestore: Firestore,  private router: Router) {}

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  enviarEmailResetContrasenia(email:string){
    return sendPasswordResetEmail(this.auth,email);
  }

  login({ email, password }: any) {

    return signInWithEmailAndPassword(this.auth, email, password);
  }

  isLoggedIn() {
    let isLoggedIn=null;
    if (this.auth.currentUser) {
      isLoggedIn = this.auth.currentUser;
    }
    return isLoggedIn;
  }

  isLoggedInCallback(callback: (user: any) => void): void {
    this.auth.onAuthStateChanged(callback);
  }

  isLoggedInCallbackUnaVez(callback: (user: any) => void): void {
   const observer= this.auth.onAuthStateChanged(user=>{
      callback(user);
      observer();
    });
  }
  async logout() {
    await this.auth.signOut();
  }

  addUsuario(usuario: Usuario) {
    const refCollectionUsuarios = collection(this.firestore, 'usuarios');
    return addDoc(refCollectionUsuarios, usuario);
  }

  getUsuarios(): Observable<Usuario[]> {
    const refCollectionUsuarios = collection(this.firestore, 'usuarios');
    return collectionData(refCollectionUsuarios, {
      idField: 'id',
    }) as Observable<Usuario[]>;
  }

  getUsuario(idUsuario: string): Promise<Usuario> {
    const refCollectionUsuarios = doc(this.firestore, `usuarios/${idUsuario}`);
    return getDoc(refCollectionUsuarios).then((doc) => {
      const data = doc.data();

      return {
        id: idUsuario,
        nombre: data ? data['nombre'] : '',
        descripcion: data ? data['descripcion'] : '',
        estado: data ? data['estado'] : '',
      };
    });
  }

  existeUsuario(usuario: Usuario) {
    const refCollectionEstudiantes = collection(this.firestore, 'usuarios');
    const queryUsuario = query(
      refCollectionEstudiantes,
      or(where('documento', '==', usuario.documento), where('correoElectronico', '==', usuario.correoElectronico))

    );

    return getDocs(queryUsuario).then((snapshot) => {
      if (snapshot.size > 0) {
        const doc = snapshot.docs[0];
        const data = doc.data() as Usuario;
        data.id = doc.id;

        return data;
      } else {
        return null;
      }
    });
  }

  obtenerUsuarioPorCorreo(email: string) {
    const refCollectionEstudiantes = collection(this.firestore, 'usuarios');
    const queryUsuario = query(
      refCollectionEstudiantes,
       where('correoElectronico', '==', email)

    );

    return getDocs(queryUsuario).then((snapshot) => {
      if (snapshot.size > 0) {
        const doc = snapshot.docs[0];
        const data = doc.data() as Usuario;
        data.id = doc.id;

        return data;
      } else {
        return null;
      }
    });
  }

  deleteUsuario(usuario: Usuario) {
    const refCollectionUsuarios = doc(this.firestore, `usuarios/${usuario.id}`);
    return deleteDoc(refCollectionUsuarios);
  }

  updateUsuario(usuario: Usuario) {
    const refCollectionUsuarios = doc(this.firestore, `usuarios/${usuario.id}`);
    return updateDoc(refCollectionUsuarios, {});
  }
}
