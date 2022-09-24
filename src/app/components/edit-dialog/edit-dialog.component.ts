import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Card } from 'src/app/models/ICard';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  form = this.fb.group({
    titulo : ["", Validators.required],
    conteudo : ["", Validators.required],
    lista : ["", Validators.required],
    id : [""]
  })
  modo = "Editar"

  constructor(
    private fb : FormBuilder,
    private dialogRef : MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) {titulo, conteudo, lista, id, modo} : any) 
    { 
      this.titulo.setValue(titulo)
      this.conteudo.setValue(conteudo)
      this.lista.setValue(lista)
      this.id.setValue(id)
      this.modo = modo
    }

  //getters

  get titulo(){
    return this.form.controls['titulo']
  }

  get conteudo(){
    return this.form.controls['conteudo']
  }
  get lista(){
    return this.form.controls['lista']
  }
  get id(){
    return this.form.controls['id']
  }



  ngOnInit(): void {
  }

  save(){
    this.dialogRef.close(this.form.value)
  }
  close(){
    this.dialogRef.close()
  }

}
