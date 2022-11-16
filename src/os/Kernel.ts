import Croaker from "./croakers/Croaker";
import DesktopCroaker from "./croakers/DesktopCroaker";
import WednesdayCroakers from "./croakers/WednesdayCroakers";


class Kernel {
    private _croakers: Map<string, Croaker>;

    public croak(): void {
        this.initCroakers();
    }

    private initCroakers(): void {
        this._croakers = new Map<string, Croaker>();
        this._croakers.set(DesktopCroaker.name, new DesktopCroaker());
    }

    private get wednesdayCroakers(): WednesdayCroakers {
        return {
            desktop: this._croakers.get(DesktopCroaker.name),
        };
    }


    private static _kernel: Kernel;
    public static get kernel() {
        return this._kernel ?? (this._kernel = new Kernel());
    }

    private constructor() 
    {}
}

export default Kernel;