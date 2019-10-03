import "phaser";

export class WelcomeScene extends Phaser.Scene {
    title: Phaser.GameObjects.Text;
    hint: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: "WelcomeScene"
        });
    }

    create(): void {
        const titleText = "StarFall";

        this.title = this.add.text(175, 200, titleText, {
            font: "128px Arial Bold",
            fill: "#FBFBAC"
        });

        const hintText = "Click to Start";

        this.hint = this.add.text(300, 350, hintText, {
            font: "24px Arial Bold",
            fill: "#FFBFAC"
        });

        this.input.on("pointerdown", () => {
            this.scene.start("GameScene");
        });
    }
}
