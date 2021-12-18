import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { Car } from "src/app/models/car";
import { environment } from "src/environments/environment";
import { Color } from "src/app/models/color";

@Injectable({
  providedIn: "root",
})
export class CarService {
  private baseUrl: string = environment.API_URL + "cars/";

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Token " + environment.TOKEN,
    }),
  };

  constructor(private http: HttpClient) {}

  // TrackBy
  public trackByCar(index: number, car: Car): number {
    return car.id;
  }

  public trackByColor(index: number, color: Color): number {
    return color.id;
  }

  // GET
  public getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.baseUrl, this.httpOptions);
  }

  public getCarFromId(id: number): Observable<Car> {
    return this.http.get<Car>(this.baseUrl + id, this.httpOptions);
  }
}
