import { PageComponent } from "./components/page.js";
// 웹팩과 같은 번들러를 쓰면 확장자명을 생략할 수 있어요:)
// 현재 우리 프로젝트는 별도의 번들러를 사용하지 않고, 브라우저에서 동작하는 ES6 모듈을 사용하기 때문에 .js를 붙여줘야 한다
// 타입스크립트는 js로 컴파일시 import하는 경로는 변경하지 않아요

class App {
  private readonly page: PageComponent;
  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent();
    this.page.attachTo(appRoot);
  }
}

new App(document.querySelector(".document")! as HTMLElement); // type assertion
