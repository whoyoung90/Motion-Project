export class PageComponent {
  private element: HTMLUListElement; // 카드들의 목록을 담으므로 ul
  constructor() {
    this.element = document.createElement("ul");
    this.element.setAttribute("class", "page");
    this.element.textContent = "This is PageComponent";
  }

  /**
   * 외부에서 사용할 수 있는 attachTo.
   * PageComponent를 만드는 사람이 attachTo를 호출함으로써
   * 이 페이지에 추가하고 싶은 요소를 전달해주면, 함수 내부적으로 페이지를 추가해준다.
   *
   * position에 아무것도 전달하지 않으면 기본적으로 "afterbegin"
   */
  attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
    parent.insertAdjacentElement(position, this.element);
  }
}
