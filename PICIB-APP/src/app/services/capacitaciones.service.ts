import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Capacitacion } from '../model/capacitacion.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CapacitacionesService {
  constructor(private firestore: Firestore) {}

  addCapacitacion(capacitacion: Capacitacion) {
    const refCollectionCapacitaciones = collection(
      this.firestore,
      'capacitaciones'
    );
    return addDoc(refCollectionCapacitaciones, capacitacion);
  }

  getCapacitaciones(): Observable<Capacitacion[]> {
    const refCollectionCapacitaciones = collection(
      this.firestore,
      'capacitaciones'
    );


    return collectionData(refCollectionCapacitaciones, {
      idField: 'id',
    }) as Observable<Capacitacion[]>;
  }

  getCapacitacionesByEstado(): Observable<Capacitacion[]> {
    const refCollectionCapacitaciones = collection(
      this.firestore,
      'capacitaciones'
    );

    const queryFilter = query(
      refCollectionCapacitaciones,
      where('estado', '==', true)
    );
    return collectionData(queryFilter, {
      idField: 'id',
    }) as Observable<Capacitacion[]>;
  }

  getCapacitacion(idCapacitacion: string): Promise<Capacitacion> {
    const refCollectionEstudiantes = doc(
      this.firestore,
      `capacitaciones/${idCapacitacion}`
    );
    return getDoc(refCollectionEstudiantes).then((doc) => {
      const data = doc.data();

      return {
        id: idCapacitacion,

        horario: {
          fechaInicio: data?.['horario'].fechaInicio ?? '',
          fechaFin: data?.['horario'].fechaFin ?? '',
          portal: {
            id: data?.['horario'].portal.id ?? '',
          },
        },
        institucion: {
          id: data?.['institucion'].id ?? '',
        },
        curso: {
          id: data?.['curso'].id ?? '',
        },
        estado: data?.['estado'] ?? '',
      };
    });
  }
  deleteCapacitacion(capacitacion: Capacitacion) {
    const refCollectionCapacitaciones = doc(
      this.firestore,
      `capacitaciones/${capacitacion.id}`
    );
    return deleteDoc(refCollectionCapacitaciones);
  }

  updateDocument(capacitacion: Capacitacion) {
    const refCollectionCapacitaciones = doc(
      this.firestore,
      `capacitaciones/${capacitacion.id}`
    );

    delete capacitacion.id;
    return updateDoc(refCollectionCapacitaciones, {
      ...capacitacion, modificadoEn: Date.now()
    });
  }
}
