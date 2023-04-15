import { BaseComponent, Component } from "./../component.js";

/**
 * PageItemComponent, PageComponent에 공통적인 요소가 있다면
 * 그 요소는 "어떤 interface를 규격한다"라고 생각해볼 수 있다!
 */
export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;

/**
 * 아무것도 전달받지 않는 생성자 new ()인데
 * 이 생성자가 호출이 되면 "SectionContainer 인터페이스 규격"을 따라가는
 * 그 어떤 클래스라도 이 타입에 맞게 된다.
 */
type SectionContainerConstructor = {
  new (): SectionContainer;
};

/**
 * image, note, todo, video등을 감쌀 수 있는 컨테이너는(PageItemComponent)
 * Component, Composable 인터페이스를 구현해야하고
 * setOnCloseListener API가 반드시 있어야 한다!
 */
interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
}

/* implements Composable 대신 implements SectionContainer 쓰는 이유 */
// DarkPageItemComponent extends BaseComponent<HTMLElement> implements SectionContainer
// WhitePageItemComponent extends BaseComponent<HTMLElement> implements SectionContainer
export class PageItemComponent
  extends BaseComponent<HTMLElement>
  // implements Composable
  implements SectionContainer
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
      this.closeListener && this.closeListener(); // () => { item.removeFrom(this.element) }
    };
  }

  // child에 어떤 컴포넌트가 들어올지 모르지만(image, note, todo, video)
  addChild(child: Component) {
    const container = this.element.querySelector(
      ".page-item__body"
    )! as HTMLElement;
    child.attachTo(container); // .page-item__body에 (child) element를 붙여준다!
  }

  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }
}

export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super(`<ul class="page"></ul>`);
  }

  // section(image, note, todo, video)
  addChild(section: Component) {
    // const item = new PageItemComponent(); // 내부에서 한가지 클래스만 만드는 것이 아니라
    const item = new this.pageItemConstructor(); // 외부에서 전달된 pageItemConstructor를 이용

    item.addChild(section); // .page-item__body에 전달받은 section element를 붙여주고 ✨
    item.attachTo(this.element, "beforeend"); // PageComponent에 PageItem을 붙인다! ✨
    item.setOnCloseListener(() => {
      item.removeFrom(this.element); // PageComponent로부터
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
