import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() titulo : string = "titulo"
  @Input() conteudo : string = "conteudo"
  @Output() edit : EventEmitter<any> = new EventEmitter()
  @Output() delete : EventEmitter<any> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }
  editCard(){
    this.edit.emit()
  }
  deleteCard(){
    this.delete.emit()
  }

}
