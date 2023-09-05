import { isKeyword } from "./isKeyword";
import { isUrlScheme } from "./isUrlScheme";


export function normalizeDirectiveValue(directiveValue: string): string {
	directiveValue = directiveValue.trim();
	const directiveValueLower = directiveValue.toLowerCase();
	if (isKeyword(directiveValueLower) || isUrlScheme(directiveValue)) {
		return directiveValueLower;
	}
	return directiveValue;
}
