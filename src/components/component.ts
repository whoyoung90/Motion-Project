/**
 * attachTo 함수를 인터페이스로 규격해둠으로써
 * 추후에 BaseComponent가 아니라, 다른 FlexibleComponent 등등 어딘가에
 * attchTo 함수를 구현하는 다른 종류의 클래스를 만들 수 있다!
 */
export interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
  removeFrom(parent: HTMLElement): void;

  attach(component: Component, position?: InsertPosition): void;
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
    this.element = template.content.firstElementChild! as T; // type assertion (null이 아닌 Element다)
  }

  // 전달받은 parent(=appRoot) 요소에 우리가 만든 DOM 요소를 붙여주는 함수
  attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
    parent.insertAdjacentElement(position, this.element);
  }

  removeFrom(parent: HTMLElement) {
    if (parent !== this.element.parentElement) {
      throw new Error("Parent mismatch!");
    }
    parent.removeChild(this.element);
  }

  attach(component: Component, position?: InsertPosition) {
    // 전달받은 컴포넌트(dragTarget)를 나 자신(element) 안에다가 붙여줌
    component.attachTo(this.element, position);
  }
}
