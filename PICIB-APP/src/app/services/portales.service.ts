import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Portal } from '../model/portal.mode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortalesService {
  constructor(private firestore: Firestore) {}

  addPortal(portal: Portal) {
    const refCollectionPortales = collection(this.firestore, 'portales');
    return addDoc(refCollectionPortales, portal);
  }

  getPortales(): Observable<Portal[]> {
    const refCollectionPortales = collection(this.firestore, 'portales');
    return collectionData(refCollectionPortales, {
      idField: 'id',
    }) as Observable<Portal[]>;
  }

  getPortal(idPortal: string): Promise<Portal> {
    const refCollectionPortales = doc(this.firestore, `portales/${idPortal}`);
    return getDoc(refCollectionPortales).then((doc) => {
      const data = doc.data();

      return {
        id: idPortal,
        nombre:  data!['nombre'] ,
        ubicacion: data!['ubicacion'],
        horariosAtencion: data!['horariosAtencion'],
        estado:   data!['estado'] ,
      };
    });
  }

  deletePortal(portal: Portal) {
    const refCollectionPortales = doc(this.firestore, `portales/${portal.id}`);
    return deleteDoc(refCollectionPortales);
  }

  updateDocument(portal: Portal) {
    const refCollectionPortales = doc(this.firestore, `portales/${portal.id}`);
    return updateDoc(refCollectionPortales, {
      nombre: portal.nombre,
      ubicacion: portal.ubicacion,
      horariosAtencion: portal.horariosAtencion,
      estado: portal.estado,
    });
  }
}
