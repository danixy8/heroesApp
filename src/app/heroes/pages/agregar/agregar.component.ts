import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
  img {
    width: 70%;
    border-radius: 5px;
    align-items: center;
  }
  `
  ]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ];

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: '',
  };

  constructor( private rutaActiva: ActivatedRoute,
               private heroesService: HeroesService,
               private router: Router,
               private snackbar: MatSnackBar,
               public dialog: MatDialog) { }

  ngOnInit(): void {

    if (!this.router.url.includes('editar')){
      return;
    }

    this.rutaActiva.params
    .pipe(
      switchMap(({id}) => this.heroesService.getHeroesbyId(id))
    )
    .subscribe(heroe => this.heroe = heroe);
  }

  guardar(): void {

    if (this.heroe.superhero.trim().length === 0
        || this.heroe.alter_ego.trim().length === 0
        || this.heroe.alt_img?.trim().length === 0){
      this.mostrarSnackBar('Se necesita llenar los campos obligatorios');
      return;
    }

    if (this.validURL(this.heroe.alt_img as string) === false ){
      this.mostrarSnackBar('Se necesita un URL valido');
      return;
    }
      // editar
    if (this.heroe.id) {
      this.heroesService.actualizarHeroe(this.heroe)
      .subscribe(heroe => {
        this.mostrarSnackBar('Registro actualizado');
        this.router.navigate(['/heroes', heroe.id]);
      });
    }else{
      // crear
      this.heroesService.agregarHeroe( this.heroe )
      .subscribe(heroe => {
        this.router.navigate(['/heroes', heroe.id]);
        this.mostrarSnackBar('Registro creado');
      });
    }
  }

  borrarHeroe(): void {

    const dialogo = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: {...this.heroe}
    });

    dialogo.afterClosed().pipe(
      filter( result => result === true ),
      // tslint:disable-next-line:no-non-null-assertion
      switchMap(resp => this.heroesService.borrarHeroe( this.heroe.id! )),
      switchMap(resp => this.router.navigate(['/heroes']))
    ).subscribe(resp =>  this.mostrarSnackBar( 'Elemento borrado satisfactoriamente'));

  }

  mostrarSnackBar( mensaje: string ): void {
    this.snackbar.open(mensaje, 'ok!', {
      duration: 2500
    });
  }

  validURL(str: string): boolean {
    const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex .test(str)) {
      return false;
    } else {
      return true;
    }
  }

}
