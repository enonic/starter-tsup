import { Keyword }	from './Keyword';

export function isKeyword(keyword: string): keyword is Keyword {
	return Object.values(Keyword).includes(keyword as Keyword);
}
