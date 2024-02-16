import { Injectable } from '@angular/core';
import { Inscripcion } from '../model/inscripcion.model';
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
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InscripcionService {
  constructor(private firestore: Firestore) {}

  addInscripcion(inscripcion: Inscripcion) {
    const refCollectionInscripcions = collection(
      this.firestore,
      'inscripciones'
    );

    return addDoc(refCollectionInscripcions, {
      estudiante: { id: inscripcion.estudiante?.id },
      capacitacion: {
        id: inscripcion.capacitacion?.id,
      },

      estado: inscripcion.estado,
      creadoEn: Date.now()
    });
  }

  getInscripciones(): Observable<Inscripcion[]> {
    const refCollectionInscripcions = collection(
      this.firestore,
      'inscripciones'
    );
    return collectionData(refCollectionInscripcions, {
      idField: 'id',
    }) as Observable<Inscripcion[]>;
  }

  getInscripcion(idInscripcion: string): Promise<Inscripcion> {
    const refCollectionInscripcions = doc(
      this.firestore,
      `inscripciones/${idInscripcion}`
    );
    return getDoc(refCollectionInscripcions).then((doc) => {
      const data = doc.data();

      return {
        id: idInscripcion,
        estudiante: {
          id: data ? data['estudiante.id'] : '',
        },
        capacitacion: {
          id: data ? data['capacitacion.id'] : '',
        },
        estado: data ? data['estado'] : '',
      };
    });
  }

  existeInscripcion(inscripcion: Inscripcion) {
    const refCollectionEstudiantes = collection(
      this.firestore,
      'inscripciones'
    );
    const queryInscripcion = query(
      refCollectionEstudiantes,
      and(
        where('capacitacion', '==', { id: inscripcion.capacitacion?.id }),
        where('estudiante', '==', { id: inscripcion.estudiante?.id })
      )
    );

    return getDocs(queryInscripcion).then((snapshot) => {
      if (snapshot.size > 0) {
        const doc = snapshot.docs[0];
        const data = doc.data() as Inscripcion;
        data.id = doc.id;
        return data;
      } else {
        return null;
      }
    });
  }


  cantidadInscripcionesEstudiante(inscripcion: Inscripcion){
    const refCollectionEstudiantes = collection(
      this.firestore,
      'inscripciones'
    );
    const queryInscripcion = query(
      refCollectionEstudiantes,
      and(
        where('certificado', '==', false),
        where('estudiante', '==', { id: inscripcion.estudiante?.id })
      )
    );

    return getDocs(queryInscripcion).then((snapshot) => {
      if (snapshot.size > 0) {
        const docs = snapshot.docs.map(doc=>{
          const data =doc.data() as Inscripcion;
          data.id = doc.id;
          return data;
        });
        return docs;

      } else {
        return null;
      }
    });
  }

  deleteInscripcion(inscripcion: Inscripcion) {
    const refCollectionInscripcions = doc(
      this.firestore,
      `inscripciones/${inscripcion.id}`
    );
    return deleteDoc(refCollectionInscripcions);
  }

  guardarCertificacion(inscripcion: Inscripcion, certificacion: {estado:boolean;comentario?:string;fecha: Date}){

    const refCollectionInscripcions = doc(
      this.firestore,
      `inscripciones/${inscripcion.id}`
    );
    return updateDoc(refCollectionInscripcions, {
       certificacion
    });
  }

  updateDocument(inscripcion: Inscripcion) {
    const refCollectionInscripcions = doc(
      this.firestore,
      `inscripciones/${inscripcion.id}`
    );
    return updateDoc(refCollectionInscripcions, {
      estudiante: { id: inscripcion.estudiante?.id },
      capacitacion: {
        id: inscripcion.capacitacion?.id,
      },
      estado: inscripcion.estado,
    });
  }
}
