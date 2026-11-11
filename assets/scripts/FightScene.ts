import { _decorator, Color, Component, Game, game, Graphics, input, Input, KeyCode, Node } from 'cc';
import type { EventKeyboard } from 'cc';
import { ARENA_HALF_WIDTH, FIGHTER_SIZE, FighterMovement } from './ArenaMovement';
import type { MovementControl } from './ArenaMovement';

const { ccclass } = _decorator;
const FLOOR_Y = -130;
const SPAWN_X = 175;

@ccclass('FightScene')
export class FightScene extends Component {
    private readonly red = new FighterMovement(-SPAWN_X, 1);
    private readonly blue = new FighterMovement(SPAWN_X, -1);
    private readonly bindings = new Map<KeyCode, [FighterMovement, MovementControl]>([
        [KeyCode.KEY_A, [this.red, 'left']],
        [KeyCode.KEY_D, [this.red, 'right']],
        [KeyCode.KEY_W, [this.red, 'jump']],
        [KeyCode.ARROW_LEFT, [this.blue, 'left']],
        [KeyCode.ARROW_RIGHT, [this.blue, 'right']],
        [KeyCode.ARROW_UP, [this.blue, 'jump']],
    ]);

    private redNode!: Node;
    private blueNode!: Node;

    onLoad(): void {
        this.drawArena();
        this.redNode = this.createFighter('Red', new Color(230, 75, 87));
        this.blueNode = this.createFighter('Blue', new Color(59, 132, 236));
        this.renderFighter(this.redNode, this.red);
        this.renderFighter(this.blueNode, this.blue);
    }

    onEnable(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        game.on(Game.EVENT_HIDE, this.clearControls, this);
        if (typeof window !== 'undefined') {
            game.canvas?.addEventListener('blur', this.clearControls);
            window.addEventListener('blur', this.clearControls);
        }
    }

    onDisable(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        game.off(Game.EVENT_HIDE, this.clearControls, this);
        if (typeof window !== 'undefined') {
            game.canvas?.removeEventListener('blur', this.clearControls);
            window.removeEventListener('blur', this.clearControls);
        }
        this.clearControls();
    }

    update(dt: number): void {
        const step = Math.min(dt, 0.05);
        this.red.update(step);
        this.blue.update(step);
        this.renderFighter(this.redNode, this.red);
        this.renderFighter(this.blueNode, this.blue);
    }

    private onKeyDown(event: EventKeyboard): void {
        this.setKey(event.keyCode, true);
    }

    private onKeyUp(event: EventKeyboard): void {
        this.setKey(event.keyCode, false);
    }

    private setKey(keyCode: KeyCode, pressed: boolean): void {
        const binding = this.bindings.get(keyCode);
        if (binding) {
            const [fighter, control] = binding;
            fighter.setControl(control, pressed);
        }
    }

    private readonly clearControls = (): void => {
        this.red.clearControls();
        this.blue.clearControls();
    };

    private drawArena(): void {
        const graphics = this.createGraphics('Arena');
        const width = ARENA_HALF_WIDTH * 2;
        graphics.fillColor = new Color(21, 30, 48);
        graphics.rect(-ARENA_HALF_WIDTH, FLOOR_Y, width, 320);
        graphics.fill();

        graphics.fillColor = new Color(85, 103, 128);
        graphics.rect(-ARENA_HALF_WIDTH, FLOOR_Y - 12, width, 12);
        graphics.rect(-ARENA_HALF_WIDTH - 4, FLOOR_Y, 4, 320);
        graphics.rect(ARENA_HALF_WIDTH, FLOOR_Y, 4, 320);
        graphics.fill();
    }

    private createFighter(name: string, color: Color): Node {
        const graphics = this.createGraphics(name);
        const half = FIGHTER_SIZE / 2;
        graphics.fillColor = color;
        graphics.rect(-half, -half, FIGHTER_SIZE, FIGHTER_SIZE);
        graphics.fill();

        graphics.fillColor = Color.WHITE;
        graphics.moveTo(-6, -8);
        graphics.lineTo(9, 0);
        graphics.lineTo(-6, 8);
        graphics.close();
        graphics.fill();
        return graphics.node;
    }

    private createGraphics(name: string): Graphics {
        const node = new Node(name);
        node.layer = this.node.layer;
        this.node.addChild(node);
        return node.addComponent(Graphics);
    }

    private renderFighter(node: Node, fighter: FighterMovement): void {
        node.setPosition(fighter.x, FLOOR_Y + FIGHTER_SIZE / 2 + fighter.height);
        node.setScale(fighter.facing, 1, 1);
    }
}
