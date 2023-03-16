export class ImageComponent {
  private element: HTMLElement;

  constructor(title: string, url: string) {
    const template = document.createElement("template");

    // 사용자에게 전달받은 데이터를 바로 innerHTML에 설정하는 것은 좋지 않고
    template.innerHTML = `<section class="image">
    <div class="image__holder"><img class="image__thumbnail"></div>
    <p class="image__title"></p>
  </section>`;
    this.element = template.content.firstElementChild! as HTMLElement; // firstElementChild는 Line 5~9

    const imageElement = this.element.querySelector(
      ".image__thumbnail"
    )! as HTMLImageElement;
    imageElement.src = url; // 필요한 부분만 업데이트
    imageElement.alt = title; // 필요한 부분만 업데이트

    const titleElement = this.element.querySelector(
      ".image__title"
    )! as HTMLParagraphElement;
    titleElement.textContent = title; // 필요한 부분만 업데이트
  }

  attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
    parent.insertAdjacentElement(position, this.element);
  }
}
