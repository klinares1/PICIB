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

import { Observable } from 'rxjs';
import { Institucion } from '../model/Institucion.model';

@Injectable({
  providedIn: 'root',
})
export class InstitucionesService {
  constructor(private firestore: Firestore) {}

  addInstitucion(institucion: Institucion) {
    const refCollectionInstitucion = collection(
      this.firestore,
      'instituciones'
    );
    return addDoc(refCollectionInstitucion, {...institucion, creadoEn: Date.now()});
  }

  getInstituciones(): Observable<Institucion[]> {
    const refCollectionInstitucion = collection(
      this.firestore,
      'instituciones'
    );
    return collectionData(refCollectionInstitucion, {
      idField: 'id',
    }) as Observable<Institucion[]>;
  }


  getInstitucion(idInstitucion: string): Promise<Institucion>{


    const refCollectionInstitucion = doc(this.firestore, `instituciones/${idInstitucion}`)
    return getDoc(refCollectionInstitucion).then((doc)=>{
      const data = doc.data();

      return {
        id: idInstitucion,
        nombre: data!['nombre'],

        estado:  data!['estado'],
      }
    })

  }

  deleteInstitucion(institucion: Institucion) {
    const refCollectionCursos = doc(
      this.firestore,
      `instituciones/${institucion.id}`
    );
    return deleteDoc(refCollectionCursos);
  }

  updateDocument(institucion: Institucion) {

    const refCollectionCursos = doc(
      this.firestore,
      `instituciones/${institucion.id}`
    );

    delete institucion.id;
    return updateDoc(refCollectionCursos, {
      ...institucion, modificadoEn: Date.now()
    });
  }
}
