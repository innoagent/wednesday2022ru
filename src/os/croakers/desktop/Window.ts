import Kernel from "../../Kernel";
import {v4 as uuid} from 'uuid';

type DrawEvent = (canvas: CanvasRenderingContext2D, delta: number) => void;

export enum WindowStyle {
    Fullscreen = 'fullscreen',
    Bordered = 'bordered',
    Borderless = 'borderless',
}

export interface WindowOptions {
    x?: number;
    y: number;
    width?: number;
    height?: number;
    name: string;
    style?: WindowStyle;
    onDraw: DrawEvent;
}

export class Window {
    private readonly _id: string;
    public get id(): string {
        return this._id;
    }

    private _style: WindowStyle = WindowStyle.Bordered;

    private _x: number;
    private _y: number;
    private _width: number = 100;
    public get width(): number {
        return this._width;
    }

    private _height: number = 100;
    public get height(): number {
        return this._height;
    }

    private _name: string = 'Croak';
    private _onDraw: DrawEvent;

    private _isShow: boolean = false;
    public get isShow(): boolean {
        return this._isShow;
    }

    public set isShow(value: boolean) {
        this._isShow = value;

        if (this._isShow) {
            Kernel.kernel.desktopCroaker.subscribeDrawEvent(this);
        } else {
            Kernel.kernel.desktopCroaker.unsubscribeDrawEvent(this);
        }
    }

    private _windowDiv: HTMLDivElement = undefined;
    public get windowDiv(): HTMLDivElement {
        return this._windowDiv;
    }

    private _windowCaption: HTMLDivElement = undefined;
    public get windowCaption(): HTMLDivElement {
        return this._windowCaption;
    }

    private _windowCanvas: HTMLCanvasElement = undefined;
    public get windowCanvas(): HTMLCanvasElement {
        return this._windowCanvas;
    }

    public lastUpdateTime: number = performance.now();

    constructor(pid: number, options: WindowOptions) {
        this._id = uuid().toString();

        this._name = options.name ?? this._name;
        this._style = options.style ?? options.style;
        this._onDraw = options.onDraw;

        if (this._style === WindowStyle.Bordered || this._style === WindowStyle.Borderless) {
            this._width = options.width ?? this._width;
            this._height = options.height ?? this._height;
            this._x = options.x;
            this._y = options.y;
        } else {
            this._width = Kernel.kernel.desktopCroaker.viewportWidth;
            this._height = Kernel.kernel.desktopCroaker.viewportHeight;
            this._x = 0;
            this._y = 0;
        }

        Kernel.kernel.desktopCroaker.registerWindow(pid, this);
    }

    public createWindowDomElement() {
        this._windowDiv = document.createElement('div');
        this._windowDiv.classList.add('window');
        this._windowDiv.classList.add('window--' + this._style);
        this._windowDiv.addEventListener('mousemove', this.onMouseMove.bind(this));
        this._windowDiv.addEventListener('mousedown', this.onMouseDown.bind(this));
        this._windowDiv.addEventListener('mouseup', this.onMouseUp.bind(this));

        this._windowCaption = document.createElement('div');
        this._windowCaption.classList.add('window-caption');
        this._windowCaption.addEventListener('mousemove', this.onMouseMove.bind(this));
        this._windowCaption.addEventListener('mousedown', this.onMouseDown.bind(this));
        this._windowCaption.addEventListener('mouseup', this.onMouseUp.bind(this));
        this._windowCaption.addEventListener('mouseleave', this.onMouseLeave.bind(this));

        const windowTitle = document.createElement('span');
        windowTitle.classList.add('window-caption--title');
        windowTitle.textContent = this._name;
        this._windowCaption.appendChild(windowTitle);

        this._windowDiv.appendChild(this._windowCaption);

        this._windowCanvas = document.createElement('canvas');
        this._windowCanvas.width = this.width;
        this._windowCanvas.height = this.height;
        this._windowDiv.appendChild(this._windowCanvas);
    }

    public invokeDrawEvent(zIndex: number): void {
        this._windowDiv.style.zIndex = `${zIndex + 100}`;
        this._windowDiv.style.top = `${this._y}px`;
        this._windowDiv.style.left = `${this._x}px`;
        this._windowDiv.style.width = `calc(${this.width}px + var(--window-border-width) * 2 + var(--window-border-outline-width) * 2)`;
        this._windowDiv.style.height = `calc(${this.height}px + var(--window-border-width) + var(--window-border-width) + var(--window-caption-height))`;

        const context = this._windowCanvas.getContext('2d');
        context.fillStyle = '#FFF';
        context.fillRect(0, 0, this.width, this.height);

        const delta = (performance.now() - this.lastUpdateTime);

        this._onDraw?.(context, delta);

        this.lastUpdateTime = performance.now();
    }

    private _isDrag: boolean = false;
    private _dragMousePosition: { x: number, y: number } = {x: 0, y: 0};
    private _dragWindowPosition: { x: number, y: number } = {x: 0, y: 0};


    private _lastFocusTime: number = Date.now();
    public get lastFocusTime (): number {
        return this._lastFocusTime;
    }

    public onMouseMove(event: MouseEvent) {
        if (this._isDrag && event.target === this._windowCaption) {
            const translation = {
                x: event.clientX - this._dragMousePosition.x,
                y: event.clientY - this._dragMousePosition.y,
            }

            this._x = this._dragWindowPosition.x + translation.x;
            this._y = this._dragWindowPosition.y + translation.y;
        }
    }

    public onMouseDown(event: MouseEvent) {
        if (event.target === this._windowCaption) {
            this._isDrag = true;
            this._dragMousePosition = {x: event.clientX, y: event.clientY};
            this._dragWindowPosition = {x: this._x, y: this._y};

            this._lastFocusTime = Date.now();
        }
    }

    public onMouseUp(event: MouseEvent) {
        if (event.target === this._windowCaption) {
            this._isDrag = false;
        }
    }

    public onMouseLeave(event: MouseEvent) {
        if (event.target === this._windowCaption) {
            this._isDrag = false;
        }
    }
}