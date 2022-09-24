import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { api, user } from "src/environments/environment";
import { BehaviorSubject, catchError, first, map, Observable, of, shareReplay, switchMap, take, tap } from "rxjs";
import { Card } from "../models/ICard";
import { User } from "../models/IUser"

@Injectable({
    providedIn: 'root'
})
export class CardState {
    private JWT = ""
    private cardSubject$: BehaviorSubject<any> = new BehaviorSubject(null)
    cards$: Observable<Card[] | null> = this.cardSubject$.asObservable()
    constructor(private http: HttpClient) {
    }

    login(): Observable<Card[]> {
        const auth: User = user
        return this.http.post<string>(`${api.url}/login`, auth).pipe(
            first(),
            tap((response) => {
                if (!!response) {
                    this.JWT = response.toString()
                }
            }),
            switchMap(res => this.getcards())
        )
    }
    getHeader() : HttpHeaders{
        const headers = new HttpHeaders()
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${this.JWT}`)
        return headers
    }

    getcards(): Observable<Card[]> {
        return this.http.get<Card[]>(`${api.url}/cards`, { headers: this.getHeader() }).pipe(
            take(1),
            shareReplay(),
            tap(val => this.cardSubject$.next(val))
        )
    }
    addCard(card: Partial<Card>) : Observable<Card>{

        return this.http.post<Card>(`${api.url}/cards`, card, { headers: this.getHeader() }).pipe(
            tap((res) => {
                if (typeof res?.id == "string") {
                    let oldValues: Card[] = this.cardSubject$.getValue()
                    oldValues.push({
                        titulo: res.titulo,
                        conteudo: res.conteudo,
                        id: res.id,
                        lista: res.lista
                    })
                    this.cardSubject$.next(oldValues)
                }
            })
        )
    }

    updateCard(card: Partial<Card>) : Observable<Card>{
        return this.http.put<Card>(`${api.url}/cards/${card.id}`, card, { headers: this.getHeader() }).pipe(
            first(),
            tap((res) => {
                if (typeof res?.id == "string") {
                    let oldValues: Card[] = this.cardSubject$.getValue()
                    const result: Card[] = oldValues.map(item => {
                        if (item.id == res.id) {
                            item = { ...res }
                        }
                        return item
                    })
                    this.cardSubject$.next(result)
                }
            }),
            catchError(err => {
                return of(err)
            })
        )
    }

    updateCardByDragging(id: string, lista: string) : Observable<Card> {
        const oldValues: Card[] = this.cardSubject$.getValue()
        let newCard: Card[] = []
        const result: Card[] = oldValues.map(item => {
            if (item.id == id) {
                item = { ...item, lista: lista }
                newCard.push(item)
            }
            return item
        })
        this.cardSubject$.next(result)
        return this.http.put<Card>(`${api.url}/cards/${id}`, newCard[0], { headers: this.getHeader() }).pipe(
            first()
        )
    }

    deleteCard(id: string) : Observable<Card[]>{
        return this.http.delete<Card[]>(`${api.url}/cards/${id}`, { headers: this.getHeader() }).pipe(
            first(),
            tap((res) => {
                if (res?.length) {
                    let oldValues: Card[] = this.cardSubject$.getValue()
                    const result: Card[] = oldValues.filter((card: Card) => card.id != id)
                    this.cardSubject$.next(result)
                }
            }),
            catchError(err => {
                return of(err)
            })
        )
    }

}