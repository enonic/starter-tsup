export enum Directive {
	// Fetch directives
	CHILD_SRC = 'child-src',
	CONNECT_SRC = 'connect-src',
	DEFAULT_SRC = 'default-src',
	FONT_SRC = 'font-src',
	FRAME_SRC = 'frame-src',
	IMG_SRC = 'img-src',
	MEDIA_SRC = 'media-src',
	OBJECT_SRC = 'object-src',
	PREFETCH_SRC = 'prefetch-src',
	SCRIPT_SRC = 'script-src',
	SCRIPT_SRC_ATTR = 'script-src-attr',
	SCRIPT_SRC_ELEM = 'script-src-elem',
	STYLE_SRC = 'style-src',
	STYLE_SRC_ATTR = 'style-src-attr',
	STYLE_SRC_ELEM = 'style-src-elem',

	MANIFEST_SRC = 'manifest-src',
	WORKER_SRC = 'worker-src',

	// Document directives
	BASE_URI = 'base-uri',
	PLUGIN_TYPES = 'plugin-types',
	SANDBOX = 'sandbox',
	DISOWN_OPENER = 'disown-opener',

	// Navigation directives
	FORM_ACTION = 'form-action',
	FRAME_ANCESTORS = 'frame-ancestors',
	NAVIGATE_TO = 'navigate-to',

	// Reporting directives
	REPORT_TO = 'report-to',
	REPORT_URI = 'report-uri',

	// Other directives
	BLOCK_ALL_MIXED_CONTENT = 'block-all-mixed-content',
	REFERRER = 'referrer',
	REFLECTED_XSS = 'reflected-xss',
	REQUIRE_SRI_FOR = 'require-sri-for',
	REQUIRE_TRUSTED_TYPES_FOR = 'require-trusted-types-for',
	TRUSTED_TYPES = 'trusted-types',
	UPGRADE_INSECURE_REQUESTS = 'upgrade-insecure-requests',
	WEBRTC = 'webrtc',
}

export type Directives = Partial<Record<Directive, string[]>>;

export const CHILD_SRC = Directive.CHILD_SRC;
export const CONNECT_SRC = Directive.CONNECT_SRC;
export const DEFAULT_SRC = Directive.DEFAULT_SRC;
export const FONT_SRC = Directive.FONT_SRC;
export const FRAME_SRC = Directive.FRAME_SRC;
export const IMG_SRC = Directive.IMG_SRC;
export const MEDIA_SRC = Directive.MEDIA_SRC;
export const OBJECT_SRC = Directive.OBJECT_SRC;
export const PREFETCH_SRC = Directive.PREFETCH_SRC;
export const SCRIPT_SRC = Directive.SCRIPT_SRC;
export const SCRIPT_SRC_ATTR = Directive.SCRIPT_SRC_ATTR;
export const SCRIPT_SRC_ELEM = Directive.SCRIPT_SRC_ELEM;
export const STYLE_SRC = Directive.STYLE_SRC;
export const STYLE_SRC_ATTR = Directive.STYLE_SRC_ATTR;
export const STYLE_SRC_ELEM = Directive.STYLE_SRC_ELEM;

export const MANIFEST_SRC = Directive.MANIFEST_SRC;
export const WORKER_SRC = Directive.WORKER_SRC;

export const BASE_URI = Directive.BASE_URI;
export const PLUGIN_TYPES = Directive.PLUGIN_TYPES;
export const SANDBOX = Directive.SANDBOX;
export const DISOWN_OPENER = Directive.DISOWN_OPENER;

export const FORM_ACTION = Directive.FORM_ACTION;
export const FRAME_ANCESTORS = Directive.FRAME_ANCESTORS;
export const NAVIGATE_TO = Directive.NAVIGATE_TO;

export const REPORT_TO = Directive.REPORT_TO;
export const REPORT_URI = Directive.REPORT_URI;

export const BLOCK_ALL_MIXED_CONTENT = Directive.BLOCK_ALL_MIXED_CONTENT;
export const REFERRER = Directive.REFERRER;
export const REFLECTED_XSS = Directive.REFLECTED_XSS;
export const REQUIRE_SRI_FOR = Directive.REQUIRE_SRI_FOR;
export const REQUIRE_TRUSTED_TYPES_FOR = Directive.REQUIRE_TRUSTED_TYPES_FOR;
export const TRUSTED_TYPES = Directive.TRUSTED_TYPES;
export const UPGRADE_INSECURE_REQUESTS = Directive.UPGRADE_INSECURE_REQUESTS;
export const WEBRTC = Directive.WEBRTC;

