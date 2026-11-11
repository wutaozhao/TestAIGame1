export type Direction = -1 | 1;
export type MovementControl = 'left' | 'right' | 'jump';

export const ARENA_HALF_WIDTH = 400;
export const FIGHTER_SIZE = 56;

const WALK_SPEED = 260;
const JUMP_SPEED = 650;
const GRAVITY = 1700;
const FIGHTER_X_LIMIT = ARENA_HALF_WIDTH - FIGHTER_SIZE / 2;

export class FighterMovement {
    private readonly controls = new Set<MovementControl>();
    private verticalSpeed = 0;

    x: number;
    facing: Direction;
    height = 0;

    constructor(x: number, facing: Direction) {
        this.x = x;
        this.facing = facing;
    }

    setControl(control: MovementControl, pressed: boolean): void {
        if (!pressed) {
            this.controls.delete(control);
            return;
        }

        if (control === 'jump' && !this.controls.has(control) && this.height === 0 && this.verticalSpeed === 0) {
            this.verticalSpeed = JUMP_SPEED;
        }
        this.controls.add(control);
    }

    clearControls(): void {
        this.controls.clear();
    }

    update(dt: number): void {
        if (dt <= 0) {
            return;
        }

        const direction = Number(this.controls.has('right')) - Number(this.controls.has('left'));
        if (direction !== 0) {
            this.facing = direction > 0 ? 1 : -1;
            const nextX = this.x + direction * WALK_SPEED * dt;
            this.x = Math.max(-FIGHTER_X_LIMIT, Math.min(FIGHTER_X_LIMIT, nextX));
        }

        const nextHeight = this.height + this.verticalSpeed * dt - GRAVITY * dt * dt / 2;
        this.height = Math.max(0, nextHeight);
        this.verticalSpeed = this.height > 0 ? this.verticalSpeed - GRAVITY * dt : 0;
    }
}
