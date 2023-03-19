// interface를 규격화하여 => 사용하는 곳에서는 Component타입만 사용하도록!
export interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
}

/**
 * Encapsulate the HTML element creation
 */
export class BaseComponent<T extends HTMLElement> implements Component {
  protected readonly element: T;

  // 생성자 안에서 우리가 원하는 DOM 요소를 만들어준다
  constructor(htmlString: string) {
    const template = document.createElement("template");
    template.innerHTML = htmlString;
    this.element = template.content.firstElementChild! as T;
  }

  // 전달받은 parent(=appRoot) 요소에 우리가 만든 DOM 요소를 붙여주는 함수
  // position에 아무것도 전달하지 않으면 "afterbegin"이 기본값 (Default parameter)
  attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
    parent.insertAdjacentElement(position, this.element);
  }
}
