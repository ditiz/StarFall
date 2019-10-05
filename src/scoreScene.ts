import "phaser";
import { getCookie } from "../tools";

export class ScoreScene extends Phaser.Scene {
    score: number;
    title: Phaser.GameObjects.Text;
    hint: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: "ScoreScene"
        });
    }

    init(params): void {
        this.score = params.starsCaught;

        const bestScore = parseInt(getCookie("bestScore"));

        if (this.score > bestScore) {
            document.cookie = `bestScore=${this.score};`;
        }
    }

    create(): void {
        const titleText = `Your score is ${this.score} !`;

        this.title = this.add.text(220, 200, titleText, {
            font: "48px Arial Bold",
            fill: "#FBFBAC"
        });

        const hintText = "Click to restart";

        this.hint = this.add.text(300, 350, hintText, {
            font: "24px Arial Bold",
            fill: "#FFBFAC"
        });

        this.input.on("pointerdown", () => {
            this.scene.start("GameScene");
        });
    }
}
