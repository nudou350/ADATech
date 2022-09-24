import { Injectable } from "@angular/core"
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router"
import { Observable } from "rxjs"
import { Card } from "../models/ICard"
import { CardState } from "./card.state"

@Injectable({
    providedIn: 'root'
})
export class LoginResolver implements Resolve<Card[]>{
    constructor(private cardState : CardState){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Card[]> {
        return  this.cardState.login()
    }
}