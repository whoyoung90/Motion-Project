import { BaseComponent } from "./../component.js";
export class PageComponent extends BaseComponent<HTMLUListElement> {
  constructor() {
    // 상속하는 자식 클래스에서는 super를 이용해서 부모 클래스의 생성자를 호출!
    super(`<ul class="page">This is PageComponent</ul>`);
  }
}

// export class PageComponent {
//   private element: HTMLUListElement;

//   constructor() {
//     this.element = document.createElement("ul");
//     this.element.setAttribute("class", "page");
//     this.element.textContent = "This is PageComponent";
//   }

//   attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
//     parent.insertAdjacentElement(position, this.element);
//   }
// }
