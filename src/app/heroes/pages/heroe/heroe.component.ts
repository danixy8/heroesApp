import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Heroe } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styles: [`
  img {
    width: 90%;
    border-radius: 5px
  }
  `]
})
export class HeroeComponent implements OnInit {

  heroe!: Heroe;

  constructor(  private rutaActiva: ActivatedRoute,
                private heroeService: HeroesService,
                private router: Router ) {}

  ngOnInit(): void {

    setTimeout(() => {

      this.rutaActiva.params.pipe(
        switchMap( ({ id }) => this.heroeService.getHeroesbyId(id) )
      )
      .subscribe(data => this.heroe = data);

    }, 300);

  }

  regresar(): void {
    this.router.navigate(['/heroes/listado']);
  }

}
