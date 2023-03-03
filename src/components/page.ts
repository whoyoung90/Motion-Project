export class PageComponent {
  private element: HTMLUListElement;
  constructor() {
    this.element = document.createElement("ul");
    this.element.setAttribute("class", "page");
    this.element.textContent = "This is PageComponent";
  }

  /**
   * PageComponent를 만드는 사람이 attachTo를 호출함으로써
   * 이 페이지를 추가하고 싶은 요소에 전달해주면, 함수가 알아서 페이지를 추가해준다.
   */
  attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
    parent.insertAdjacentElement(position, this.element);
  }
}
