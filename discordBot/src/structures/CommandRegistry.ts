import { Collection } from 'discord.js';
import { Command } from './Command';

export class CommandRegistry {
  private readonly _commands: Collection<string, Command> = new Collection();

  public register(command: Command): void {
    if (this._commands.has(command.name)) {
      throw new Error(`El comando "${command.name}" ya está registrado`);
    }
    this._commands.set(command.name, command);
  }

  public registerAll(commands: Command[]): void {
    commands.forEach(cmd => this.register(cmd));
  }

  public get(name: string): Command | undefined {
    return this._commands.get(name);
  }

  public getAll(): Command[] {
    return Array.from(this._commands.values());
  }

  public getNames(): string[] {
    return Array.from(this._commands.keys());
  }

  public has(name: string): boolean {
    return this._commands.has(name);
  }

  public get size(): number {
    return this._commands.size;
  }

  public getCommandsData(): any[] {
    return this.getAll().map(cmd => cmd.data.toJSON());
  }
}
