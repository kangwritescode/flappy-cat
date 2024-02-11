"use client";

// components/Game.tsx
import { useEffect } from "react";
import Matter from "matter-js";

const Game: React.FC = () => {
  useEffect(() => {
    // Engine setup
    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 1200,
        height: 700,
        wireframes: false,
      },
    });

    // Gravity adjustment for the game feel
    engine.world.gravity.y = 1;

    // Bird
    const bird = Matter.Bodies.circle(150, 300, 20, {
      density: 0.04,
      restitution: 0.6,
    });

    // Walls
    const ground = Matter.Bodies.rectangle(400, 590, 810, 60, {
      isStatic: true,
    });
    const ceiling = Matter.Bodies.rectangle(400, 10, 810, 60, {
      isStatic: true,
    });

    // Add bird and walls to the world
    Matter.World.add(engine.world, [bird, ground, ceiling]);

    // Mouse click event to apply force to the bird
    const handleClick = () => {
      // Apply an upward force
      Matter.Body.setVelocity(bird, { x: 0, y: -10 });
    };

    window.addEventListener("click", handleClick);

    // Run the engine and renderer
    Matter.Engine.run(engine);
    Matter.Render.run(render);

    // Generate pipes
    const generatePipes = () => {
      const gapHeight = 150; // Constant gap size between the pipes
      const minHeight = 50; // Minimum height of a pipe to ensure the gap is not too low or high
      const maxHeight = 450; // Maximum height of a pipe to ensure the gap is within the game area

      // Randomize the gap starting position, ensuring it stays within reasonable bounds
      const gapPosition =
        Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

      // Calculate the top and bottom pipe heights
      const topPipeHeight = gapPosition;
      const bottomPipeHeight = 600 - gapHeight - topPipeHeight; // Canvas height minus gapHeight and topPipeHeight

      // Create the top pipe
      let topPipe = Matter.Bodies.rectangle(
        1000,
        topPipeHeight / 2,
        50,
        topPipeHeight,
        {
          isStatic: true,
          label: "pipe",
        },
      );

      // Create the bottom pipe
      let bottomPipe = Matter.Bodies.rectangle(
        1000,
        600 - bottomPipeHeight / 2,
        50,
        bottomPipeHeight,
        {
          isStatic: true,
          label: "pipe",
        },
      );

      // Add both pipes to the world
      Matter.World.add(engine.world, [topPipe, bottomPipe]);
    };

    setInterval(generatePipes, 3000);

    // Move pipes leftward to simulate forward motion in the game
    setInterval(() => {
      Matter.Composite.allBodies(engine.world).forEach((body) => {
        if (body.label === "pipe") {
          Matter.Body.translate(body, { x: -5, y: 0 }); // Adjust speed as necessary

          // Optional: Remove pipes that are off-screen to the left
          if (body.position.x < -50) {
            Matter.World.remove(engine.world, body);
          }
        }
      });
    }, 1000 / 60); // Run at approximately 60 fps for smoother animation

    return () => {
      // Cleanup on component unmount
      Matter.Engine.clear(engine);
      Matter.Render.stop(render);
      render.canvas.remove();
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return <div />;
};

export default Game;
