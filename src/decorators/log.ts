/**
 * @description Decorators
 * 기존의 함수나 클레스를 한 단계 감싸 꾸며줄 수 있는 Wrapper Class를 만들 수 있다.
 * "@"와 같은 annotation을 활용하여 우리가 원하는 곳에서 "재사용" 할 수 있다.
 */
function Log(
  _: any,
  name: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const newDescriptor = {
    ...descriptor,
    value: function (...args: any[]): any {
      console.log(`Calling ${name} with arguments:`);
      console.dir(args);
      const result = descriptor.value.apply(this, args);
      console.log(`Result:`);
      console.dir(result);
      return result;
    },
  };

  return newDescriptor;
}

class Calculator {
  @Log
  add(x: number, y: number): number {
    return x + y;
  }
}

const calculator = new Calculator();
console.log(calculator.add(1, 2));
