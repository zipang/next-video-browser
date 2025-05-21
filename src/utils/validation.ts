/**
 * Safely parse a JSON string to a typed object <T>
 * Returns the provided default value if the parsed string
 * doesn't conform to validation or is NULL
 */
export function parseJSONString<T>(
	json: string | null,
	validator: (data: unknown) => T,
	defaultVal: T
): T {
	if (json === null) {
		return defaultVal;
	}

	try {
		return validator(JSON.parse(json));
	} catch (err) {
		console.warn(
			`parseJSONString(): Parsing "${json}" returned validation error ${(err as Error).message}`
		);
	}

	return defaultVal;
}
