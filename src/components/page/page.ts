import { BaseComponent, Component } from "./../component.js";

export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;

class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements Composable
{
  private closeListener?: OnCloseListener;
  constructor() {
    super(`<li class="page-item">
            <section class="page-item__body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);
    const closeBtn = this.element.querySelector(".close")! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };
  }

  addChild(child: Component) {
    const container = this.element.querySelector(
      ".page-item__body"
    )! as HTMLElement;
    child.attachTo(container); // .page-item__body에다가 element를 붙인다
  }

  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }
}

export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  constructor() {
    // 상속하는 자식 클래스에서는 super를 이용해서 '부모 클래스의 생성자'를 호출!
    super(`<ul class="page"></ul>`);
  }

  addChild(section: Component) {
    const item = new PageItemComponent();
    item.addChild(section); // pageItem에 전달받은 section을 추가
    item.attachTo(this.element, "beforeend");
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
    });
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
