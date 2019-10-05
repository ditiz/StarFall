import "phaser";
import { getCookie } from "../tools";

export class GameScene extends Phaser.Scene {
    delta: number;
    lastStarTime: number;
    starsCaught: number;
    starsFallen: number;
    bestScore: number;
    sand: Phaser.Physics.Arcade.StaticGroup;
    info: Phaser.GameObjects.Text;
    infoBestScore: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(params): void {
        const bestScore = parseInt(getCookie("bestScore"));

        if (!bestScore && bestScore !== 0) {
            document.cookie = "bestScore=0";
        }

        this.delta = 1000;
        this.lastStarTime = this.starsCaught = this.starsFallen = 0;
        this.bestScore = bestScore ? bestScore : 0;
    }

    preload(): void {
        this.load.setBaseURL(
            "https://raw.githubusercontent.com/mariyadavydova/" +
                "starfall-phaser3-typescript/master/"
        );
        this.load.image("star", "assets/star.png");
        this.load.image("sand", "assets/sand.jpg");
    }

    create(): void {
        this.sand = this.physics.add.staticGroup({
            key: "sand",
            frameQuantity: 20
        });

        Phaser.Actions.PlaceOnLine(
            this.sand.getChildren(),
            new Phaser.Geom.Line(20, 580, 820, 580)
        );

        this.sand.refresh();

        const info =
            `${this.starsCaught} caught - ` + `${this.starsFallen} fallen`;

        this.info = this.add.text(10, 10, info, {
            font: "24px Arial Bold",
            fill: "#FBFBAC"
        });

        const textBestScore = `Best score: ${this.bestScore}`;
        this.infoBestScore = this.add.text(600, 10, textBestScore, {
            font: "24px Arial Bold",
            fill: "#FBFBAC"
        });
    }

    update(time: number): void {
        const diff: number = time - this.lastStarTime;

        if (diff > this.delta) {
            this.lastStarTime = time;
            if (this.delta > 500) {
                this.delta -= 20;
            }
            this.emitStar();
        }

        this.info.text =
            `${this.starsCaught} caught - ` + `${this.starsFallen} fallen`;

        this.infoBestScore.text = `Best score: ${this.bestScore}`;
    }

    private emitStar(): void {
        let star: Phaser.Physics.Arcade.Image;
        const x = Phaser.Math.Between(25, 775);
        const y = 26;

        star = this.physics.add.image(x, y, "star");

        star.setDisplaySize(50, 50);
        star.setVelocity(0, 200);
        star.setInteractive();
        star.on("pointerdown", this.onClick(star), this);

        this.physics.add.collider(
            star,
            this.sand,
            this.onFall(star),
            null,
            null
        );
    }

    private onClick(star: Phaser.Physics.Arcade.Image): () => void {
        return () => {
            star.setTint(0x00ff00);
            star.setVelocity(0);
            this.starsCaught += 1;
            this.time.delayedCall(100, star => star.destroy(), [star], this);

            if (this.starsCaught > this.bestScore) {
                this.bestScore = this.starsCaught;
            }
        };
    }

    private onFall(star: Phaser.Physics.Arcade.Image): () => void {
        return () => {
            star.setTint(0xff0000);
            this.starsFallen += 1;
            this.time.delayedCall(100, star => star.destroy(), [star], this);

            if (this.starsFallen >= 10) {
                this.scene.start("ScoreScene", {
                    starsCaught: this.starsCaught
                });
            }
        };
    }
}
