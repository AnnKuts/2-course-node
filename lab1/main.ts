// as Theoden once said, "So it begins."
console.log("Hello, world by Ivan Fedorenko. All rights reserved.")

// as Marik once said, "+10, -10"
function MarikApp() {
  let score = 10;
  process.once("uncaughtException", (err) => {
    score = -10;
    console.error("Is that a head on your shoulders? Try using it.", err.message);
  });
  process.once("exit", () => {
    console.log(`Hello, world by Anna Vasylivna Kuts. All rights reserved. Your score: ${score}`);
  });
}

MarikApp();

