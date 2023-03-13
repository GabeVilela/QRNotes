import { Injectable } from '@angular/core';
import { NoteDTO } from '../note-dto.interface';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  notes: NoteDTO[] = [
    {
      id: 1,
      title: 'This is a sample note',
      content: `Version 25 QR Code, up to 1853 characters at L level.
    A QR code (abbreviated from Quick Response code) is a type of matrix barcode (or two-dimensional code) that is designed to be read by smartphones. The code consists of black modules arranged in a square pattern on a white background. The information encoded may be text, a URL, or other data.
    Created by Toyota subsidiary Denso Wave in 1994, the QR code is one of the most popular types of two-dimensional barcodes. The QR code was designed to allow its contents to be decoded at high speed.
    The technology has seen frequent use in Japan and South Korea; the United Kingdom is the seventh-largest national consumer of QR codes.
    Although initially used for tracking parts in vehicle manufacturing, QR codes now are used in a much broader context, including both commercial tracking applications and convenience-oriented applications aimed at mobile phone users (termed mobile tagging). QR codes may be used to display text to the user, to add a vCard contact to the user's device, to open a Uniform Resource Identifier (URI), or to compose an e-mail or text message. Users can generate and print their own QR codes for others to scan and use by visiting one of several paid and free QR code generating sites or apps.`,
      needsExport: false,
    },
    {
      id: 2,
      title: 'Another sample note',
      content: 'Test',
      needsExport: false
    }
  ];

  constructor() {}

  get(id:number|null):NoteDTO|undefined{
    if (id === null) return undefined;

    for (const note of this.notes) {
      if (note.id === id){
        return note;
      }
    }

    return undefined;
  }

  update(noteId:number,noteChanges:Partial<NoteDTO>):void{
    const note = this.findNote(noteId);
    for (const key in noteChanges) {
      if (key === 'id') continue;
      (note as any)[key] = (noteChanges as any)[key];
    }
  }

  private findNote(noteId:number):NoteDTO|undefined{
    for (const note of this.notes){
      if (note.id === noteId){
        return note;
      }
    }
    return undefined;
  }
}
