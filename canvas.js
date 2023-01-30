import { GlowParticle } from "glowerparticle";

const COLORS = [
	// { r: 8, g: 88, b: 255 }, // blue
	{ r: 2, g: 34, b: 102 }, // blue 2, 34, 102
	{ r: 120, g: 0, b: 142 }, // pupple rgb(120, 0, 142)
	{ r: 0, g: 0, b: 0 }, // black
	{ r: 98, g: 8, b: 1 }, // dark purple
	{ r: 8, g: 26, b: 255 }, // dark blue rgba(8, 26, 255, 1)
	{ r: 69, g: 23, b: 176 }, // dark purple rgba(69, 23, 176, 1)
];

class App {
	constructor() {
		this.canvas = document.createElement("canvas");
		document.body.prepend(this.canvas);
		this.ctx = this.canvas.getContext("2d");

		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

		this.totalParticles = 15;
		this.particles = [];
		this.maxRadius = 900;
		this.minRadius = 400;

		window.addEventListener("resize", this.resize.bind(this), false);
		this.resize();

		window.requestAnimationFrame(this.animate.bind(this));
	}

	resize() {
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;
		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		// this.ctx.globalCompositeOperation = "saturation"

		this.createParticles();
	}

	createParticles() {
		let curColor = 0;
		this.particles = [];

		for (let i = 0; i < this.totalParticles; i++) {
			const item = new GlowParticle(
				Math.random() * this.stageWidth,
				Math.random() * this.stageHeight,
				Math.random() * (this.maxRadius - this.minRadius) +
					this.minRadius,
				COLORS[curColor]
			);

			if (++curColor >= COLORS.length) {
				curColor = 0;
			}

			this.particles[i] = item;
		}
	}

	animate() {
		window.requestAnimationFrame(this.animate.bind(this));

		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

		for (let i = 0; i < this.totalParticles; i++) {
			const item = this.particles[i];
			item.animate(this.ctx, this.stageWidth, this.stageHeight);
		}
	}
}

window.onload = () => {
	new App();
};
