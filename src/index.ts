import './styles/index.scss';
import Kernel from './os/Kernel';
import Process from "./os/Process";
import {Window, WindowStyle} from "./os/croakers/desktop/Window";

Kernel.kernel.croak();

class BootProcess extends Process {
    private _window: Window;
    private _frame: number;

    constructor(x: number, y:number) {
        super();

        this._window = new Window(this.pid, {
            style: WindowStyle.Bordered,
            onDraw: this.onDraw.bind(this),
            name: 'BootProcess',
            width: 500,
            height: 400,
            x: x,
            y: y,
        });

        this._window.isShow = true;

        this._frame = 1;
    }

    private onDraw(context: CanvasRenderingContext2D, delta: number): void {
        this._frame = this._frame + delta / 10;
        const x = Math.sin(this._frame / 180 * Math.PI) * 100 + 225;
        const y = -Math.cos(this._frame / 180 * Math.PI) * 100 + 175;

        context.fillStyle = 'blue';
        context.fillRect(x, y, 50, 50);
    }
}

class Boot2Process extends Process {
    private _window: Window;
    private _frame: number;

    constructor(x: number, y:number) {
        super();

        this._window = new Window(this.pid, {
            style: WindowStyle.Bordered,
            onDraw: this.onDraw.bind(this),
            name: 'BootProcess',
            width: 500,
            height: 400,
            x: x,
            y: y,
        });

        this._window.isShow = true;

        this._frame = 1;
    }

    private onDraw(context: CanvasRenderingContext2D, delta: number): void {
        this._frame = this._frame + delta / 5;
        const x = Math.sin(this._frame / 180 * Math.PI) * 100 + 225;
        const y = Math.cos(this._frame / 180 * Math.PI) * 100 + 175;

        context.fillStyle = `rgb(${Math.sin(this._frame / 180 * Math.PI) * 255}, 255, ${Math.cos(this._frame / 180 * Math.PI + 90) * 255})`;
        context.fillRect(x, y, 50, 50);
    }
}

new BootProcess(20, 20);
new Boot2Process(560, 20);