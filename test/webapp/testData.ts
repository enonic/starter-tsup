export const VHOST_LIST = [
	{
		"name": "webapp",
		"source": "/webapp",
		"target": "/webapp/com.acme.example.tsup",
		"host": "localhost",
		"defaultIdProviderKey": "system",
		"idProviderKeys": [
			{
				"idProviderKey": "system"
			}
		]
	},
	{
		"name": "admin",
		"source": "/admin",
		"target": "/admin",
		"host": "localhost",
		"defaultIdProviderKey": "system",
		"idProviderKeys": [
			{
				"idProviderKey": "system"
			}
		]
	},
	{
		"name": "site",
		"source": "/",
		"target": "/site/default/master/a-site",
		"host": "localhost",
		"defaultIdProviderKey": "system",
		"idProviderKeys": [
			{
				"idProviderKey": "system"
			}
		]
	}
];
