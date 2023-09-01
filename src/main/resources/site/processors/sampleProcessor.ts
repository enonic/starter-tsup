import type {
	Request,
	Response,
} from '/index.d';


export function responseProcessor(_req: Request, res: Response) {

	res.headers['X-XP-App'] = app.name;

	return res;
};
