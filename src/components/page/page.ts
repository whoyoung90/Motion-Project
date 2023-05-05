import { BaseComponent, Component } from "./../component.js";

/**
 * PageItemComponent, PageComponent에 공통적인 요소가 있다면
 * 그 요소는 "어떤 interface를 규격한다"라고 생각해볼 수 있다!
 */
export interface Composable {
  addChild(child: Component): void;
}

type OnCloseListener = () => void;

// 드래깅 컴포넌트 입장(start, stop) | 남아있는 컴포넌트 입장(enter, leave)
type DragState = "start" | "stop" | "enter" | "leave";
type OnDragStateListener<T extends Component> = (
  target: T, // 드래깅 타깃
  state: DragState // 드래깅 상태
) => void;

/**
 * @decription new () 생성자 타입 ⭐️
 * 아무것도 전달받지 않는 생성자인데
 * 이 생성자가 호출이 되면 "SectionContainer 인터페이스 규격"을 따라가는 어떤 클래스라도 괜찮다!
 */
type SectionContainerConstructor = {
  new (): SectionContainer; // 생성자를 정의하는 타입
};

/**
 * @decription Dependency Injection 리펙터링
 * 어떤 방식으로 PageItemComponent UI를 만들든 상관없지만 (DarkPageItemComponent, WhitePageItemComponent)
 * Component, Composable 인터페이스를 구현하고
 * setOnCloseListener는 공통으로 반드시 구현해야한다!
 */
interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
  muteChildren(state: "mute" | "unmute"): void;
  getBoundingRect(): DOMRect;
  onDropped(): void;
}

/**
 * @decription implements SectionContainer
 * - Component: BaseComponent에서 구현
 * - Composable, setOnCloseListener: 코드내 구현
 */
export class PageItemComponent
  extends BaseComponent<HTMLElement>
  // implements Composable
  implements SectionContainer
{
  private closeListener?: OnCloseListener; // 외부로부터 전달받을 콜백함수를 저장
  private dragStateListener?: OnDragStateListener<PageItemComponent>;

  constructor() {
    // super에서 element가 동적으로 생성
    super(`<li draggable="true" class="page-item">
            <section class="page-item__body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
          </li>`);

    const closeBtn = this.element.querySelector(".close")! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };

    this.element.addEventListener("dragstart", (event: DragEvent) => {
      this.onDragStart(event);
    });
    this.element.addEventListener("dragend", (event: DragEvent) => {
      this.onDragEnd(event);
    });
    this.element.addEventListener("dragenter", (event: DragEvent) => {
      this.onDragEnter(event);
    });
    this.element.addEventListener("dragleave", (event: DragEvent) => {
      this.onDragLeave(event);
    });
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

  onDragStart(_: DragEvent) {
    this.notifyDragObservers("start");
    this.element.classList.add("lifted");
  }
  onDragEnd(_: DragEvent) {
    this.notifyDragObservers("stop");
    this.element.classList.remove("lifted");
  }
  onDragEnter(_: DragEvent) {
    this.notifyDragObservers("enter");
    this.element.classList.add("drop-area");
  }
  onDragLeave(_: DragEvent) {
    this.notifyDragObservers("leave");
    this.element.classList.remove("drop-area");
  }
  onDropped() {
    this.element.classList.remove("drop-area");
  }

  setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
    this.dragStateListener = listener;
  }
  notifyDragObservers(state: DragState) {
    this.dragStateListener && this.dragStateListener(this, state); // target은 해당 컴포넌트 자신 this
  }

  muteChildren(state: "mute" | "unmute") {
    if (state === "mute")
      this.element.classList.add("mute-children"); // pointer-events: none;
    else this.element.classList.remove("mute-children");
  }

  getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}

/**
 * @description PageComponent는
 * SectionContainer라는 인터페이스의 규격을 따라가는 그 어떤 클래스라도 추가할 수 있는
 * 확장성 있는 클래스가 되었다!
 */
export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable
{
  private children = new Set<SectionContainer>(); // Map과 달리 Set은 중복된 데이터를 가질 수 없는 자료구조!
  private dropTarget?: SectionContainer;
  private dragTarget?: SectionContainer;

  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super(`<ul class="page"></ul>`);

    this.element.addEventListener("dragover", (event: DragEvent) => {
      this.onDragOver(event);
    });
    this.element.addEventListener("drop", (event: DragEvent) => {
      this.onDrop(event);
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Define a drop zone (MDN)
    console.log("onDragOver (PageComponent)");
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    console.log("drop (PageComponent)");

    /* 여기에서 위치 변경 */
    if (!this.dropTarget) return;
    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY;
      const srcElement = this.dragTarget.getBoundingRect();

      this.dragTarget.removeFrom(this.element); // dragTarget 컴포넌트를 PageComponent에서 제거하고
      this.dropTarget.attach(
        this.dragTarget,
        dropY < srcElement.y ? "beforebegin" : "afterend"
      );
    }
    this.dropTarget.onDropped(); // drop시 leave가 발생하지 않는 이슈 해결
  }

  // section(image, note, todo, video)
  addChild(section: Component) {
    // const item = new PageItemComponent(); // 정해진 하나의 클래스만 만드는 것이 아니라
    const item = new this.pageItemConstructor(); // 외부에서 전달된 pageItemConstructor를 이용 (확장성)

    item.addChild(section); // .page-item__body에 전달받은 section element를 붙여주고 ✨
    item.attachTo(this.element, "beforeend"); // PageComponent에 PageItem을 붙인다! ✨
    item.setOnCloseListener(() => {
      item.removeFrom(this.element); // PageComponent로부터 PageItem을 제거
      this.children.delete(item);
    });

    this.children.add(item);

    item.setOnDragStateListener(
      (target: SectionContainer, state: DragState) => {
        console.log(target, state);
        switch (state) {
          case "start":
            this.dragTarget = target;
            this.updateSections("mute"); // 드래깅이 시작되면 모든 포인터를 음소거 (pointer-events: none;)
            break;
          case "stop":
            this.dragTarget = undefined;
            this.updateSections("unmute"); // 드래깅이 끝나면 음소거 해제
            break;
          case "enter":
            this.dropTarget = target;
            break;
          case "leave":
            this.dropTarget = undefined;
            break;
          default:
            throw new Error(`unsupported state: ${state}`);
        }
      }
    );
  }

  private updateSections(state: "mute" | "unmute") {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state); // section이 가지고있는 모든 자식요소들의 포인터를 음소거
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
