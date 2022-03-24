import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NbMenuBag, NbMenuItem, NbMenuService } from '@nebular/theme';
import { APIResponse, PublicApiService } from './public-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'public-api'
  items: NbMenuItem[] = []
  url: string = 'https://www.google.com'

  @ViewChild('container', { static: true }) container !: ElementRef

  searchForm = this.formBuilder.group({
    title: ''
  })

  constructor (
    private publicApiService : PublicApiService,
    private menuService : NbMenuService,
    private formBuilder : FormBuilder
  ) { }

  ngOnInit() {
    this.buildSubMenu()

    this.menuService.onSubmenuToggle().subscribe((value: NbMenuBag) => {
      if (value.item.children?.length) { return }
      this.publicApiService.getEntries(new HttpParams({
        fromObject: { category: value.item.title }
      })).subscribe((response) => {
        let items = response.entries.map((value) => this.createAPIMenuItem(value))
        value.item.children = items
      })
    })

    this.menuService.onItemClick().subscribe((value: NbMenuBag) => {
      console.log(this.container.nativeElement, value.item.data)
      if (value.item.data) {
        this.container.nativeElement.src = value.item.data
      }
    })
  }

  buildSubMenu() {
    this.publicApiService.getCategories().subscribe((response) => {
      let items = response.categories.map((category) => this.createSubMenuItem(category))
      this.items = items;
    })
  }

  createSubMenuItem(category: string): NbMenuItem {
    let item = new NbMenuItem()
    item.title = category
    item.children = []
    return item
  }

  createAPIMenuItem(value: APIResponse): NbMenuItem {
    let item = new NbMenuItem()
    item.title = value.API
    item.data = value.Link;
    if (value.Auth !== '' || value.HTTPS) {
      item.badge = {
        text: value.HTTPS ? (value.Auth ? `Https + ${value.Auth}` : 'Https') : value.Auth,
        status: value.Auth === 'apiKey' ? 'primary' : 'success'
      }
    }
    return item
  }

  onSubmit() {
    if (!this.searchForm.value.title) {
      this.buildSubMenu()
      return
    }
    this.publicApiService.getEntries(new HttpParams({
      fromObject: this.searchForm.value
    })).subscribe((response) => {
      let items = response.entries.map((value) => this.createAPIMenuItem(value))
      this.items = items
    })
    this.searchForm.reset()
  }
}
