import Croaker from "./croakers/Croaker";
import DesktopCroaker from "./croakers/desktop/DesktopCroaker";


class Kernel {
    private _croakers: Map<string, Croaker>;

    public croak(): void {
        this.initCroakers();

        setInterval(() => {
            this.desktopCroaker.onUpdate();
        }, 1);
    }

    private initCroakers(): void {
        this._croakers = new Map<string, Croaker>();
        this._croakers.set(DesktopCroaker.name, new DesktopCroaker());
    }

    public get desktopCroaker(): DesktopCroaker {
        return this._croakers.get(DesktopCroaker.name) as DesktopCroaker;
    }


    private static _kernel: Kernel;
    public static get kernel() {
        return this._kernel ?? (this._kernel = new Kernel());
    }

    private constructor()
    {}
}

export default Kernel;