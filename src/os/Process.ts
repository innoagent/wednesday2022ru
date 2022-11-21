abstract class Process {
    private static _pidCounter: number = 0;

    private readonly _pid: number;
    public get pid(): number {
        return this._pid;
    }

    protected constructor() {
        this._pid = Process._pidCounter++;
    }

    protected onStart(): void {

    }

    protected onDestroy(): void {

    }

}

export default Process;