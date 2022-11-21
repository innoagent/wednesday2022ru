import Croaker from "../Croaker";
import { Window } from "./Window";


class DesktopCroaker extends Croaker {
    private readonly _desktopRoot: HTMLBodyElement;
    private readonly _windows: Map<number, Array<Window>>;
    private _drawableWindows: Map<string, Window>;

    public constructor() {
        super();
        this._desktopRoot = document.body as HTMLBodyElement;
        this._windows = new Map<number, Array<Window>>();
        this._drawableWindows = new Map<string, Window>();
    }

    public get viewportWidth(): number {
        return this._desktopRoot.clientWidth;
    }

    public get viewportHeight(): number {
        return this._desktopRoot.clientHeight;
    }

    public registerWindow(pid: number, window: Window): void {
        if(this._windows.has(pid)) {
            this._windows.set(pid, [...this._windows.get(pid), window]);
        } else {
            this._windows.set(pid, [window]);
        }
    }

    public subscribeDrawEvent(window: Window): void {
        window.createWindowDomElement();
        this._desktopRoot.appendChild(window.windowDiv);
        this._drawableWindows.set(window.id, window);
    }

    public unsubscribeDrawEvent(window: Window): void {
        if(this._drawableWindows.has(window.id)) {
            this._desktopRoot.removeChild(this._drawableWindows.get(window.id).windowDiv);
            this._drawableWindows.delete(window.id);
        }
    }

    public onUpdate() {
        const drawableWindows: Array<Window> = [];
        this._drawableWindows.forEach((window) => drawableWindows.push(window));
        drawableWindows.sort((a, b) => a.lastFocusTime - b.lastFocusTime);
        drawableWindows.forEach((window, index) => window.invokeDrawEvent(index))
    }
}

export default DesktopCroaker;