import { Component, TrackByFunction } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SubscriptionLike } from "rxjs";

import { Car } from "src/app/models/car";
import { Color } from "src/app/models/color";
import { User } from "src/app/models/user";
import { CarService } from "src/app/services/api/car/car.service";
import { UserService } from "src/app/services/api/user/user.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  // Booleans
  public displayMessage: boolean = false;
  public isLoading: boolean = false;

  // Form
  public form: FormGroup;

  // Model based variables
  public cars: Car[] = [];
  public colors: Color[] = [];
  public user: User | undefined;

  // Functions
  public trackByCar: TrackByFunction<Car>;
  public trackByColor: TrackByFunction<Color>;

  carSubscription: SubscriptionLike | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private carService: CarService,
    private userService: UserService
  ) {
    this.isLoading = true;
    this.trackByCar = this.carService.trackByCar;
    this.trackByColor = this.carService.trackByColor;
    this.form = this.getForm();
    this.carSubscription = this.carService
      .getCars()
      .subscribe((cars: Car[]) => {
        this.cars = cars;
        this.isLoading = false;
      });
  }

  public setColors(): void {
    this.isLoading = true;
    const selectedCar = this.cars.find((c) => c.id == this.form.value.car_id);

    if (selectedCar) {
      this.colors = selectedCar.colors;
    }

    this.isLoading = false;
  }

  private getForm(): FormGroup {
    return this.formBuilder.group({
      firstname: new FormControl("", [
        Validators.required,
        Validators.maxLength(255),
      ]),
      lastname: new FormControl("", [
        Validators.required,
        Validators.maxLength(255),
      ]),
      date_of_birth: new FormControl("", Validators.required),
      has_driver_licence: new FormControl(false),
      car_id: new FormControl(null),
      color_id: new FormControl(null),
    });
  }

  private userSerializer(): User {
    const user = {
      ...this.form.value,
    } as User;

    return user;
  }

  public onSubmit(): void {
    this.isLoading = true;
    const user: User = this.userSerializer();

    this.userService.addUser(user).subscribe(
      (user: User) => (this.user = user),
      (error) => console.log("error:", error),
      () => {
        this.isLoading = false;
        this.notify();
      }
    );
  }

  private notify(): void {
    this.displayMessage = true;
    setTimeout(() => (this.displayMessage = false), 5000);
  }
}
