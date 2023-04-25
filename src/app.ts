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
// 웹팩과 같은 번들러를 쓰면 파일 확장자명을 생략할 수 있지만
// 현재 별도의 번들러를 사용하지 않고, 브라우저에서 동작하는 ES6 모듈을 사용하기 때문에 .js를 붙여줘야 한다

type InputComponentConstructor<T = MediaSectionInput | TextSectionInput> = {
  new (): T; // new라는 아무것도 전달받지 않는 생성자를 T타입으로
};

class App {
  // private readonly page: PageComponent;
  private readonly page: Component & Composable; // 나중에 PageComponent를 외부에서 받아올 수 있으므로

  // appRoot: document.querySelector(".document"), dialogRoot: document.body
  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent); // PageItemComponent는 SectionContainerConstructor 타입!
    this.page.attachTo(appRoot); // appRoot에 page element를 붙여준다!

    // const image = new ImageComponent(
    //   "Image Title",
    //   "https://picsum.photos/600/300"
    // );
    // this.page.addChild(image);

    // const video = new VideoComponent(
    //   "Video Title",
    //   "https://youtu.be/K3-jG52XwuQ"
    // );
    // this.page.addChild(video);

    // const note = new NoteComponent("Note Title", "Note Body");
    // this.page.addChild(note);

    // const todo = new TodoComponent("Todo Title", "Todo Item");
    // this.page.addChild(todo);

    this.bindElementToDialog<MediaSectionInput>(
      "#new-image",
      MediaSectionInput,
      (input: MediaSectionInput) => new ImageComponent(input.title, input.url)
    );
    // const imageBtn = document.querySelector("#new-image")! as HTMLButtonElement;
    // imageBtn.addEventListener("click", () => {
    //   const dialog = new InputDialog();
    //   const inputSection = new MediaSectionInput();

    //   dialog.addChild(inputSection); // #dialog__body에 MediaSectionInput을 붙여주고 ✨
    //   dialog.attachTo(dialogRoot); // document.body에 #dialog__body를 붙인다! ✨

    //   dialog.setOnCloseListener(() => {
    //     dialog.removeFrom(dialogRoot);
    //   });
    //   dialog.setOnSubmitListener(() => {
    //     const image = new ImageComponent(inputSection.title, inputSection.url);
    //     this.page.addChild(image);
    //     dialog.removeFrom(dialogRoot);
    //   });
    // });

    this.bindElementToDialog<MediaSectionInput>(
      "#new-video",
      MediaSectionInput,
      (input: MediaSectionInput) => new VideoComponent(input.title, input.url)
    );

    this.bindElementToDialog<TextSectionInput>(
      "#new-note",
      TextSectionInput,
      (input: TextSectionInput) => new NoteComponent(input.title, input.body)
    );

    this.bindElementToDialog<TextSectionInput>(
      "#new-todo",
      TextSectionInput,
      (input: TextSectionInput) => new TodoComponent(input.title, input.body)
    );

    // For demo :)
    this.page.addChild(
      new ImageComponent("Image Title", "https://picsum.photos/800/400")
    );
    this.page.addChild(
      new VideoComponent("Video Title", "https://youtu.be/K3-jG52XwuQ")
    );
    this.page.addChild(
      new NoteComponent("Note Title", "Don't forget to code your dream")
    );
    this.page.addChild(new TodoComponent("Todo Title", "TypeScript Course!"));
  }

  private bindElementToDialog<T extends MediaSectionInput | TextSectionInput>(
    selector: string,
    InputComponent: InputComponentConstructor<T>,
    makeSection: (input: T) => Component
  ) {
    const element = document.querySelector(selector)! as HTMLButtonElement;
    element.addEventListener("click", () => {
      const dialog = new InputDialog();
      const input = new InputComponent();

      dialog.addChild(input); // #dialog__body에 MediaSectionInput을 붙여주고 ✨
      dialog.attachTo(this.dialogRoot); // document.body에 #dialog__body를 붙인다! ✨

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(this.dialogRoot);
      });
      dialog.setOnSubmitListener(() => {
        const image = makeSection(input);
        this.page.addChild(image);
        dialog.removeFrom(this.dialogRoot);
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
