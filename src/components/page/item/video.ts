import { BaseComponent } from "./../../component.js";
export class VideoComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, url: string) {
    super(`<section class="video">
            <div class="video__player">
              <iframe class="video__iframe"></iframe>
            </div>
            <h3 class="video__title"></h3>
          </section>`);

    const iframe = this.element.querySelector(
      ".video__iframe"
    )! as HTMLIFrameElement;
    iframe.src = "https://www.youtube.com/embed/K3-jG52XwuQ"; // url -> videoId -> embed
    console.log(url);

    const titleElement = this.element.querySelector(
      ".video__title"
    )! as HTMLHeadingElement;
    titleElement.textContent = title;
  }
}

// <iframe
//   width="950"
//   height="534"
//   src="https://www.youtube.com/embed/K3-jG52XwuQ"
//   title="10 시간의 잔잔한 수면음악, 잔잔한 빗소리, 스트레스 해소음악, 불면증 치료"
//   frameborder="0"
//   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//   allowfullscreen
// ></iframe>;
