import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
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

import { Curso } from '../model/curso.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CursosService {
  constructor(private firestore: Firestore) {}

  addCurso(curso: Curso) {
    const refCollectionCursos = collection(this.firestore, 'cursos');
    return addDoc(refCollectionCursos, {...curso, creadoEn: Date.now()});
  }

  getCursos(): Observable<Curso[]> {
    const refCollectionCursos = collection(this.firestore, 'cursos');
    return collectionData(refCollectionCursos, { idField: 'id' }) as Observable<
      Curso[]
    >;
  }

  getCursoPorNombre(nombre: string){
    const refCollectionCursos = collection(this.firestore, 'cursos');
    const queryCurso = query(
      refCollectionCursos,
      where('nombre', '==', nombre)

    );

    return getDocs(queryCurso).then((snapshot) => {
      if (snapshot.size > 0) {
        const doc = snapshot.docs[0];
        const data = doc.data() as Curso;
        data.id = doc.id;
        return data;
      } else {
        return null;
      }
    });



  }

  getCurso(idCurso: string): Promise<Curso>{


    const refCollectionCursos = doc(this.firestore, `cursos/${idCurso}`)
    return getDoc(refCollectionCursos).then((doc)=>{
      const data = doc.data();

      return {
        id: idCurso,
        nombre: data? data['nombre']: '',
        descripcion: data? data['descripcion']: '',
        estado: data? data['estado']: '',
      }
    })

  }

  deleteCurso(curso: Curso) {
    const refCollectionCursos = doc(this.firestore, `cursos/${curso.id}`);
    return deleteDoc(refCollectionCursos);
  }

  updateDocument(curso: Curso) {
    const refCollectionCursos = doc(this.firestore, `cursos/${curso.id}`);
    return updateDoc(refCollectionCursos, {
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      estado: curso.estado,
    });
  }
}
