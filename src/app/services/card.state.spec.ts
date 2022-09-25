
import { HttpErrorResponse, HttpHeaders } from "@angular/common/http"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { TestBed} from "@angular/core/testing"
import { Observable } from "rxjs"
import { api, user } from "src/environments/environment"
import { Card } from "../models/ICard"
import { CardState } from "./card.state"

describe('CardStateService', ()=> {

    let cardService : CardState,
        httpTestingController : HttpTestingController
    const card = 
        {
        titulo: 'titulo',
        conteudo : 'conteudo',
        id: '1',
        'lista': 'ToDo'
        }
    let cards : Card[] = []
        
    beforeEach(()=> {
        console.log("calling beforeEach")
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CardState]
        })
        cardService = TestBed.inject(CardState)
        httpTestingController = TestBed.inject(HttpTestingController)        

    });
    it('should get JWT', ()=> {
        cardService.login().subscribe(
            result=> {
                expect(result).toBeTruthy('No data returned')
                expect(result).toBe([])
            }
        );
         const req = httpTestingController.expectOne("http://localhost:5000/login")
         expect(req.request.method).toEqual("POST")
         
         req.flush([])
        

    });
    
    it('should get cards', ()=> {
        cardService.getcards().subscribe(
            result=> {
                expect(result).toBeTruthy()
            }
        );
         const req = httpTestingController.expectOne("http://localhost:5000/cards")
         expect(req.request.method).toEqual("GET")
         req.flush([])
        

    });

    it('should add a card', ()=> {
        const card = {
            titulo: 'titulo',
            conteudo : 'conteudo',
            id: '1',
            'lista': 'ToDo'
        }
        cardService.addCard(card).subscribe(
            result=> {
                expect(result).toBeTruthy()
                expect(result).toEqual(card)
            }
        );
         const req = httpTestingController.expectOne("http://localhost:5000/cards")
         expect(req.request.method).toEqual("POST")
         req.flush({
            ...cards,
            ...card
         })
    });
    it('should update a card', ()=> {

        cardService.updateCard(card).subscribe(
            result=> {
                expect(result).toBeTruthy()
                expect(result.id).toEqual(card.id)
            }
        );
         const req = httpTestingController.expectOne("http://localhost:5000/cards/"+card.id)
         expect(req.request.method).toEqual("PUT")
         req.flush({
            titulo: 'titulo',
            conteudo : 'conteudo',
            id: '1',
            'lista': 'ToDo'
         })
    });
    it('should update a card by dragging', ()=> {

        cardService.updateCardByDragging(card.id, card.lista).subscribe(
            result=> {
                expect(result).toBeTruthy()
                expect(result).toEqual(card)
                expect(result.id).toEqual(card.id)
            }
        );
         const req = httpTestingController.expectOne("http://localhost:5000/cards/"+card.id)
         expect(req.request.method).toEqual("PUT")
         req.flush({
            titulo: 'titulo',
            conteudo : 'conteudo',
            id: '1',
            'lista': 'ToDo'
         })
    });
    it('should delete a card', ()=> {

        cardService.deleteCard(card.id).subscribe(
            result=> {
                expect(result).toBeTruthy()
                expect(result).toEqual([])
            }
        );
         const req = httpTestingController.expectOne("http://localhost:5000/cards/"+card.id)
         expect(req.request.method).toEqual("DELETE")
         req.flush([])
    });
})