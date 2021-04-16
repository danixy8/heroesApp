import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map } from 'rxjs/operators';
import { Heroe } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styles: [
  ]
})
export class BuscarComponent implements OnInit {

  termino = '';
  heroes: Heroe[] = [];
  heroeSeleccionado!: Heroe | undefined;

  constructor(private heroesService: HeroesService) { }

  ngOnInit(): void {
  }

  buscando(): void {
    this.heroesService.getSugerencias(this.termino.trim())
    .subscribe( heroes => {
      this.heroes = heroes;
      console.log(heroes);
    });
  }

  opcionSeleccionada( event: MatAutocompleteSelectedEvent ): void {
    if (!event.option.value){
      this.heroeSeleccionado = undefined;
      console.log('no hay valor');
      return;
    }

    const heroe: Heroe = event.option.value;
    this.termino = heroe.superhero;

    // tslint:disable-next-line:no-non-null-assertion
    this.heroesService.getHeroesbyId( heroe.id! )
    .subscribe( heroeData => this.heroeSeleccionado = heroeData );
  }

}
