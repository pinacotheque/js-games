let move_speed = 3;
let gravity = 0.5;
let bird = document.querySelector(".bird");

// bird element properties
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector(".background").getBoundingClientRect();

// get score properties
let score_val = document.querySelector(".score_val");
let score_title = document.querySelector(".score_title");
let message = document.querySelector(".message");

// game state
let game_state = "Start";

// event listener for key press
document.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && game_state != "Play") {
        document.querySelectorAll(".pipe_stripe").forEach((e) => {
            e.remove();
        });
        bird.style.top = "40vh";
        game_state = "Play";
        message.innerHTML = "";
        score_title.innerHTML = "Score: ";
        score_val.innerHTML = "0";
        play();
    }
});

function play() {
    function move() {
        if (game_state != "Play") return;

        let pipe_stripe = document.querySelectorAll(".pipe_stripe");
        pipe_stripe.forEach((element) => {
            let pipe_stripe_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            //  delete pipes if they're not in the screen anymore
            if (pipe_stripe_props.right <= 0) {
                element.remove();
            } else {
                // collision detection with bird and pipes
                if (
                    bird_props.left < pipe_stripe_props.left +
                    pipe_stripe_props.width &&
                    bird_props.left +
                    bird_props.width > pipe_stripe_props.left &&
                    bird_props.top < pipe_stripe_props.top +
                    pipe_stripe_props.height &&
                    bird_props.top +
                    bird_props.height > pipe_stripe_props.top
                ) {

                    // Change game state and end the game
                    // if collision occurs
                    game_over()
                } else {
                    // increase the score if successfully passed
                    if (
                        pipe_stripe_props.right < bird_props.left &&
                        pipe_stripe_props.right + move_speed >= bird_props.left &&
                        element.increase_score == "1"
                    ) {
                        score_val.innerHTML = +score_val.innerHTML + 1;
                    }
                    element.style.left = pipe_stripe_props.left - move_speed + "px";
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;

    function apply_gravity() {
        if (game_state != "Play") return;
        bird_dy = bird_dy + gravity;
        document.addEventListener("keydown", (e) => {
            if (e.key == "Space" || e.key == " ") {
                bird_dy = -7.6;
            }
        });

        // collision check with floor and ceiling
        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            game_over()
        }
        bird.style.top = bird_props.top + bird_dy + "px";
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);
    let pipe_seperation = 0;

    // Gap between pipes

    let pipe_gap = 45;

    function create_pipe() {
        if (game_state != "Play") return;

        // create set of pipes
        // if distance btw 2 pipe has exceeded a predefined value

        if (pipe_seperation > 115) {
            pipe_seperation = 0;

            //  Calculate random position of pipes in y-axis

            let pipe_position = Math.floor(Math.random() * 43) + 8;
            let pipe_stripe_inv = document.createElement("div");
            pipe_stripe_inv.className = "pipe_stripe";
            pipe_stripe_inv.style.top = pipe_position - 70 + "vh";
            pipe_stripe_inv.style.left = "100vw";

            document.body.appendChild(pipe_stripe_inv);

            let pipe_stripe = document.createElement("div");
            pipe_stripe.className = "pipe_stripe";
            pipe_stripe.style.top = pipe_position + pipe_gap + "vh";
            pipe_stripe.style.left = "100vw";
            pipe_stripe.increase_score = "1";

            // Append the created pipe element in DOM
            document.body.appendChild(pipe_stripe);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);

    function game_over() {
        game_state = 'End';
        message.innerHTML = 'Game Over! Press Enter to Restart';
        return;
    }
}
