import { Component, OnInit } from '@angular/core';

import { IClass } from './class.model';

import { CatalogRepositoryService } from "./catalog-repository.service";
import { UserRepositoryService } from "../core/user-repository.service";
import { FilterClassesService } from './filter-classes.service';

@Component({
  styleUrls: ['./catalog.component.css'],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent implements OnInit {
  classes:IClass[] = [];
  visibleClasses:IClass[] = [];

  constructor(
    public catalogRepository:CatalogRepositoryService,
    public userRepository:UserRepositoryService,
    private filterClassesService:FilterClassesService
    ) {}

  ngOnInit() {
    this.catalogRepository.getCatalog()
      .subscribe(classes => { this.classes = classes; this.applyFilter('')});
  }

  enroll(classToEnroll:IClass) {
    classToEnroll.processing = true;
    this.userRepository.enroll(classToEnroll.classId)
      .subscribe({
        complete: () => { classToEnroll.processing = false; classToEnroll.enrolled=true; },
        error: (err) => { console.error(err); classToEnroll.processing = false }, //add a toast message or something
      });
  }

  drop(classToDrop:IClass) {
    classToDrop.processing = true;
    this.userRepository.drop(classToDrop.classId)
      .subscribe({
        complete: () => { classToDrop.processing = false; classToDrop.enrolled=false; },
        error: (err) => { console.error(err); classToDrop.processing = false }, //add a toast message or something
      });
  }

  applyFilter(filter:string) {
    this.visibleClasses = this.filterClassesService.filterClasses(filter, this.classes);
  }
}
