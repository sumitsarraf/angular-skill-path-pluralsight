import { Component } from '@angular/core';

import { IClass } from './class.model';

import { CatalogRepositoryService } from "./catalog-repository.service";
import { UserRepositoryService } from "../services/user-repository.service";

@Component({
  styleUrls: ['./catalog.component.css'],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent {
  classes:IClass[] = [];
  visibleClasses:IClass[] = [];

  constructor(
    public catalogRepository:CatalogRepositoryService,
    public userRepository:UserRepositoryService,
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
    if (!filter)
      return this.visibleClasses = this.classes;

    if (filter === 'GEN')
      return this.showOnlyGeneralCourses();


    return this.visibleClasses = this.classes.filter(c => c.course.courseNumber.startsWith(filter));
  }

  showOnlyGeneralCourses() {
    return this.visibleClasses = this.classes.filter(c =>
      !c.course.courseNumber.startsWith('CH') &&
      !c.course.courseNumber.startsWith('PO') &&
      !c.course.courseNumber.startsWith('SP'));
  }
}
