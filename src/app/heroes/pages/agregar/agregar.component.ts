import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
  ]
})
export class AgregarComponent implements OnInit {


  constructor( private rutaActiva: ActivatedRoute ) { }

  ngOnInit(): void {
    this.rutaActiva.params
    .subscribe(({id}) => console.log(id));
  }

}
