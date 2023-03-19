import { BaseComponent } from "./../../component.js";
export class ImageComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, url: string) {
    super(`<section class="image">
    <div class="image__holder"><img class="image__thumbnail"></div>
    <p class="image__title"></p>
  </section>`);

    const imageElement = this.element.querySelector(
      ".image__thumbnail"
    )! as HTMLImageElement;
    imageElement.src = url;
    imageElement.alt = title;

    const titleElement = this.element.querySelector(
      ".image__title"
    )! as HTMLParagraphElement;
    titleElement.textContent = title;
  }
}

// export class ImageComponent {
//   private element: HTMLElement;

//   constructor(title: string, url: string) {
//     const template = document.createElement("template");

//     // 사용자에게 전달받은 데이터를 innerHTML에 ${title}처럼 바로 설정하는 것은 위험하므로
//     template.innerHTML = `<section class="image">
//     <div class="image__holder"><img class="image__thumbnail"></div>
//     <p class="image__title"></p>
//   </section>`;

//     // template안의 요소에 접근해서 필요한 부분만 업데이트! (url, title)
//     this.element = template.content.firstElementChild! as HTMLElement; // firstElementChild는 Line 29~32

//     const imageElement = this.element.querySelector(
//       ".image__thumbnail"
//     )! as HTMLImageElement;
//     imageElement.src = url;
//     imageElement.alt = title;

//     const titleElement = this.element.querySelector(
//       ".image__title"
//     )! as HTMLParagraphElement;
//     titleElement.textContent = title;
//   }

//   attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
//     parent.insertAdjacentElement(position, this.element);
//   }
// }
