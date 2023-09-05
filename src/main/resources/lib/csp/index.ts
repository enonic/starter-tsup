import {
	NONE,
	SELF,
	UNSAFE_EVAL,
	UNSAFE_INLINE
} from './Keyword';
import {
	DATA,
	FILESYSTEM,
	ABOUT,
	BLOB,
	WS,
	WSS,
} from './Scheme';
import {
	DEFAULT_SRC,
	CONNECT_SRC,
	FONT_SRC,
	IMG_SRC,
	SCRIPT_SRC,
	STYLE_SRC
} from './Directive';


export { ContentSecurityPolicy } from './ContentSecurityPolicy';
export {
	CHILD_SRC,
	CONNECT_SRC,
	DEFAULT_SRC,
	FONT_SRC,
	FRAME_SRC,
	IMG_SRC,
	MEDIA_SRC,
	OBJECT_SRC,
	PREFETCH_SRC,
	SCRIPT_SRC,
	SCRIPT_SRC_ATTR,
	SCRIPT_SRC_ELEM,
	STYLE_SRC,
	STYLE_SRC_ATTR,
	STYLE_SRC_ELEM,
	MANIFEST_SRC,
	WORKER_SRC,
	BASE_URI,
	PLUGIN_TYPES,
	SANDBOX,
	DISOWN_OPENER,
	FORM_ACTION,
	FRAME_ANCESTORS,
	NAVIGATE_TO,
	REPORT_TO,
	REPORT_URI,
	BLOCK_ALL_MIXED_CONTENT,
	REFERRER,
	REFLECTED_XSS,
	REQUIRE_SRI_FOR,
	REQUIRE_TRUSTED_TYPES_FOR,
	TRUSTED_TYPES,
	UPGRADE_INSECURE_REQUESTS,
	WEBRTC,
	Directive,
	type Directives
} from './Directive';
export { isDirective } from './isDirective';
export { isKeyword } from './isKeyword';
export { isUrlScheme } from './isUrlScheme';
export {
	ALLOW,
	BLOCK,
	NONE,
	REPORT_SAMPLE,
	SELF,
	STRICT_DYNAMIC,
	UNSAFE_EVAL,
	UNSAFE_HASHED_ATTRIBUTES,
	UNSAFE_HASHES,
	UNSAFE_INLINE,
	WASM_EVAL,
	WASM_UNSAFE_EVAL,
	Keyword
} from './Keyword';
export { nonce } from './nonce';
export { normalizeDirectiveValue } from './normalizeDirectiveValue';
export { q } from './q';
export {
	ABOUT,
	BLOB,
	DATA,
	FILESYSTEM,
	HTTPS,
	WS,
	WSS,
	Scheme
} from './Scheme';
export { sha256 } from './sha256';
export { sha384 } from './sha384';
export { sha512 } from './sha512';


export const ANY_HOST = '*';

export const DIRECTIVES_DEFAULT = {
	[DEFAULT_SRC]: [NONE],
	[CONNECT_SRC]: [SELF],
	[FONT_SRC]: [SELF],
	[IMG_SRC]: [SELF],
	[SCRIPT_SRC]: [SELF],
	[STYLE_SRC]: [SELF],
}

export const DIRECTIVES_PERMISSIVE = {
	[DEFAULT_SRC]: [
		ANY_HOST,
		UNSAFE_EVAL,
		UNSAFE_INLINE,
		DATA,
		FILESYSTEM,
		ABOUT,
		BLOB,
		WS,
		WSS,
	]
}
