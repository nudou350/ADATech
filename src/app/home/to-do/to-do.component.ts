import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import {map, first, switchMap} from "rxjs/operators"
import { EditDialogComponent } from 'src/app/components/edit-dialog/edit-dialog.component';
import { Card } from 'src/app/models/ICard';
import { CardState } from 'src/app/services/card.state';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent  {

  @ViewChild('todoEl', {static: false}) todoEl !: ElementRef
  @ViewChild('doingEl', {static: false}) doingEl !: ElementRef
  @ViewChild('doneEl', {static: false}) doneEl !: ElementRef

  constructor(
    private cardState : CardState,
    private dialog : MatDialog,
    public translate : TranslateService) {
  }

  toDo$  = this.cardState.cards$.pipe(
    map(card => card?.filter(item => item.lista == "ToDo"))
  )
  doing$ = this.cardState.cards$.pipe(
    map(card => card?.filter(item => item.lista == "Doing"))
  )
  done$ = this.cardState.cards$.pipe(
    map(card => card?.filter(item => item.lista == "Done"))
  )
  toDo : Card[] = []
  doing : Card[] = []
  done : Card[] = []

  dropMultiList(event:CdkDragDrop<Card[]>) {
    if(event.previousContainer == event.container) {
      let target = []
      if(event.container.id == "cdk-drop-list-0") {
        target = this.toDo
         moveItemInArray(target, event.previousIndex, event.currentIndex)
      }
        target = event.container.id == "cdk-drop-list-1" ? this.doing : this.done
        moveItemInArray(target, event.previousIndex, event.currentIndex)
    }
    else{
      transferArrayItem(
        event.previousContainer?.data,
        event.container?.data,
        event.previousIndex,
        event.currentIndex
      )
    }

    //since we have pipe first() we don't need to worry about assigning the subscription to unsubscribe later, since it automatically avoids memory leak
    if(event.container.id == "cdk-drop-list-0"){
   
      return this.cardState.updateCardByDragging(event.item.element.nativeElement.id, "ToDo").subscribe(()=> this.resetBorders())
    }

    return event.container.id == "cdk-drop-list-1" ? 
    this.cardState.updateCardByDragging(event.item.element.nativeElement.id, "Doing").subscribe(()=> this.resetBorders()) : 
    this.cardState.updateCardByDragging(event.item.element.nativeElement.id, "Done").subscribe(()=> this.resetBorders())
  }

  checkContainer($event : any){
    if($event.container?.id == 'cdk-drop-list-0'){
     return this.todoEl.nativeElement.style.border = '2px solid red'
    }
    return $event.container?.id == 'cdk-drop-list-1' ?  this.doingEl.nativeElement.style.border = '2px solid red' : this.doneEl.nativeElement.style.border = '2px solid red'
  }

  resetBorders(){
    //we reset all to avoid adding a third output in order to manage multiple borders at the same time
    this.todoEl.nativeElement.style.border = '1px solid #b4b4b4'
    this.doingEl.nativeElement.style.border = '1px solid #b4b4b4'
    return this.doneEl.nativeElement.style.border = '1px solid #b4b4b4'
  }

  editCard(card : Card){
    
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true 
    dialogConfig.autoFocus = true
    dialogConfig.width = '300px'

    dialogConfig.data = {
      titulo : card.titulo,
      conteudo : card.conteudo,
      id: card.id,
      lista : card.lista,
      //kept parameter in PT to avoid mixing languages inside same objects. Usually I'd make everything in english, but since requirements included objects in PT, I kept only the logic in english
      modo : this.translate.instant('edit')
    }

    const dialogRef = this.dialog.open(EditDialogComponent, dialogConfig)
    dialogRef.afterClosed().pipe(
      first(),
      switchMap(val => {
        if(val == undefined) return of(null)
        return this.cardState.updateCard(val)
      })
    ).subscribe()
  }

  addCard(){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true
    dialogConfig.width = '300px'

    dialogConfig.data = {
      modo : this.translate.instant('create')
    }
    const dialogRef = this.dialog.open(EditDialogComponent, dialogConfig)
    dialogRef.afterClosed().pipe(
      first(),
      switchMap(val => {
        if(val == undefined) return of(null)
        return this.cardState.addCard(val)
      })
    ).subscribe()
  }
  deleteCard(id:string){
   return this.cardState.deleteCard(id).subscribe()
  }

}
