/* @jsxImportSource solid-js */
import { r, initialize } from "./common/render";
import "./main.css";
import { Download } from "./ui/download";

async function init() {
	// TODO: we dont have to actually await this, right
	await initialize();
	r(() => <Download />);
}

init();
