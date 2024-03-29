import { BaseComponent } from "./../../component.js";
export class ImageComponent extends BaseComponent<HTMLElement> {
  // 자식 생성자 title, url
  constructor(title: string, url: string) {
    // super를 이용해서 부모 클래스의 생성자 htmlString 호출 (this.element가 준비됨!)
    super(`<section class="image">
            <div class="image__holder"><img class="image__thumbnail"></div>
            <h2 class="page-item__title image__title"></h2>
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

//     template.innerHTML = `<section class="image">
//     <div class="image__holder"><img class="image__thumbnail"></div>
//     <p class="image__title"></p>
//   </section>`;

//     this.element = template.content.firstElementChild! as HTMLElement; // firstElementChild는 Line 30~33

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

//   // position에 아무것도 전달하지 않으면 "afterbegin"이 기본값 (Default parameter)
//   attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
//     parent.insertAdjacentElement(position, this.element);
//   }
// }
