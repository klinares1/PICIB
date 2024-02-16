import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  and,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Estudiante } from '../model/usuarios.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstudiantesService {
  constructor(private firestore: Firestore) {}

  addEstudiante(estudiante: Estudiante) {
    const refCollectionEstudiantes = collection(
      this.firestore,
      'participantes'
    );
    return addDoc(refCollectionEstudiantes, {...estudiante, creadoEn: Date.now()});
  }

  getEstudiantes(): Observable<Estudiante[]> {
    const refCollectionEstudiantes = collection(
      this.firestore,
      'participantes'
    );
    return collectionData(refCollectionEstudiantes, {
      idField: 'id',
    }) as Observable<Estudiante[]>;
  }
  existeElStudiante(estudiante: Estudiante) {
    const refCollectionEstudiantes = collection(
      this.firestore,
      'participantes'
    );
    const queryEstudiante = query(
      refCollectionEstudiantes,
      where('documento', '==', estudiante.documento)
    );

    return getDocs(queryEstudiante).then((snapshot) => {
      if (snapshot.size > 0) {
        const doc = snapshot.docs[0];
        const data = doc.data() as Estudiante;
        data.id = doc.id;
        return data;
      } else {
        return null;
      }
    });
  }

  existeElEstudiante(estudiante: Estudiante) {
    const refCollectionEstudiantes = collection(
      this.firestore,
      'participantes'
    );
    const queryEstudiante = query(
      refCollectionEstudiantes,
      and(
        where('documento', '==', estudiante.documento),
        where('fechaNacimiento', '==', estudiante.fechaNacimiento)
      )
    );

    return getDocs(queryEstudiante).then((snapshot) => {
      if (snapshot.size > 0) {
        const doc = snapshot.docs[0];
        const data = doc.data() as Estudiante;
        data.id = doc.id;
        return data;
      } else {
        return null;
      }
    });
  }

  getEstudiante(idEstudiante: string): Promise<Estudiante> {
    const refCollectionEstudiantes = doc(
      this.firestore,
      `participantes/${idEstudiante}`
    );
    return getDoc(refCollectionEstudiantes).then((doc) => {
      const data = doc.data() as Estudiante;

      return {
        id: idEstudiante,
       ...data
      };
    });
  }

  deleteEstudiante(estudiante: Estudiante) {
    const refCollectionEstudiantes = doc(
      this.firestore,
      `participantes/${estudiante.id}`
    );
    return deleteDoc(refCollectionEstudiantes);
  }

  updateDocument(estudiante: Estudiante) {
    const refCollectionEstudiantes = doc(
      this.firestore,
      `participantes/${estudiante.id}`
    );
    return updateDoc(refCollectionEstudiantes, {
      ...estudiante, modificadoEn: Date.now()
    });
  }
}
