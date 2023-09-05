import { Directive } from './Directive';

export function isDirective(directive: string): directive is Directive {
	return Object.values(Directive).includes(directive as Directive);
}
