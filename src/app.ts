import { Component } from "./components/component.js";
import {
  Composable,
  PageComponent,
  PageItemComponent,
} from "./components/page/page.js";
import { ImageComponent } from "./components/page/item/image.js";
import { VideoComponent } from "./components/page/item/video.js";
import { NoteComponent } from "./components/page/item/note.js";
import { TodoComponent } from "./components/page/item/todo.js";
import { InputDialog } from "./components/dialog/dialog.js";
import { MediaSectionInput } from "./components/dialog/input/media-input.js";
import { TextSectionInput } from "./components/dialog/input/text-input.js";

// 확장자가 page.ts가 아닌 page.js인 이유?
// 웹팩과 같은 번들러를 쓰면 파일 확장자명을 생략할 수 있어요:)
// 현재 우리 프로젝트는 별도의 번들러를 사용하지 않고, 브라우저에서 동작하는 ES6 모듈을 사용하기 때문에 .js를 붙여줘야 한다
// 타입스크립트는 js로 컴파일시 import하는 경로는 변경하지 않아요

class App {
  // private readonly page: PageComponent;
  private readonly page: Component & Composable; // 나중에 PageComponent를 외부에서 받아올 수 있으므로

  // appRoot는 곧 document.querySelector(".document")
  constructor(appRoot: HTMLElement, dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent); // PageItemComponent는 SectionContainerConstructor 타입!
    this.page.attachTo(appRoot); // appRoot에 page element를 붙여준다!

    // const image = new ImageComponent(
    //   "Image Title",
    //   "https://picsum.photos/600/300"
    // );
    // // image.attachTo(appRoot, "beforeend"); // appRoot에 image element를 붙여준다!
    // this.page.addChild(image);

    // const video = new VideoComponent(
    //   "Video Title",
    //   "https://youtu.be/K3-jG52XwuQ"
    // );
    // // video.attachTo(appRoot, "beforeend");
    // this.page.addChild(video);

    // const note = new NoteComponent("Note Title", "Note Body");
    // // note.attachTo(appRoot, "beforeend");
    // this.page.addChild(note);

    // const todo = new TodoComponent("Todo Title", "Todo Item");
    // // todo.attachTo(appRoot, "beforeend");
    // this.page.addChild(todo);

    const imageBtn = document.querySelector("#new-image")! as HTMLButtonElement;
    imageBtn.addEventListener("click", () => {
      const dialog = new InputDialog();
      const inputSection = new MediaSectionInput();

      dialog.addChild(inputSection); // #dialog__body에 MediaSectionInput을 붙여주고 ✨
      dialog.attachTo(dialogRoot); // document.body에 #dialog__body를 붙인다! ✨

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(dialogRoot);
      });
      dialog.setOnSubmitListener(() => {
        const image = new ImageComponent(inputSection.title, inputSection.url);
        this.page.addChild(image);
        dialog.removeFrom(dialogRoot);
      });
    });

    const videoBtn = document.querySelector("#new-video")! as HTMLButtonElement;
    videoBtn.addEventListener("click", () => {
      const dialog = new InputDialog();
      const inputSection = new MediaSectionInput();

      dialog.addChild(inputSection); // #dialog__body에 MediaSectionInput을 붙여주고 ✨
      dialog.attachTo(dialogRoot); // document.body에 #dialog__body를 붙인다! ✨

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(dialogRoot);
      });
      dialog.setOnSubmitListener(() => {
        const image = new VideoComponent(inputSection.title, inputSection.url);
        this.page.addChild(image);
        dialog.removeFrom(dialogRoot);
      });
    });

    const noteBtn = document.querySelector("#new-note")! as HTMLButtonElement;
    noteBtn.addEventListener("click", () => {
      const dialog = new InputDialog();
      const inputSection = new TextSectionInput();

      dialog.addChild(inputSection); // #dialog__body에 MediaSectionInput을 붙여주고 ✨
      dialog.attachTo(dialogRoot); // document.body에 #dialog__body를 붙인다! ✨

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(dialogRoot);
      });
      dialog.setOnSubmitListener(() => {
        const image = new NoteComponent(inputSection.title, inputSection.body);
        this.page.addChild(image);
        dialog.removeFrom(dialogRoot);
      });
    });

    const todoBtn = document.querySelector("#new-todo")! as HTMLButtonElement;
    todoBtn.addEventListener("click", () => {
      const dialog = new InputDialog();
      const inputSection = new TextSectionInput();

      dialog.addChild(inputSection); // #dialog__body에 MediaSectionInput을 붙여주고 ✨
      dialog.attachTo(dialogRoot); // document.body에 #dialog__body를 붙인다! ✨

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(dialogRoot);
      });
      dialog.setOnSubmitListener(() => {
        const image = new TodoComponent(inputSection.title, inputSection.body);
        this.page.addChild(image);
        dialog.removeFrom(dialogRoot);
      });
    });
  }
}

new App(document.querySelector(".document")! as HTMLElement, document.body); // type assertion

/**
 * @description
 * private readonly page: PageComponent -> Component & Composable 변경 이유?
 *
 * 현재 코드에서는 충분히 PageComponent라고 사용해도 괜찮아요.
 * 하지만 미래의 확장성을 생각해 보았을때
 * 타입을 PageComponent라고 한다면, 항상 page는 PageComponent여야 합니다.
 * 우리의 문서는 딱 하나의 PageComponent만 페이지로 가지고 있을 수 있겠죠?
 *
 * 그런데 Component & Composable 컴포넌트 이면서 또 다른 자식 요소를 추가 할 수 있는
 * Composable 인터페이스를 구현한 어떤 타입! 이라고 명시 해두면
 *
 * 나중에 그것을 구현 & 상속하는
 * FancyPageComponent, DarkPageComponent, LightThemePageComponent 등
 * 다양한 페이지 컴포넌트를 할당할 수 있기 때문!
 */
